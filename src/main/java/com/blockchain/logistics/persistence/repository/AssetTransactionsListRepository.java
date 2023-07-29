package com.blockchain.logistics.persistence.repository;

import com.blockchain.logistics.persistence.entity.AssetTransactionsList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetTransactionsListRepository extends JpaRepository<AssetTransactionsList, Long> {
}
