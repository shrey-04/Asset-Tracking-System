package com.blockchain.logistics.service.impl;

import com.blockchain.logistics.dto.asset.AssetCreationResponse;
import com.blockchain.logistics.dto.asset.AssetRequest;
import com.blockchain.logistics.dto.asset.AssetResponse;
import com.blockchain.logistics.exception.GenericException;
import com.blockchain.logistics.exception.MerchantServiceException;
import com.blockchain.logistics.persistence.entity.Users;
import com.blockchain.logistics.service.MerchantService;
import com.blockchain.logistics.service.impl.helper.NotificationSender;
import com.blockchain.logistics.dto.asset.*;
import com.blockchain.logistics.lib.constant.AssetStateEnum;
import com.blockchain.logistics.lib.constant.TrackingMessages;
import com.blockchain.logistics.persistence.entity.AssetTransactionsList;
import com.blockchain.logistics.persistence.entity.Assets;
import com.blockchain.logistics.persistence.repository.AssetTransactionsListRepository;
import com.blockchain.logistics.persistence.repository.AssetsRepository;
import com.blockchain.logistics.persistence.repository.UserRepository;
import com.blockchain.logistics.service.impl.helper.BlockChainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Function;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.WalletUtils;
import org.web3j.model.Logistics;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import javax.transaction.Transactional;
import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

import static com.blockchain.logistics.lib.constant.AssetStateMap.INTEGER_STATE_TO_ASSET_STATE;

@Slf4j
@Service
@RequiredArgsConstructor
public class MerchantServiceImpl implements MerchantService {

    private static final String WALLET_CREATION_ERROR_MSG = "Error occurred while loading wallet file";

    @Value("${chain.account.wallet-directory}")
    private String walletFileDirectory;

    private final Logistics logistics;
    private final BlockChainService blockChainService;
    private final NotificationSender notificationSender;

    private final AssetsRepository assetsRepository;
    private final AssetTransactionsListRepository listRepository;
    private final UserRepository userRepository;
//    private final TradeInitiationRequestRepository tradeInitiationRequestRepository;

    @Override
    @Transactional
    public AssetCreationResponse createAsset(AssetRequest asset, String username) {
        var user = existingUser(username);

        var info = Objects.isNull(asset.getInfo()) ? "" : asset.getInfo();
        var currentTime = LocalDateTime.now().toString();
        var trackingMsg = TrackingMessages.INITIAL_MSG;

        var sourceAddress = asset.getOriginAddress().getAddress();
        var destinationAddress = asset.getDestinationAddress().getAddress();
        var quantity = BigInteger.valueOf(asset.getQuantity());

        try {
            var walletFile = user.getWalletFileName();
            var credentials = WalletUtils.loadCredentials(username, walletFileDirectory + walletFile);

            Function assetCreationFunction = new Function(Logistics.FUNC_GENERATEASSET,
                    Arrays.asList(
                            new org.web3j.abi.datatypes.Utf8String(UUID.randomUUID().toString()),
                            new org.web3j.abi.datatypes.Utf8String(asset.getAssetName()),
                            new org.web3j.abi.datatypes.Utf8String(info),
                            new org.web3j.abi.datatypes.Utf8String(currentTime),
                            new org.web3j.abi.datatypes.Utf8String(sourceAddress),
                            new org.web3j.abi.datatypes.Utf8String(destinationAddress),
                            new org.web3j.abi.datatypes.generated.Uint8(quantity),
                            new org.web3j.abi.datatypes.Utf8String(trackingMsg)),
                    Collections.emptyList());

            var assetCreationResponse = blockChainService.signAndTransactOnLogisticsContract(assetCreationFunction, credentials);

            String transactionHash = assetCreationResponse.getTransactionHash();
            log.info("Asset created successfully with hash: {}", transactionHash);

//            Function tokenCreationFunction = new Function(LogisticsNativeToken.FUNC_MINT,
//                    List.of(new Uint256(asset.getTokenAmount())), Collections.emptyList());

//            var tokenMintingResponse = blockChainService.signAndTransactOnNativeTokenContract(tokenCreationFunction, credentials);
//            log.info("Token minted successfully with hash: {}", tokenMintingResponse.getTransactionHash());

//            transferTokenToConsignee(asset, credentials);

            log.info("Successfully create an Asset on the network at block no:{} and with transaction hash: {}",
                    assetCreationResponse.getBlockNumber(), transactionHash);

            var trackingId = logistics.getSendTrackingIDEvents(assetCreationResponse).get(0).trackId;

            saveAssetTransactionHash(asset, trackingId, transactionHash, trackingMsg, currentTime);

            var notificationToUser = userRepository.findByEmail(asset.getDestinationAddress().getEmail());

            notificationToUser.ifPresent(u ->
                    notificationSender.sendNotification(u, asset.getDestinationAddress().getEmail(),
                            "Asset Created successfully with asset id: " + trackingId
                    ));

            return new AssetCreationResponse(trackingId, transactionHash);
        } catch (MerchantServiceException e) {
            log.error("{}", e.getMessage());
            throw new MerchantServiceException(e.getMessage(), e.getHttpStatus());
        } catch (IOException | CipherException e) {
            log.error(WALLET_CREATION_ERROR_MSG);
            throw new MerchantServiceException(WALLET_CREATION_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error occurred while creating an Asset: {}", e.getMessage());
            log.debug("Error occurred while creating an Asset: {}", e.getStackTrace());
            throw new MerchantServiceException("Error occurred while creating an Asset: " + e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String updateTrackingOnBlockChain(String id, String trackingMsg, BigInteger state, String username) {
        var user = existingUser(username);

        TransactionReceipt response;
        try {
            var walletFile = user.getWalletFileName();
            var credentials = WalletUtils.loadCredentials(username, walletFileDirectory + walletFile);

            Function function = new Function(Logistics.FUNC_SAVETRACKINGHISTORY,
                    Arrays.asList(
                            new org.web3j.abi.datatypes.Utf8String(id),
                            new org.web3j.abi.datatypes.Utf8String(trackingMsg),
                            new org.web3j.abi.datatypes.generated.Uint256(state)),
                    Collections.emptyList());

            response = blockChainService.signAndTransactOnLogisticsContract(function, credentials);
        } catch (IOException | CipherException e) {
            log.error(WALLET_CREATION_ERROR_MSG);
            throw new MerchantServiceException(WALLET_CREATION_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error occurred while writing transaction on the network: {}", e.getMessage());
            throw new GenericException("Error occurred while writing transaction on the network", e);
        }

        log.info("Updated tracking details with message: {} and at block no: {}", trackingMsg, response.getBlockNumber());

        var transactionHash = response.getTransactionHash();

        var asset = assetsRepository.findByAssetId(id);

        AtomicBoolean stateChanged = new AtomicBoolean(false);

        asset.ifPresent(assetTransactions -> assetTransactions.getTransactionsList()
                .forEach(a -> {
                    if (a.getState().equals(AssetStateEnum.RETURNED)) {
                        stateChanged.set(true);
                    }
                }));

        if (!stateChanged.get() || INTEGER_STATE_TO_ASSET_STATE.get(state).equals(AssetStateEnum.RETURN_COMPLETE)) {
            updateAssetTransactions(id, transactionHash, state, trackingMsg, LocalDateTime.now().toString());
        } else {
            throw new MerchantServiceException("Invalid state or package is already delivered", HttpStatus.BAD_REQUEST);
        }

        return logistics.getGenericLogEvents(response).get(0).logMsg;
    }

    //No Location data will be returned. We'll make a call to returnTrackingDetailsToUser("assetId") from CustomerServiceImpl to return trackingInfo to Front End
    @Override
    public List<AssetResponse> getAllAssets(String username) {
        var user = existingUser(username);

        try {
            var walletFile = user.getWalletFileName();
            var credentials = WalletUtils.loadCredentials(username, walletFileDirectory + walletFile);

            log.info("{} Requested to fetch all assets", username);

            Function function = new Function(Logistics.FUNC_RETURNALLASSETS,
                    List.of(),
                    List.of(new TypeReference<DynamicArray<Logistics.Asset>>() {
                    })
            );

            var executionResult = blockChainService.signAndTransactOnLogisticsContractToGetValues(function, credentials);
            var response = (List<Logistics.Asset>) executionResult.get(0).getValue();

            return buildAssetResponseList(response);
        } catch (IOException | CipherException e) {
            log.error(WALLET_CREATION_ERROR_MSG);
            throw new MerchantServiceException(WALLET_CREATION_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error occurred while retrieving the details of all Assets: {}", e.getMessage());
            log.debug("Error occurred while retrieving the details of all Assets: {}", e.getStackTrace());
            throw new MerchantServiceException("Error occurred while retrieving the details of all Assets", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Users existingUser(String username) {
        var user = userRepository.findByEmail(username);

        if (user.isPresent()) {
            return user.get();
        } else {
            log.error("User not found");
            throw new MerchantServiceException("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    private void transferTokenToConsignee(AssetRequest assetRequest, Credentials credentials)
//            throws CipherException, IOException, TransactionException, ExecutionException, InterruptedException {
//
//        if (Objects.nonNull(assetRequest.getDestinationAddress())) {
//            var consigneeEmail = assetRequest.getDestinationAddress().getEmail();
//            var consignee = userRepository.findByEmail(consigneeEmail);
//
//            if (consignee.isPresent()) {
//                var consigneeWalletFile = consignee.get().getWalletFileName();
//                var consigneeCredentials =
//                        WalletUtils.loadCredentials(consigneeEmail, walletFileDirectory + consigneeWalletFile);
//                var tokens = assetRequest.getTokenAmount().doubleValue() * 0.8;
//                BigInteger tokenAmount = BigDecimal.valueOf(tokens).toBigInteger();
//
//                Function tokenTransferFunction = new org.web3j.abi.datatypes.Function(
//                        LogisticsNativeToken.FUNC_TRANSFER,
//                        Arrays.asList(
//                                new org.web3j.abi.datatypes.Address(160, consigneeCredentials.getAddress()),
//                                new org.web3j.abi.datatypes.generated.Uint256(tokenAmount)),
//                        Collections.emptyList());
//
//                var tokenTransferResponse = blockChainService.signAndTransactOnTokenContract(tokenTransferFunction, credentials);
//
//                log.info("Successfully transferred the token to consignee. Block hash is: {}", tokenTransferResponse.getTransactionHash());
//            }
//        }
//    }

//    @Override
//    public void transferTokenToConsignee(String assetId)
//            throws CipherException, IOException, TransactionException, ExecutionException, InterruptedException {
//
//        Optional<Assets> asset = assetsRepository.findByAssetId(assetId);
//
//        if (Objects.nonNull(asset.get().getReceiverEmail()) && Objects.nonNull(asset.get().getSenderEmail())) {
//            var consigneeEmail = asset.get().getReceiverEmail();
//            var consignee = userRepository.findByEmail(consigneeEmail);
//            var supplierEmail = asset.get().getSenderEmail();
//            var supplier = userRepository.findByEmail(supplierEmail);
//
//            if (consignee.isPresent() && supplier.isPresent()) {
//                var consigneeWalletFile = consignee.get().getWalletFileName();
//                var consigneeCredentials =
//                        WalletUtils.loadCredentials(consigneeEmail, walletFileDirectory + consigneeWalletFile);
//
//                var supplierWalletFile = supplier.get().getWalletFileName();
//                var supplierCredentials =
//                        WalletUtils.loadCredentials(supplierEmail, walletFileDirectory + supplierWalletFile);
//
//                var tokens = (asset.get().getTokenAmount() * 0.8);
//                BigInteger tokenAmount = BigDecimal.valueOf(tokens).toBigInteger();
//
//                Function tokenTransferFunction = new Function(
//                        LogisticsNativeToken.FUNC_TRANSFER,
//                        Arrays.asList(
//                                new Address(160, consigneeCredentials.getAddress()),
//                                new Uint256(tokenAmount)),
//                        Collections.emptyList());
//
//                var tokenTransferResponse = blockChainService.signAndTransactOnNativeTokenContract(tokenTransferFunction, supplierCredentials);
//
//                log.info("Successfully transferred the token to consignee. Block hash is: {}", tokenTransferResponse.getTransactionHash());
//            }
//        }
//    }

//    @Override
//    public List<TradeInitiationRequestDto> viewPendingTradeRequests(Boolean pendingRequest, String username) {
//        var pendingRequests = tradeInitiationRequestRepository.findByPendingRequest(pendingRequest, username);
//
//        List<TradeInitiationRequestDto> tradeInitiationRequestDtoList = new ArrayList<>();
//
//        pendingRequests.forEach(pendingTradeRequest -> {
//            TradeInitiationRequestDto tradeInitiationRequestDto = TradeInitiationRequestDto.builder()
//                    .assetName(pendingTradeRequest.getAssetName())
//                    .assetType(pendingTradeRequest.getAssetType())
//                    .info(pendingTradeRequest.getInfo())
//                    .quantity(pendingTradeRequest.getQuantity())
//                    .tokenAmount(pendingTradeRequest.getTokenAmount())
//                    .senderName(pendingTradeRequest.getSenderName())
//                    .senderEmail(pendingTradeRequest.getSenderEmail())
//                    .senderAddress(pendingTradeRequest.getSenderAddress())
//                    .senderMobileNo(pendingTradeRequest.getSenderMobileNo())
//                    .receiverName(pendingTradeRequest.getReceiverName())
//                    .receiverEmail(pendingTradeRequest.getReceiverEmail())
//                    .receiverAddress(pendingTradeRequest.getReceiverAddress())
//                    .receiverMobileNo(pendingTradeRequest.getReceiverMobileNo())
//                    .uniqueTradeId(pendingTradeRequest.getUniqueTradeId())
//                    .build();
//
//            tradeInitiationRequestDtoList.add(tradeInitiationRequestDto);
//        });
//
//        return tradeInitiationRequestDtoList;
//    }

//    @Override
//    @Transactional
//    public AssetCreationResponse createTradeAsset(String uniqueTradeId, String username) {
//        var pendingTradeRequest = tradeInitiationRequestRepository.findByUniqueTradeId(uniqueTradeId);
//
//        var asset = AssetRequest.builder()
//                .assetName(pendingTradeRequest.getAssetName())
//                .assetType(pendingTradeRequest.getAssetType())
//                .info(pendingTradeRequest.getInfo())
//                .quantity(pendingTradeRequest.getQuantity())
//                .tokenAmount(pendingTradeRequest.getTokenAmount())
//                .originAddress(SourceAddressDetails.builder()
//                        .name(pendingTradeRequest.getSenderName())
//                        .email(pendingTradeRequest.getSenderEmail())
//                        .address(pendingTradeRequest.getSenderAddress())
//                        .mobileNo(pendingTradeRequest.getSenderMobileNo())
//                        .build())
//                .destinationAddress(DestinationAddressDetails.builder()
//                        .name(pendingTradeRequest.getReceiverName())
//                        .email(pendingTradeRequest.getReceiverEmail())
//                        .address(pendingTradeRequest.getReceiverAddress())
//                        .mobileNo(pendingTradeRequest.getReceiverMobileNo())
//                        .build())
//                .build();
//
//        var response = createAsset(asset, username);
//
//        pendingTradeRequest.setPendingRequest(false);
//
//        tradeInitiationRequestRepository.save(pendingTradeRequest);
//
//        var notificationToUser = userRepository.findByEmail(pendingTradeRequest.getReceiverEmail());
//
//        notificationToUser.ifPresent(user ->
//                notificationSender.sendNotification(user, pendingTradeRequest.getReceiverEmail(),
//                        "Asset Created successfully with asset id: " + response.getAssetId()
//                ));
//
//        return response;
//    }

    private List<AssetResponse> buildAssetResponseList(List<Logistics.Asset> assetResponses) {
        List<AssetResponse> assetResponseList = new ArrayList<>();

        for (Logistics.Asset asset : assetResponses) {
            var assetState = assetsRepository.findById(asset.assetId);

            AtomicReference<AssetStateEnum> state = new AtomicReference<>();

            assetState.ifPresent(a -> a.getTransactionsList()
                    .iterator()
                    .forEachRemaining(e -> state.set(e.getState())));

            AssetResponse assetResponse = AssetResponse.builder()
                    .assetId(asset.assetId)
                    .assetName(asset.assetName)
                    .info(asset.info)
                    .assetCreationTime(LocalDateTime.now().toString())
                    .sourceAddress(asset.userAddress)
                    .destinationAddress(asset.finalDestination)
                    .quantity(asset.quantity.intValue())
                    .assetState(Objects.nonNull(state.get()) ? state.get() : null)
                    .build();
            assetResponseList.add(assetResponse);
        }

        return assetResponseList;
    }

    private void saveAssetTransactionHash(AssetRequest assetRequest, String assetId, String transactionHash, String trackingMsg, String currentTime) {

        var senderAddress = assetRequest.getOriginAddress();
        var receiverAddress = assetRequest.getDestinationAddress();

        Assets asset = Assets.builder()
                .assetId(assetId)
                .assetName(assetRequest.getAssetName())
                .info(validateField(assetRequest.getInfo()))
                .assetType(validateField(assetRequest.getAssetType()))
                .quantity(assetRequest.getQuantity())
                .senderName(senderAddress.getName())
                .senderEmail(validateField(senderAddress.getEmail()))
                .senderAddress(senderAddress.getAddress())
                .senderMobileNo(validateField(senderAddress.getMobileNo()))
                .receiverName(receiverAddress.getName())
                .receiverEmail(validateField(receiverAddress.getEmail()))
                .receiverAddress(receiverAddress.getAddress())
                .receiverMobileNo(validateField(receiverAddress.getMobileNo()))
                .isDelivered(false)
                .creationMonth(getCurrentMonth())
                .tokenAmount(assetRequest.getTokenAmount().intValue())
                .build();
        assetsRepository.saveAndFlush(asset);

        AssetTransactionsList transactionsList = new AssetTransactionsList();
        transactionsList.setTransactionHash(transactionHash);
        transactionsList.setState(AssetStateEnum.CREATED);
        transactionsList.setTrackingMsg(trackingMsg);
        transactionsList.setTransactionTime(currentTime);
        transactionsList.setTransactions(asset);

        listRepository.save(transactionsList);
    }

    private String validateField(String field) {
        return Objects.nonNull(field) ? field : "null";
    }

    private void updateAssetTransactions(String assetId, String transactionHash, BigInteger state, String trackingMsg, String currentTime) {
        var asset = assetsRepository.findByAssetId(assetId);
        var trackingState = INTEGER_STATE_TO_ASSET_STATE.get(state);

        if (asset.isPresent()) {
            var updateAsset = asset.get();
            var lastTransaction = updateAsset.getTransactionsList().size() - 1;

            if (Boolean.TRUE.equals(updateAsset.getIsDelivered()) && trackingState.equals(AssetStateEnum.RETURN_COMPLETE)) {
                log.error("Requested to return a package that is already delivered");
                throw new MerchantServiceException("Package can not be returned as it's already delivered", HttpStatus.BAD_REQUEST);
            }

            if (!updateAsset.getTransactionsList().get(lastTransaction).getState().equals(trackingState)) {
                if (trackingState.equals(AssetStateEnum.DELIVERED)) {
                    updateAsset.setIsDelivered(true);
                    assetsRepository.save(updateAsset);
                }

                AssetTransactionsList transactionsList = new AssetTransactionsList();

                transactionsList.setTransactions(updateAsset);
                transactionsList.setTransactionHash(transactionHash);
                transactionsList.setState(trackingState);
                transactionsList.setTrackingMsg(trackingMsg);
                transactionsList.setTransactionTime(currentTime);

                listRepository.save(transactionsList);
            } else {
                log.error("Package already marked as " + trackingState.toString().toLowerCase() + ". Please check the state you are trying to moving the package to");
                throw new MerchantServiceException("Package already marked as " + trackingState.toString().toLowerCase()
                        + ". Please check the state you are trying to moving the package to", HttpStatus.BAD_REQUEST);
            }
        } else {
            log.error("Asset not found in DB");
            throw new MerchantServiceException("Asset not found in DB", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getCurrentMonth() {
        return LocalDate.now().getMonth().toString().substring(0, 3).toLowerCase();
    }
}
