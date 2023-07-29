package com.blockchain.logistics.controller;

import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.dto.asset.AssetResponse;
import com.blockchain.logistics.dto.asset.AssetTransactionsDto;
import com.blockchain.logistics.dto.asset.TrackingDetails;
import com.blockchain.logistics.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import java.security.Principal;
import java.util.List;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/retrieve/asset/{assetId}")
    public ResponseEntity<AssetResponse> getSingleAssetDetails(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Request received to retrieve single asset details: {}", assetId);
        return new ResponseEntity<>(customerService.returnSingleAssetDetailsWithLocationData(assetId, principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/retrieve/tracking/{assetId}")
    public ResponseEntity<List<TrackingDetails>> getAssetTrackingDetails(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Request received to track single asset: {}", assetId);
        return new ResponseEntity<>(customerService.returnTrackingDetailsForUser(assetId, principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/request/cancellation/{assetId}")
    public ResponseEntity<SuccessResponseDto> requestForCancellation(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Request received to cancel asset: {}", assetId);

        var response = new SuccessResponseDto(customerService.requestForCancellation(assetId, principal.getName()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/retrieve/transactions/{assetId}")
    public ResponseEntity<AssetTransactionsDto> getAssetTransactionsWithHash(@PathVariable @NotBlank String assetId, Principal principal) {
        log.info("Request received to retrieve asset {}'s transaction hashes", assetId);
        return new ResponseEntity<>(customerService.getAssetTransactionsWithHash(assetId, principal.getName()), HttpStatus.OK);
    }


}
