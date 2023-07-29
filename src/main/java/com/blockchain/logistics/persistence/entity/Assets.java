package com.blockchain.logistics.persistence.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assets implements Serializable {

    @Id
    @Column(name = "asset_id")
    private String assetId;

    private String assetName;

    private String info;

    private String assetType;

    private int quantity;

    private String senderName;

    private String senderEmail;

    private String senderAddress;

    private String senderMobileNo;

    private String receiverName;

    private String receiverEmail;

    private String receiverAddress;

    private String receiverMobileNo;

    private Boolean isDelivered;

    private String creationMonth;

    private int tokenAmount;

    @OneToMany(mappedBy = "transactions", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssetTransactionsList> transactionsList;
}
