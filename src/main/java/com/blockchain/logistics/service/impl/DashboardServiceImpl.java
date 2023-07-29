package com.blockchain.logistics.service.impl;

import com.blockchain.logistics.exception.DashboardServiceException;
import com.blockchain.logistics.persistence.AssetCountBasedOnCities;
import com.blockchain.logistics.persistence.MonthlyAssetCount;
import com.blockchain.logistics.lib.constant.AssetStateEnum;
import com.blockchain.logistics.persistence.repository.AssetTransactionsListRepository;
import com.blockchain.logistics.persistence.repository.AssetsRepository;
import com.blockchain.logistics.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.web3j.model.Logistics;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final Web3j web3j;
    private final Logistics logistics;
    private final AssetsRepository assetsRepository;
    private final AssetTransactionsListRepository listRepository;

    @Override
    public String getBlockCount() {
        try {
            var block = web3j.ethGetBlockByNumber(DefaultBlockParameterName.LATEST, false).send().getBlock();
            return Integer.toString(block.getNumber().intValue());
        } catch (Exception e) {
            log.error("Error occurred while trying to get block number: {}", e.getMessage());
            throw new DashboardServiceException("Error occurred while trying to get block number: ", e);
        }
    }

    @Override
    public String getAssetCount() {
        try {
            return Integer.toString(logistics.returnAllAssets().send().size());
        } catch (Exception e) {
            log.error("Error occurred while trying to get asset count: {}", e.getMessage());
            throw new DashboardServiceException("Error occurred while trying to get asset count: ", e);
        }
    }

    @Override
    public String getDeliveredCount() {
        var count = listRepository.findAll().stream()
                .filter(a -> a.getState().equals(AssetStateEnum.DELIVERED))
                .count();

        return Long.toString(count);
    }

    @Override
    public List<AssetCountBasedOnCities> getAssetCreatedCountForCities() {
        return assetsRepository.findAssetCountForCities();
    }

    @Override
    public List<MonthlyAssetCount> getMonthlyAssetCount() {

        return assetsRepository.findAssetsByMonth();
    }
}
