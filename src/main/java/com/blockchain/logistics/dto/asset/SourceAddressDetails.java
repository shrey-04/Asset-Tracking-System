package com.blockchain.logistics.dto.asset;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SourceAddressDetails {

    @NotBlank
    private String name;

    @Email
    private String email;

    @NotBlank
    private String address;

    @JsonProperty("mobile_no")
    private String mobileNo;
}
