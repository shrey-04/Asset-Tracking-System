package com.blockchain.logistics.controller;

import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.dto.WalletAccountResponse;
import com.blockchain.logistics.dto.login.LoginRequest;
import com.blockchain.logistics.dto.login.LoginResponse;
import com.blockchain.logistics.dto.login.UserDto;
import com.blockchain.logistics.dto.notification.NotificationDto;
import com.blockchain.logistics.dto.signup.AdminSignUpRequest;
import com.blockchain.logistics.dto.signup.UserSignUpRequest;
import com.blockchain.logistics.dto.user.ReadNotificationRequest;
import com.blockchain.logistics.lib.annotation.CurrentUser;
import com.blockchain.logistics.lib.utils.JwtUtils;
import com.blockchain.logistics.security.CustomUserDetails;
import com.blockchain.logistics.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @GetMapping("/user/me")
    public UserDto getCurrentUser(@CurrentUser CustomUserDetails currentUser) {
        return userService.getCurrentUser(currentUser.getUsername());
    }

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        log.info("Login request received");
        var usernamePasswordAuthToken = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

        try {
            Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthToken);

            log.info("Authentication success. Logging user in");
            SecurityContextHolder.getContext().setAuthentication(authentication);

            return new ResponseEntity<>(new LoginResponse(jwtUtils.generateToken(request.getEmail())), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error occurred while authenticating: {}", e.getMessage());
            log.debug("Error occurred while authenticating ", e.getStackTrace());
            throw new AssertionError("Error occurred while authenticating", e);
        }
    }

    @PostMapping("/signup/admin")
    @PreAuthorize("hasRole('ADMIN') || hasRole('SUPER_ADMIN')")
    public ResponseEntity<WalletAccountResponse> adminSignup(@RequestBody @Valid AdminSignUpRequest adminSignUpRequest, Principal principal) {
        log.info("Admin signup request received");

        return new ResponseEntity<>(userService.signUp(adminSignUpRequest, principal), HttpStatus.CREATED);
    }

    @PostMapping("/signup/user")
    public ResponseEntity<WalletAccountResponse> userSignup(@RequestBody @Valid UserSignUpRequest request) {
        log.info("User signup request received");

        return new ResponseEntity<>(userService.signUp(request), HttpStatus.CREATED);
    }

    @GetMapping("/wallet/get-keys")
    public ResponseEntity<WalletAccountResponse> getUserKeys(Principal principal) {
        log.info("{} request to fetch keys", principal.getName());

        return new ResponseEntity<>(userService.getKeys(principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/all-notifications")
    public ResponseEntity<List<NotificationDto>> getAllNotifications(Principal principal) {
        return new ResponseEntity<>(userService.getUserAllNotification(principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/all-unread-notifications")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(Principal principal) {
        return new ResponseEntity<>(userService.getAllUnreadNotifications(principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/read-notification")
    public ResponseEntity<SuccessResponseDto> markNotificationAsRead(@RequestBody ReadNotificationRequest request, Principal principal) {
        return new ResponseEntity<>(userService.markNotificationAsRead(request, principal.getName()), HttpStatus.OK);
    }
}
