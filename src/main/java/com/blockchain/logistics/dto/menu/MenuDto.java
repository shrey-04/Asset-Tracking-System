package com.blockchain.logistics.dto.menu;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDto implements Serializable {

    private Long menuId;

    private Long parentMenuId;

    private String menuDisplayName;

    private String routerName;

    private String menuIconName;

    private Integer menuStatus;

    private Integer menuOrderBy;
}
