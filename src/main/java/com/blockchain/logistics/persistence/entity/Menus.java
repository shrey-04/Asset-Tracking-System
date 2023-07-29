package com.blockchain.logistics.persistence.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "menus")
public class Menus implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "men_id")
    private Long id;

    private Long menuId;

    private Long parentMenuId;

    private String menuDisplayName;

    private String routerName;

    private String menuIconName;

    private Integer menuStatus;

    private Integer menuOrderBy;
}
