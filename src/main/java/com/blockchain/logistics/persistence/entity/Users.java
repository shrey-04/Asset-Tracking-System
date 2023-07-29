package com.blockchain.logistics.persistence.entity;

import com.blockchain.logistics.lib.constant.AuthProvider;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "user_id")
    private long id;

    private String name;

    private String email;

    private String loginId;

    private String password;

    @Column(name = "account_non_expired")
    private boolean isAccountNonExpired;

    @Column(name = "account_non_locked")
    private boolean isAccountNonLocked;

    @Column(name = "non_expire_credentials")
    private boolean isCredentialsNonExpired;

    @Column(name = "is_active")
    private boolean isActive;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;

    private String imageUrl;

    private String userCreatedBy;

    private LocalDate userCreatedOn;

    private String modifiedBy;

    private LocalDate modifiedOn;

    private String walletFileName;

    @OneToOne
    @JoinColumn(name = "role_id")
    private Roles userRole;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Notification> notifications;
}
