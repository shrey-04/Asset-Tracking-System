package com.blockchain.logistics.controller;

import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.persistence.AssetCountBasedOnCities;
import com.blockchain.logistics.dto.asset.AssetCountBasedOnCitiesDto;
import com.blockchain.logistics.persistence.MonthlyAssetCount;
import com.blockchain.logistics.dto.asset.MonthlyAssetCountDto;
import com.blockchain.logistics.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/block-count")
    public ResponseEntity<SuccessResponseDto> blockCount() {
        var response = dashboardService.getBlockCount();
        return new ResponseEntity<>(successResponseDtoBuilder(response), HttpStatus.OK);
    }

    @GetMapping("/asset-count")
    public ResponseEntity<SuccessResponseDto> assetCount() {
        var response = dashboardService.getAssetCount();
        return new ResponseEntity<>(successResponseDtoBuilder(response), HttpStatus.OK);
    }

    @GetMapping("/asset-delivered-count")
    public ResponseEntity<SuccessResponseDto> returnAssetDeliveredCount() {
        var response = successResponseDtoBuilder(dashboardService.getDeliveredCount());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/city-based-asset-count")
    public ResponseEntity<AssetCountBasedOnCitiesDto> getAssetCreatedCountForCities() {
        return new ResponseEntity<>(assetCountBasedOnCitiesDtoBuilder(dashboardService.getAssetCreatedCountForCities()), HttpStatus.OK);
    }

    @GetMapping("/monthly-asset-count")
    public ResponseEntity<MonthlyAssetCountDto> getMonthlyAssetCount() {
        return new ResponseEntity<>(monthlyAssetCountDtoBuilder(dashboardService.getMonthlyAssetCount()), HttpStatus.OK);
    }

    private SuccessResponseDto successResponseDtoBuilder(String msg) {
        return SuccessResponseDto.builder()
                .response(msg)
                .build();
    }

    private AssetCountBasedOnCitiesDto assetCountBasedOnCitiesDtoBuilder(List<AssetCountBasedOnCities> assetCountBasedOnCitiesList) {
        return AssetCountBasedOnCitiesDto.builder().assetCountBasedOnCities(assetCountBasedOnCitiesList).build();
    }

    private MonthlyAssetCountDto monthlyAssetCountDtoBuilder(List<MonthlyAssetCount> monthlyAssetCountList) {
        return MonthlyAssetCountDto.builder().monthlyAssetCountList(monthlyAssetCountList).build();
    }

}
