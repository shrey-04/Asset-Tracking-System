package com.blockchain.logistics.lib.constant;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public enum AssetStateEnum {
    CREATED("Created"),
    DISPATCHED("Dispatched"),
    IN_TRANSIT("In Transit"),
    FINAL_STATION("Final Station"),
    OUT_FOR_DELIVERY("Out for Delivery"),
    DELIVERED("Delivered"),
    RETURNED("Returned"),
    REFUSED("Refused"),
    RETURN_COMPLETE("Return Complete");

    private String value;
}
