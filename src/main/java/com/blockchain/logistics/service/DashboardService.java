package com.blockchain.logistics.service;

import com.blockchain.logistics.persistence.AssetCountBasedOnCities;
import com.blockchain.logistics.persistence.MonthlyAssetCount;

import java.util.List;

public interface DashboardService {

    String getBlockCount();

    String getAssetCount();

    String getDeliveredCount();

    List<AssetCountBasedOnCities> getAssetCreatedCountForCities();

    List<MonthlyAssetCount> getMonthlyAssetCount();
}
