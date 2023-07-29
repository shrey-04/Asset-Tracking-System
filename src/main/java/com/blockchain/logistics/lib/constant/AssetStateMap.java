package com.blockchain.logistics.lib.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.Map;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AssetStateMap {

    public static final Map<AssetStateEnum, BigInteger> ASSET_STATE_TO_INTEGER_STATE = Map
            .of(AssetStateEnum.CREATED, BigInteger.valueOf(0),
                    AssetStateEnum.DISPATCHED, BigInteger.valueOf(1),
                    AssetStateEnum.IN_TRANSIT, BigInteger.valueOf(2),
                    AssetStateEnum.FINAL_STATION, BigInteger.valueOf(3),
                    AssetStateEnum.OUT_FOR_DELIVERY, BigInteger.valueOf(4),
                    AssetStateEnum.DELIVERED, BigInteger.valueOf(5),
                    AssetStateEnum.RETURNED, BigInteger.valueOf(6),
                    AssetStateEnum.REFUSED, BigInteger.valueOf(7),
                    AssetStateEnum.RETURN_COMPLETE, BigInteger.valueOf(8)
            );

    public static final Map<BigInteger, AssetStateEnum> INTEGER_STATE_TO_ASSET_STATE = Map
            .of(BigInteger.valueOf(0), AssetStateEnum.CREATED,
                    BigInteger.valueOf(1), AssetStateEnum.DISPATCHED,
                    BigInteger.valueOf(2), AssetStateEnum.IN_TRANSIT,
                    BigInteger.valueOf(3), AssetStateEnum.FINAL_STATION,
                    BigInteger.valueOf(4), AssetStateEnum.OUT_FOR_DELIVERY,
                    BigInteger.valueOf(5), AssetStateEnum.DELIVERED,
                    BigInteger.valueOf(6), AssetStateEnum.RETURNED,
                    BigInteger.valueOf(7), AssetStateEnum.REFUSED,
                    BigInteger.valueOf(8), AssetStateEnum.RETURN_COMPLETE
            );
}
