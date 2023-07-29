package com.blockchain.logistics.lib.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum RoleConstant {

    ROLE_USER("ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN"),
    ROLE_SUPER_ADMIN("ROLE_SUPER_ADMIN"),
    ROLE_SUPPLIER("ROLE_SUPPLIER"),
    ROLE_CARRIER("ROLE_CARRIER"),
    ROLE_WAREHOUSE("ROLE_WAREHOUSE");

    private String value;
}
