package com.blockchain.logistics.dto.asset;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetCreationResponse {

    @JsonProperty("asset_id")
    private String assetId;

    @JsonProperty("transaction_hash")
    private String transactionHash;
}
