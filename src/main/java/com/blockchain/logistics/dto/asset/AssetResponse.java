package com.blockchain.logistics.dto.asset;

import com.blockchain.logistics.lib.constant.AssetStateEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetResponse {

    private String assetId;

    private String assetName;

    private String info;

    private String assetCreationTime;

    private String sourceAddress;

    private String destinationAddress;

    private Integer quantity;

    private AssetStateEnum assetState;

    private List<TrackingDetails> trackingDetails;
}
