package com.blockchain.logistics.service.impl.helper;

import com.blockchain.logistics.exception.BlockChainServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.model.Logistics;
//import org.web3j.model.LogisticsNFT;
//import org.web3j.model.LogisticsNativeToken;
//import org.web3j.model.NFTMarket;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.exceptions.TransactionException;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.response.PollingTransactionReceiptProcessor;
import org.web3j.tx.response.TransactionReceiptProcessor;

import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlockChainService {

    @Value("${chain.gas-price}")
    private long gasPrice;

    @Value("${chain.gas-limit}")
    private long gasLimit;

    private final Logistics logistics;
//    private final LogisticsNativeToken nativeToken;
//    private final LogisticsNFT logisticsNft;
//    private final NFTMarket nftMarket;

    private final Web3j web3j;

    public TransactionReceipt signAndTransactOnLogisticsContract(Function function, Credentials credentials)
            throws TransactionException, IOException, ExecutionException, InterruptedException {
        return signAndTransact(function, credentials, logistics.getContractAddress());
    }

    public List<Type> signAndTransactOnLogisticsContractToGetValues(Function function, Credentials credentials)
            throws ExecutionException, InterruptedException {
        return signAndTransactToGetValues(function, credentials, logistics.getContractAddress());
    }

//    public TransactionReceipt signAndTransactOnNativeTokenContract(Function function, Credentials credentials)
//            throws TransactionException, IOException, ExecutionException, InterruptedException {
//        return signAndTransact(function, credentials, nativeToken.getContractAddress());
//    }
//
//    public List<Type> signAndTransactOnNativeTokenContractToGetValues(Function function, Credentials credentials)
//            throws ExecutionException, InterruptedException {
//        return signAndTransactToGetValues(function, credentials, nativeToken.getContractAddress());
//    }
//
//    public TransactionReceipt signAndTransactOnLogisticsNftContract(Function function, Credentials credentials)
//            throws TransactionException, IOException, ExecutionException, InterruptedException {
//        return signAndTransact(function, credentials, logisticsNft.getContractAddress());
//    }
//
//    public List<Type> signAndTransactOnLogisticsNftContractToGetValues(Function function, Credentials credentials)
//            throws ExecutionException, InterruptedException {
//        return signAndTransactToGetValues(function, credentials, logisticsNft.getContractAddress());
//    }
//
//    public TransactionReceipt signAndTransactOnNftMarketContract(Function function, Credentials credentials)
//            throws TransactionException, IOException, ExecutionException, InterruptedException {
//        return signAndTransact(function, credentials, nftMarket.getContractAddress());
//    }
//
//    public List<Type> signAndTransactOnNftMarketContractToGetValues(Function function, Credentials credentials)
//            throws ExecutionException, InterruptedException {
//        return signAndTransactToGetValues(function, credentials, nftMarket.getContractAddress());
//    }

    private TransactionReceipt signAndTransact(Function function, Credentials credentials, String contractAddress)
            throws TransactionException, IOException, ExecutionException, InterruptedException {
        EthGetTransactionCount ethGetTransactionCount =
                web3j.ethGetTransactionCount(credentials.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();

        RawTransactionManager rawTransactionManager = new RawTransactionManager(web3j, credentials);

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                ethGetTransactionCount.getTransactionCount(),
                new BigInteger(BigInteger.valueOf(gasPrice).toString()),
                new BigInteger(BigInteger.valueOf(gasLimit).toString()),
                contractAddress,
                BigInteger.ZERO,
                FunctionEncoder.encode(function));

        EthSendTransaction sendEthereumTransaction = rawTransactionManager.signAndSend(rawTransaction);

        if (sendEthereumTransaction.getError() != null) {
            log.error("{}", sendEthereumTransaction.getError().getMessage());
            throw new BlockChainServiceException("" + sendEthereumTransaction.getError().getMessage());
        }

        TransactionReceiptProcessor receiptProcessor = new PollingTransactionReceiptProcessor(
                web3j, TransactionManager.DEFAULT_POLLING_FREQUENCY, TransactionManager.DEFAULT_POLLING_ATTEMPTS_PER_TX_HASH);

        return receiptProcessor.waitForTransactionReceipt(sendEthereumTransaction.getTransactionHash());
    }

    private List<Type> signAndTransactToGetValues(Function function, Credentials credentials, String contractAddress)
            throws ExecutionException, InterruptedException {
        EthCall response = web3j.ethCall(
                        Transaction.createEthCallTransaction(credentials.getAddress(), contractAddress, FunctionEncoder.encode(function)),
                        DefaultBlockParameterName.LATEST)
                .sendAsync().get();

        return FunctionReturnDecoder.decode(response.getValue(), function.getOutputParameters());
    }
}
