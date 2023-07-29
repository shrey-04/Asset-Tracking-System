package com.blockchain.logistics.service;

import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.dto.asset.AssetRequest;
import com.blockchain.logistics.dto.asset.AssetResponse;
import com.blockchain.logistics.dto.asset.AssetTransactionsDto;
import com.blockchain.logistics.dto.asset.TrackingDetails;

import java.util.List;

public interface CustomerService {

    AssetResponse returnSingleAssetDetailsWithLocationData(String id, String username);

    List<TrackingDetails> returnTrackingDetailsForUser(String assetId, String username);

    String requestForCancellation(String assetId, String username);

    AssetTransactionsDto getAssetTransactionsWithHash(String assetId, String username);

}
