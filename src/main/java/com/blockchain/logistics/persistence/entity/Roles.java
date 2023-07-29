package com.blockchain.logistics.persistence.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Roles implements Serializable {

    @Id
    @Column(name = "role_id")
    @TableGenerator(name = "Role_Id_Generator", initialValue = 9, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "Role_Id_Generator")
    private long id;

    private String role;

    private String createdBy;

    private LocalDate createdOn;

    private String modifiedBy;

    private LocalDate modifiedOn;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "role_menus",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "men_id")
    )
    private Set<Menus> menus;
}
