package com.blockchain.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletAccountResponse {

    private String accountAddress;

    private String mnemonicPhrase;

    private String privateKey;

    private String publicKey;
}
