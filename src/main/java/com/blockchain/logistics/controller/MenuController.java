package com.blockchain.logistics.controller;

import com.blockchain.logistics.dto.menu.MenuDto;
import com.blockchain.logistics.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/menu")
public class MenuController {

    private final MenuService service;

    @GetMapping("/all-menus")
    public ResponseEntity<List<MenuDto>> getAllMenus() {
        return new ResponseEntity<>(service.getAllMenus(), HttpStatus.OK);
    }

    @GetMapping("/menus-by-role/{role}")
    public ResponseEntity<List<MenuDto>> getMenusBasedOnRole(@PathVariable String role) {
        return new ResponseEntity<>(service.getMenusBasedOnRole(role), HttpStatus.OK);
    }

//    @PostMapping("/assign-screens")
//    public ResponseEntity<SuccessResponseDto> assignScreensToRole(@RequestBody @Valid AddScreenRequest screenRequest,
//                                                                  Principal principal) {
//        return new ResponseEntity<>(service.assignScreensToRole(screenRequest, principal), HttpStatus.OK);
//    }
}
