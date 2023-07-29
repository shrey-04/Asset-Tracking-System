package com.blockchain.logistics.persistence.repository;

import com.blockchain.logistics.persistence.AssetCountBasedOnCities;
import com.blockchain.logistics.persistence.MonthlyAssetCount;
import com.blockchain.logistics.persistence.entity.Assets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AssetsRepository extends JpaRepository<Assets, String> {

    Optional<Assets> findByAssetId(String assetId);

    @Query(nativeQuery = true, value = "select count(asset_id) as assetCount, sender_address as city from assets group by sender_address;")
    List<AssetCountBasedOnCities> findAssetCountForCities();

    @Query(nativeQuery = true, value = "select count(asset_id) as assetCount, creation_month as month from assets group by creation_month;")
    List<MonthlyAssetCount> findAssetsByMonth();
}
