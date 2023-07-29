package com.blockchain.logistics.lib.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TrackingMessages {

	public static final String INITIAL_MSG = "Shipment created by supplier";

    public static final String DISPATCHED_MSG = "Shipment picked up from supplier";

    public static final String INITIAL_MOVE_MSG = "Shipment arrived at warehouse";

    public static final String ARRIVED_AT_FINAL_STATION_MSG = "Shipment picked up from warehouse";

    public static final String OUT_FOR_DELIVERY_MSG = "Shipment out for delivery";

    public static final String FINAL_DELIVERY_MSG = "Shipment Delivered";

    public static final String REQUEST_FOR_CANCELLATION_MSG = "Requested for cancellation";

    public static final String RETURN_COMPLETE_MSG = "Return complete. Package returned to seller";
}
