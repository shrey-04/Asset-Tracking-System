package com.blockchain.logistics.dto.login;

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
public class UserDto {

    private String name;

    private String email;

    private String loginId;

    private Boolean active;

    private Boolean credentialsNonExpired;

    private Boolean accountNonExpired;

    private Boolean accountNonLocked;

    private String userCreatedBy;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate userCreatedOn;

    private String roles;
}
