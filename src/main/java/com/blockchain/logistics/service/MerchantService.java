package com.blockchain.logistics.service;

import com.blockchain.logistics.dto.asset.AssetCreationResponse;
import com.blockchain.logistics.dto.asset.AssetRequest;
import com.blockchain.logistics.dto.asset.AssetResponse;

import java.math.BigInteger;
import java.util.List;

public interface MerchantService {

    AssetCreationResponse createAsset(AssetRequest asset, String userName);

    String updateTrackingOnBlockChain(String id, String trackingMsg, BigInteger state, String userName);

    List<AssetResponse> getAllAssets(String userName);

//    void transferTokenToConsignee(String assetId) throws CipherException, IOException, TransactionException, ExecutionException, InterruptedException;

//    List<TradeInitiationRequestDto> viewPendingTradeRequests(Boolean pendingRequest, String username);

//    AssetCreationResponse createTradeAsset(String uniqueTradeId, String username);
}
