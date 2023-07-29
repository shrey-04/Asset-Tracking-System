package com.blockchain.logistics.dto.user;

import com.blockchain.logistics.persistence.entity.Roles;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private long id;

    private String name;

    private String email;

    private Roles userRole;

}
