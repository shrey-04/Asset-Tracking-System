package com.blockchain.logistics.service.impl.helper;

import com.blockchain.logistics.exception.WalletAccountException;
import com.blockchain.logistics.dto.WalletAccountResponse;
import com.blockchain.logistics.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Bip39Wallet;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.WalletUtils;

import java.io.File;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletAccountService {

    @Value("${chain.account.wallet-directory}")
    private String walletFileDirectory;

    private final UserRepository userRepository;

    public Bip39Wallet createAccount(String userName) {
        try {
            log.info("Creating wallet file");
            return WalletUtils.generateBip39Wallet(userName, new File(walletFileDirectory));
        } catch (Exception e) {
            log.error("Error occurred while creating Wallet Account");
            throw new WalletAccountException("Error occurred while creating Wallet Account", e);
        }
    }

//    public WalletAccountResponse restoreUserAccount(String userName, String mnemonicPhrase) {
//        log.info("Trying to read credentials from wallet file");
//        Credentials restoredCredentials = WalletUtils.loadBip39Credentials(userName, mnemonicPhrase);
//
//        log.info("Trying to restore private key");
//        ECKeyPair restoredPrivateKey = restoredCredentials.getEcKeyPair();
//
//        return WalletAccountResponse.builder()
//                .accountAddress(restoredCredentials.getAddress())
//                .mnemonicPhrase(mnemonicPhrase)
//                .privateKey(restoredPrivateKey.getPrivateKey().toString(16))
//                .publicKey(restoredPrivateKey.getPublicKey().toString(16))
//                .build();
//    }

    public WalletAccountResponse retrieveKeys(String userName) {
        var user = userRepository.findByEmail(userName);

        try {
            if (user.isPresent()) {
                Credentials restoredCredentials = WalletUtils.loadCredentials(userName, walletFileDirectory + user.get().getWalletFileName());

                log.info("Trying to restore private key");
                ECKeyPair restoredPrivateKey = restoredCredentials.getEcKeyPair();

                return WalletAccountResponse.builder()
                        .accountAddress(restoredCredentials.getAddress())
                        .privateKey(restoredPrivateKey.getPrivateKey().toString(16))
                        .publicKey(restoredPrivateKey.getPublicKey().toString(16))
                        .build();
            } else {
                log.error("Error while loading user");
                throw new WalletAccountException("Error while loading user");
            }
        } catch (Exception e) {
            log.error("Error while loading wallet file");
            throw new WalletAccountException("Error while loading wallet file", e);
        }
    }
}
