package com.blockchain.logistics.dto.asset;

import com.blockchain.logistics.persistence.AssetCountBasedOnCities;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetCountBasedOnCitiesDto {

    private List<AssetCountBasedOnCities> assetCountBasedOnCities;
}
