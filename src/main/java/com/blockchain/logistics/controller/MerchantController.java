package com.blockchain.logistics.controller;

import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.dto.asset.AssetCreationResponse;
import com.blockchain.logistics.dto.asset.AssetRequest;
import com.blockchain.logistics.dto.asset.AssetResponse;
import com.blockchain.logistics.lib.constant.TrackingMessages;
import com.blockchain.logistics.service.MerchantService;
import com.blockchain.logistics.lib.constant.AssetStateEnum;
import com.blockchain.logistics.lib.constant.AssetStateMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.math.BigInteger;
import java.security.Principal;
import java.util.List;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/merchant")
public class MerchantController {

    private final MerchantService merchantService;

    @PostMapping("/generate/asset")
    @PreAuthorize("hasRole('SUPPLIER') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
    public ResponseEntity<AssetCreationResponse> createAsset(@RequestBody @Valid AssetRequest asset, Principal principal) {
        log.info("Request Received to generate an Asset: {}", asset);

        return new ResponseEntity<>(merchantService.createAsset(asset, principal.getName()), HttpStatus.CREATED);
    }

    @GetMapping("/prepare-for-dispatch/{assetId}")
    @PreAuthorize("hasRole('CARRIER') || hasRole('SUPPLIER') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
    public ResponseEntity<SuccessResponseDto> prepareForDispatch(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Prepare asset: {} for dispatch", assetId);

        var trackingMsg = TrackingMessages.DISPATCHED_MSG;
        BigInteger state = AssetStateMap.ASSET_STATE_TO_INTEGER_STATE.get(AssetStateEnum.DISPATCHED);

        var response =
                successResponseDtoBuilder(merchantService.updateTrackingOnBlockChain(assetId, trackingMsg, state, principal.getName()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/initial-move/{assetId}")
    @PreAuthorize("hasRole('WAREHOUSE') || hasRole('CARRIER') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
    public ResponseEntity<SuccessResponseDto> initialMove(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Prepare asset: {} for initial dispatch", assetId);

        var trackingMsg = TrackingMessages.INITIAL_MOVE_MSG;
        BigInteger state = AssetStateMap.ASSET_STATE_TO_INTEGER_STATE.get(AssetStateEnum.IN_TRANSIT);

        var response =
                successResponseDtoBuilder(merchantService.updateTrackingOnBlockChain(assetId, trackingMsg, state, principal.getName()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/ack-received/{assetId}")
    @PreAuthorize("hasRole('CARRIER') || hasRole('WAREHOUSE') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
    public ResponseEntity<SuccessResponseDto> ackFinalReceiver(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Asset: {} received at final delivery warehouse", assetId);

        var trackingMsg = TrackingMessages.ARRIVED_AT_FINAL_STATION_MSG;
        BigInteger state = AssetStateMap.ASSET_STATE_TO_INTEGER_STATE.get(AssetStateEnum.FINAL_STATION);

        var response =
                successResponseDtoBuilder(merchantService.updateTrackingOnBlockChain(assetId, trackingMsg, state, principal.getName()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/out-for-delivery/{assetId}")
    @PreAuthorize("hasRole('CARRIER') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
    public ResponseEntity<SuccessResponseDto> movePackageOutForDelivery(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Asset: {} out for delivery", assetId);

        var trackingMsg = TrackingMessages.OUT_FOR_DELIVERY_MSG;
        BigInteger state = AssetStateMap.ASSET_STATE_TO_INTEGER_STATE.get(AssetStateEnum.OUT_FOR_DELIVERY);

        var response =
                successResponseDtoBuilder(merchantService.updateTrackingOnBlockChain(assetId, trackingMsg, state, principal.getName()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/mark-delivered/{assetId}")
    @PreAuthorize("hasRole('CARRIER') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
    public ResponseEntity<SuccessResponseDto> makeFinalDelivery(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Mark asset: {} as delivered", assetId);

        var trackingMsg = TrackingMessages.FINAL_DELIVERY_MSG;
        BigInteger state = AssetStateMap.ASSET_STATE_TO_INTEGER_STATE.get(AssetStateEnum.DELIVERED);

        var response =
                successResponseDtoBuilder(merchantService.updateTrackingOnBlockChain(assetId, trackingMsg, state, principal.getName()));
//        if (Objects.nonNull(response.getResponse())) {
//            try {
//                merchantService.transferTokenToConsignee(assetId);
//            } catch (Exception e) {
//                log.error("Error occurred while transferring tokens to consignee: {}", e.getMessage());
//                log.debug("Error occurred while transferring tokens to consignee: {}", e.getStackTrace());
//            }
//        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/return/mark-complete/{assetId}")
    public ResponseEntity<SuccessResponseDto> markReturnComplete(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Asset: {} returned complete request received", assetId);

        var trackingMsg = TrackingMessages.RETURN_COMPLETE_MSG;
        var state = AssetStateMap.ASSET_STATE_TO_INTEGER_STATE.get(AssetStateEnum.RETURN_COMPLETE);

        var response =
                successResponseDtoBuilder(merchantService.updateTrackingOnBlockChain(assetId, trackingMsg, state, principal.getName()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/retrieve/all-assets")
    public ResponseEntity<List<AssetResponse>> getAllAssets(Principal principal) {
        log.info("Request received to fetch all assets");

        return new ResponseEntity<>(merchantService.getAllAssets(principal.getName()), HttpStatus.OK);
    }

//    @GetMapping("/trade-requests/{pendingRequest}")
//    @PreAuthorize("hasRole('SUPPLIER') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
//    public ResponseEntity<List<TradeInitiationRequestDto>> viewPendingTradeRequests(@PathVariable Boolean pendingRequest, Principal principal) {
//        return new ResponseEntity<>(merchantService.viewPendingTradeRequests(pendingRequest, principal.getName()), HttpStatus.OK);
//    }
//
//    @GetMapping("/create-trade-asset/{uniqueTradeId}")
//    @PreAuthorize("hasRole('SUPPLIER') || hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
//    public ResponseEntity<AssetCreationResponse> createTradeAsset(@PathVariable String uniqueTradeId, Principal principal) {
//        return new ResponseEntity<>(merchantService.createTradeAsset(uniqueTradeId, principal.getName()), HttpStatus.OK);
//    }

    private SuccessResponseDto successResponseDtoBuilder(String msg) {
        return SuccessResponseDto.builder()
                .response(msg)
                .build();
    }
}
