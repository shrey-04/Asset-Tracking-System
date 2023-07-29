package com.blockchain.logistics.service.impl;

import com.blockchain.logistics.lib.constant.AssetStateEnum;
import com.blockchain.logistics.persistence.AssetCountBasedOnCities;
import com.blockchain.logistics.persistence.MonthlyAssetCount;
import com.blockchain.logistics.persistence.entity.AssetTransactionsList;
import com.blockchain.logistics.persistence.repository.AssetTransactionsListRepository;
import com.blockchain.logistics.persistence.repository.AssetsRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.web3j.model.Logistics;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthBlock;

import java.util.ArrayList;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class DashboardServiceImplTest {

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @Spy
    private Web3j web3j;

    @Mock
    private Logistics logistics;

    @Mock
    private AssetsRepository assetsRepository;

    @Mock
    private AssetTransactionsListRepository listRepository;

    @Test
    @Disabled
    void testGetBlockCount() {
        //Given
        var block = new EthBlock();
        EthBlock.Block blockResult = new EthBlock.Block();

        blockResult.setNumber("1");

        block.setResult(blockResult);

//        Mockito.doReturn(block).when(web3j).ethGetBlockByNumber(DefaultBlockParameterName.LATEST, false);

//        Mockito.when(web3j.ethGetBlockByNumber(DefaultBlockParameterName.LATEST, false))
//                .thenReturn(block);

        //When
        var response = dashboardService.getBlockCount();

        //Then
        Assertions.assertEquals("1", response);
    }

    @Test
    void testGetDeliveredCount() {
        //Given
        List<AssetTransactionsList> assetList = new ArrayList<>();
        assetList.add(buildAssetWithStates(AssetStateEnum.DELIVERED));
        assetList.add(buildAssetWithStates(AssetStateEnum.IN_TRANSIT));

        Mockito.when(listRepository.findAll()).thenReturn(assetList);

        //When
        var response = dashboardService.getDeliveredCount();

        //Then
        Assertions.assertEquals("1", response);
    }

    @Test
    void testGetAssetCreatedCountForCities() {
        //Given
        List<AssetCountBasedOnCities> assetCountBasedOnCities = new ArrayList<>();
        Mockito.when(assetsRepository.findAssetCountForCities()).thenReturn(assetCountBasedOnCities);

        //When
        var response = dashboardService.getAssetCreatedCountForCities();

        //Then
        Assertions.assertEquals(assetCountBasedOnCities, response);
    }

    @Test
    void testGetMonthlyAssetCount() {
        //Given
        List<MonthlyAssetCount> monthlyAssetCounts = new ArrayList<>();
        Mockito.when(assetsRepository.findAssetsByMonth()).thenReturn(monthlyAssetCounts);

        //When
        var response = dashboardService.getMonthlyAssetCount();

        //Then
        Assertions.assertEquals(monthlyAssetCounts, response);
    }

    private AssetTransactionsList buildAssetWithStates(AssetStateEnum stateEnum) {
        var assetTransactionList = new AssetTransactionsList();
        assetTransactionList.setState(stateEnum);
        return assetTransactionList;
    }

    private EthBlock setResult() {
        var block = new EthBlock();
        EthBlock.Block blockResult = new EthBlock.Block();

        block.setResult(blockResult);

        return block;
    }
}
