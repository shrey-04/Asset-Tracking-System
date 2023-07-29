package com.blockchain.logistics.dto.merchant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TradeInitiationRequestDto {

    private String assetName;

    private String info;

    private String assetType;

    private int quantity;

    private String senderName;

    private String senderEmail;

    private String senderAddress;

    private String senderMobileNo;

    private String receiverName;

    private String receiverEmail;

    private String receiverAddress;

    private String receiverMobileNo;

    private BigInteger tokenAmount;

    private String uniqueTradeId;
}
