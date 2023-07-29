package com.blockchain.logistics.dto.asset;

import com.blockchain.logistics.persistence.MonthlyAssetCount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyAssetCountDto {

    private List<MonthlyAssetCount> monthlyAssetCountList;
}
