package com.blockchain.logistics.dto.asset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetTransactionsDto {

    private String assetId;

    List<AssetTransactionsListDto> transactions;
}
