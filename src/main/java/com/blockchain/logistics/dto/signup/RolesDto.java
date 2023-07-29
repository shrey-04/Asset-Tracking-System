package com.blockchain.logistics.dto.signup;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolesDto {

    private String role;

    private String roleCreatedBy;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate roleCreatedOn;

    private String modifiedBy;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate modifiedOn;
}
