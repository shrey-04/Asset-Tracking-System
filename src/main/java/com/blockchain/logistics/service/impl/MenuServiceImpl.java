package com.blockchain.logistics.service.impl;

import com.blockchain.logistics.exception.GenericException;
import com.blockchain.logistics.dto.menu.MenuDto;
import com.blockchain.logistics.persistence.repository.MenuRepository;
import com.blockchain.logistics.persistence.repository.RolesRepository;
import com.blockchain.logistics.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;
    private final RolesRepository rolesRepository;

    @Override
    public List<MenuDto> getAllMenus() {
        List<MenuDto> dtoList = new ArrayList<>();

        menuRepository.findAll().forEach(
                m -> {
                    MenuDto dto = MenuDto.builder()
                            .menuId(m.getMenuId())
                            .menuDisplayName(m.getMenuDisplayName())
                            .routerName(m.getRouterName())
                            .parentMenuId(m.getParentMenuId())
                            .menuIconName(m.getMenuIconName())
                            .menuOrderBy(m.getMenuOrderBy())
                            .menuStatus(m.getMenuStatus())
                            .build();

                    dtoList.add(dto);
                });

        return dtoList;
    }

    @Override
    public List<MenuDto> getMenusBasedOnRole(String role) {
        List<MenuDto> dtoList = new ArrayList<>();

        var roleFromDb = rolesRepository.findByRole(role);

        if (roleFromDb.isPresent()) {
            roleFromDb.get().getMenus().forEach(s -> {
                MenuDto dto = MenuDto.builder()
                        .menuId(s.getMenuId())
                        .parentMenuId(s.getParentMenuId())
                        .menuDisplayName(s.getMenuDisplayName())
                        .routerName(s.getRouterName())
                        .menuIconName(s.getMenuIconName())
                        .menuStatus(s.getMenuStatus())
                        .menuOrderBy(s.getMenuOrderBy())
                        .build();

                dtoList.add(dto);
            });

            return dtoList;
        } else {
            throw new GenericException("No such role exist");
        }
    }

//    @Override
//    @Transactional
//    public SuccessResponseDto assignScreensToRole(AddScreenRequest screenRequest, Principal principal) {
//        var role = rolesRepository.findByRole(screenRequest.getRole());
//
//        Set<Menus> menusToSave = new HashSet<>();
//
//        if (role.isPresent()) {
//            screenRequest.getMenuId().forEach(id -> {
//                var menuFromDb = menuRepository.findByMenuId(id);
//
//                if (menuFromDb.isPresent()) {
//                    menusToSave.add(menuFromDb.get());
//                } else {
//                    throw new GenericException("Invalid menu id");
//                }
//            });
//
//            var toUpdateRole = role.get();
//            toUpdateRole.setMenus(menusToSave);
//
//            rolesRepository.save(toUpdateRole);
//
//            log.info("Screen added for role {} by {}", toUpdateRole.getRole(), principal.getName());
//
//            return SuccessResponseDto.builder()
//                    .response("Successfully added screens for role: ")
//                    .build();
//        } else {
//            throw new GenericException("No such role exist");
//        }
//    }
}
