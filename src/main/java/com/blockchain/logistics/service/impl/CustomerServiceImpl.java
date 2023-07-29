package com.blockchain.logistics.service.impl;

import com.blockchain.logistics.dto.asset.*;
import com.blockchain.logistics.exception.CustomerServiceException;
import com.blockchain.logistics.exception.GenericException;
import com.blockchain.logistics.persistence.entity.Users;
import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.dto.asset.*;
import com.blockchain.logistics.lib.constant.AssetStateMap;
import com.blockchain.logistics.lib.constant.TrackingMessages;
import com.blockchain.logistics.persistence.entity.AssetTransactionsList;
import com.blockchain.logistics.persistence.entity.Assets;
import com.blockchain.logistics.persistence.repository.AssetTransactionsListRepository;
import com.blockchain.logistics.persistence.repository.AssetsRepository;
import com.blockchain.logistics.persistence.repository.UserRepository;
import com.blockchain.logistics.service.CustomerService;
import com.blockchain.logistics.service.impl.helper.BlockChainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.*;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.WalletUtils;
import org.web3j.model.Logistics;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple9;

import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import static com.blockchain.logistics.lib.constant.AssetStateMap.INTEGER_STATE_TO_ASSET_STATE;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private static final String UNABLE_TO_LOAD_WALLET_FILE_MSG = "Unable to load wallet file";
    private static final String CUSTOMER_SERVICE_ERROR_MSG = "Error occurred while requesting for cancellation";

    @Value("${chain.account.wallet-directory}")
    private String walletFileDirectory;

    private final Logistics logistics;
    private final BlockChainService blockChainService;

    private final AssetsRepository assetsRepository;
    private final AssetTransactionsListRepository listRepository;
    private final UserRepository userRepository;

    @Override
    public AssetResponse returnSingleAssetDetailsWithLocationData(String assetId, String username) {
        var user = existingUser(username);

        try {
            var walletFile = user.getWalletFileName();
            var credentials = WalletUtils.loadCredentials(username, walletFileDirectory + walletFile);

            Function functionToRetrieveAssetDetails = new Function(Logistics.FUNC_ASSETMAPPING,
                    List.of(new Utf8String(assetId)),
                    Arrays.asList(
                            new TypeReference<Utf8String>() {},
                            new TypeReference<Utf8String>() {},
                            new TypeReference<Utf8String>() {},
                            new TypeReference<Utf8String>() {},
                            new TypeReference<Utf8String>() {},
                            new TypeReference<Utf8String>() {},
                            new TypeReference<Uint8>() {},
                            new TypeReference<Uint8>() {},
                            new TypeReference<Address>() {}
                    ));

            var executionResponse = blockChainService.signAndTransactOnLogisticsContractToGetValues(functionToRetrieveAssetDetails, credentials);
            var assetResponse = getTuples(executionResponse);

            Function functionToRetrieveTrackingDetails = new Function(Logistics.FUNC_RETURNSINGLETRACKINGINFO,
                    List.of(new Utf8String(assetId)),
                    List.of(new TypeReference<DynamicArray<Logistics.TrackingInformation>>() {
                    })
            );

            executionResponse = blockChainService.signAndTransactOnLogisticsContractToGetValues(functionToRetrieveTrackingDetails, credentials);
            var trackingResponse = getTrackingDetails(executionResponse);

            log.info("Received asset details from the network. Sending it back to the user");

            return buildAssetResponse(assetResponse, trackingResponse);
        } catch (IOException | CipherException e) {
            log.error(UNABLE_TO_LOAD_WALLET_FILE_MSG);
            throw new CustomerServiceException(CUSTOMER_SERVICE_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error in returning single asset details: {}", e.getMessage());
            throw new GenericException("Error in returning single asset details", e);
        }
    }

    @Override
    public List<TrackingDetails> returnTrackingDetailsForUser(String assetId, String username) {
        var user = existingUser(username);

        try {
            var walletFile = user.getWalletFileName();
            var credentials = WalletUtils.loadCredentials(username, walletFileDirectory + walletFile);

            Function function = new Function(Logistics.FUNC_RETURNSINGLETRACKINGINFO,
                    List.of(new Utf8String(assetId)),
                    List.of(new TypeReference<DynamicArray<Logistics.TrackingInformation>>() {
                    })
            );

            var executionResponse = blockChainService.signAndTransactOnLogisticsContractToGetValues(function, credentials);
            var trackingResponse = getTrackingDetails(executionResponse);

            log.info("Received asset tracking details from the network. Sending it back to the user");

            return buildTrackingResponse(trackingResponse);
        } catch (IOException | CipherException e) {
            log.error(UNABLE_TO_LOAD_WALLET_FILE_MSG);
            throw new CustomerServiceException(CUSTOMER_SERVICE_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error in asset tracking  details: {}", e.getMessage());
            throw new GenericException("Error in asset tracking  details", e);
        }
    }

    @Override
    public String requestForCancellation(String assetId, String username) {
        var user = existingUser(username);

        TransactionReceipt response;
        var trackingMsg = TrackingMessages.REQUEST_FOR_CANCELLATION_MSG;
        var state = BigInteger.valueOf(6);

        try {
            var walletFile = user.getWalletFileName();
            var credentials = WalletUtils.loadCredentials(username, walletFileDirectory + walletFile);

            Function function = new Function(Logistics.FUNC_SAVETRACKINGHISTORY,
                    Arrays.asList(
                            new org.web3j.abi.datatypes.Utf8String(assetId),
                            new org.web3j.abi.datatypes.Utf8String(trackingMsg),
                            new org.web3j.abi.datatypes.generated.Uint256(state)),
                    Collections.emptyList());

            response = blockChainService.signAndTransactOnLogisticsContract(function, credentials);
        } catch (IOException | CipherException e) {
            log.error(UNABLE_TO_LOAD_WALLET_FILE_MSG);
            throw new CustomerServiceException(CUSTOMER_SERVICE_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error(CUSTOMER_SERVICE_ERROR_MSG + ": {}", e.getMessage());
            throw new CustomerServiceException(CUSTOMER_SERVICE_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        log.info("Asset cancellation request acknowledge successfully on the network");

        updateAssetTransactions(assetId, response.getTransactionHash(), state, trackingMsg, LocalDateTime.now().toString());

        return logistics.getGenericLogEvents(response).get(0).logMsg;
    }

    private Users existingUser(String username) {
        var user = userRepository.findByEmail(username);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new CustomerServiceException("No user found", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public AssetTransactionsDto getAssetTransactionsWithHash(String assetId, String username) {
        Optional<Assets> assetTransactionsList = assetsRepository.findByAssetId(assetId);

        return assetTransactionsList.map(this::convertToAssetTransaction).orElse(null);
    }



    private AssetResponse buildAssetResponse
            (Tuple9<String, String, String, String, String, String, BigInteger, BigInteger, String> response,
             List<Logistics.TrackingInformation> trackingInformationList) {
        return AssetResponse.builder()
                .assetId(response.component1())
                .assetName(response.component2())
                .info(response.component3())
                .assetCreationTime(response.component4())
                .sourceAddress(response.component5())
                .destinationAddress(response.component6())
                .trackingDetails(buildTrackingResponse(trackingInformationList))
                .quantity(response.component7().intValue())
                .assetState(AssetStateMap.INTEGER_STATE_TO_ASSET_STATE.get(response.component8()))
                .build();
    }

    private List<TrackingDetails> buildTrackingResponse
            (List<Logistics.TrackingInformation> trackingInformationList) {
        List<TrackingDetails> trackingDetailList = new ArrayList<>();

        for (Logistics.TrackingInformation info : trackingInformationList) {
            TrackingDetails trackingDetails = TrackingDetails.builder()
                    .details(info.allTrackingDetails)
                    .build();

            trackingDetailList.add(trackingDetails);
        }

        return trackingDetailList;
    }

    private AssetTransactionsDto convertToAssetTransaction(Assets assetTransactionsFromDb) {
        AssetTransactionsDto assetTransaction = new AssetTransactionsDto();
        assetTransaction.setAssetId(assetTransactionsFromDb.getAssetId());

        List<AssetTransactionsListDto> assetTransactionsList = new ArrayList<>();

        assetTransactionsFromDb.getTransactionsList().forEach(t -> {
            AssetTransactionsListDto assetTransactionsListObj = new AssetTransactionsListDto();

            assetTransactionsListObj.setTransactionHash(t.getTransactionHash());
            assetTransactionsListObj.setTransactionTime(t.getTransactionTime());
            assetTransactionsListObj.setTrackingMessage(t.getTrackingMsg());

            assetTransactionsList.add(assetTransactionsListObj);
        });

        assetTransaction.setTransactions(assetTransactionsList);

        return assetTransaction;
    }

    private void updateAssetTransactions(String assetId, String transactionHash, BigInteger state, String
            trackingMsg, String currentTime) {
        var asset = assetsRepository.findByAssetId(assetId);
        var trackingState = INTEGER_STATE_TO_ASSET_STATE.get(state);

        if (asset.isPresent()) {
            var updateAsset = asset.get();
            var lastTransaction = updateAsset.getTransactionsList().size() - 1;

            if (Boolean.FALSE.equals(asset.get().getIsDelivered())) {
                if (!updateAsset.getTransactionsList().get(lastTransaction).getState().equals(trackingState)) {
                    AssetTransactionsList transactionsList = new AssetTransactionsList();

                    transactionsList.setTransactions(asset.get());
                    transactionsList.setTransactionHash(transactionHash);
                    transactionsList.setState(trackingState);
                    transactionsList.setTrackingMsg(trackingMsg);
                    transactionsList.setTransactionTime(currentTime);

                    listRepository.save(transactionsList);
                } else {
                    log.error("Package already marked as cancelled. Please check the state you are moving the package to");
                    throw new CustomerServiceException("Package already marked as cancelled."
                            + " Please check the state you are moving the package to", HttpStatus.BAD_REQUEST);
                }
            } else {
                log.error("Asset is already delivered");
                throw new CustomerServiceException("Asset is already delivered", HttpStatus.BAD_REQUEST);
            }
        } else {
            log.error("Asset not found in DB");
            throw new CustomerServiceException("Asset not found", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Tuple9<String, String, String, String, String, String, BigInteger, BigInteger, String> getTuples
            (List<Type> executionResult) {
        return new Tuple9<>(
                (String) executionResult.get(0).getValue(),
                (String) executionResult.get(1).getValue(),
                (String) executionResult.get(2).getValue(),
                (String) executionResult.get(3).getValue(),
                (String) executionResult.get(4).getValue(),
                (String) executionResult.get(5).getValue(),
                (BigInteger) executionResult.get(6).getValue(),
                (BigInteger) executionResult.get(7).getValue(),
                (String) executionResult.get(8).getValue());
    }

    @SuppressWarnings("unchecked")
    private List<Logistics.TrackingInformation> getTrackingDetails(List<Type> executionResult) {
        return (List<Logistics.TrackingInformation>) executionResult.get(0).getValue();
    }
}
