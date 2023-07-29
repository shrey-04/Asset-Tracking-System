package com.blockchain.logistics.persistence.entity;

import com.blockchain.logistics.lib.constant.AssetStateEnum;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class AssetTransactionsList implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "asset_transaction_list_id")
    private Long id;

    private String transactionHash;

    @Enumerated(EnumType.STRING)
    private AssetStateEnum state;

    private String trackingMsg;

    private String transactionTime;

    @ManyToOne
    @JoinColumn(name = "asset_id")
    private Assets transactions;
}
