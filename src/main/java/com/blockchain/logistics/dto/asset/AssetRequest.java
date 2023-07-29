package com.blockchain.logistics.dto.asset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.math.BigInteger;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetRequest {

    @NotBlank(message = "Asset name should not be null")
    private String assetName;

    private String info;

    private String assetType;

    @Min(value = 1, message = "Quantity should not be less than 1")
    private int quantity;

    @Min(value = 1, message = "Token amount should not be less than 1")
    private BigInteger tokenAmount;

    @Valid
    private SourceAddressDetails originAddress;

    @Valid
    private DestinationAddressDetails destinationAddress;
}
