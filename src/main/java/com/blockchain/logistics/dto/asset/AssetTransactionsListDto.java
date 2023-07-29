package com.blockchain.logistics.dto.asset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetTransactionsListDto {

    private String transactionHash;

    private String trackingMessage;

    private String transactionTime;
}
