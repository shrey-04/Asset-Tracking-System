package com.blockchain.logistics.config;

import com.blockchain.logistics.exception.GenericException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.web3j.crypto.Credentials;
import org.web3j.model.Logistics;
//import org.web3j.model.LogisticsNFT;
//import org.web3j.model.LogisticsNativeToken;
//import org.web3j.model.NFTMarket;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.StaticGasProvider;

import java.math.BigInteger;

@Profile("dev")
@Configuration
public class BlockchainConfigDev {

    @Value("${chain.addresses.rpc}")
    private String rpcPortAddress;

    @Value("${chain.account.private-key}")
    private String privateKey;

    @Value("${chain.gas-price}")
    private long gasPrice;

    @Value("${chain.gas-limit}")
    private long gasLimit;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(rpcPortAddress));
    }

    @Bean
    public Logistics deployLogisticsContract(Web3j web3j) {
        try {
            var credentials = Credentials.create(privateKey);

            System.setProperty("chain.account.super-admin-wallet-address", credentials.getAddress());

            var logistics = Logistics.deploy(web3j, credentials,
                    new StaticGasProvider(BigInteger.valueOf(gasPrice), BigInteger.valueOf(gasLimit))).send();

            System.out.println("Logistics Contract Address: " + logistics.getContractAddress());

            return logistics;
        } catch (Exception e) {
            throw new GenericException("Error occurred while deploying Logistics contract", e);
        }
    }

//    @Bean
//    public LogisticsNativeToken deployTokenContract(Web3j web3j) {
//        try {
//            var nativeToken = LogisticsNativeToken.deploy(web3j, Credentials.create(privateKey),
//                    new StaticGasProvider(BigInteger.valueOf(gasPrice), BigInteger.valueOf(gasLimit))).send();
//
//            System.out.println("NativeToken Contract Address: " + nativeToken.getContractAddress());
//
//            return nativeToken;
//        } catch (Exception e) {
//            throw new GenericException("Error occurred while deploying Native token contract", e);
//        }
//    }

//    @Bean
//    public LogisticsNFT deployLogisticsNftContract(Web3j web3j) {
//        try {
//            var logisticsNft = LogisticsNFT.deploy(web3j, Credentials.create(privateKey),
//                    new StaticGasProvider(BigInteger.valueOf(gasPrice), BigInteger.valueOf(gasLimit))).send();
//
//            System.out.println("LogisticsNft Contract Address: " + logisticsNft.getContractAddress());
//
//            return logisticsNft;
//        } catch (Exception e) {
//            throw new GenericException("Error occurred while deploying Logistics Nft contract", e);
//        }
//    }
//
//    @Bean
//    public NFTMarket deployNftMarketContract(Web3j web3j) {
//        try {
//            var nftMarket = NFTMarket.deploy(web3j, Credentials.create(privateKey),
//                    new StaticGasProvider(BigInteger.valueOf(gasPrice), BigInteger.valueOf(gasLimit))).send();
//
//            System.out.println("NftMarket Contract Address: " + nftMarket.getContractAddress());
//
//            return nftMarket;
//        } catch (Exception e) {
//            throw new GenericException("Error occurred while deploying Nft Market contract", e);
//        }
//    }
}
