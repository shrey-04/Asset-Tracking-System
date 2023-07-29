package com.blockchain.logistics.service;

import com.blockchain.logistics.dto.menu.MenuDto;

import java.util.List;

public interface MenuService {

    List<MenuDto> getAllMenus();

    List<MenuDto> getMenusBasedOnRole(String role);

//    SuccessResponseDto assignScreensToRole(AddScreenRequest screenRequest, Principal principal);
}
