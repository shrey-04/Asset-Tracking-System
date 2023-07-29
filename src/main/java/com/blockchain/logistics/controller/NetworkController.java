package com.blockchain.logistics.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.web3j.model.Logistics;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/network")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class NetworkController {

    private final Logistics logistics;

    @GetMapping("/users-by-role/{role}")
    public ResponseEntity<List> getUsers(@PathVariable String role) {
        try {
            var response = logistics.getMembersFromRoles(role).send();

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while calling role");
            throw new RuntimeException("Error while calling roles");
        }
    }

    @GetMapping("/check-role/{role}/{address}")
    public ResponseEntity<Boolean> checkRole(@PathVariable String role, @PathVariable String address) {
        try {
            var response = logistics.checkUserRole(role, address).send();

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while calling role");
            throw new RuntimeException("Error while calling roles");
        }
    }
}
