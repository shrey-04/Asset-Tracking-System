package com.blockchain.logistics.service;

import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.dto.WalletAccountResponse;
import com.blockchain.logistics.dto.login.UserDto;
import com.blockchain.logistics.dto.notification.NotificationDto;
import com.blockchain.logistics.dto.signup.AdminSignUpRequest;
import com.blockchain.logistics.dto.signup.UserSignUpRequest;
import com.blockchain.logistics.dto.user.ReadNotificationRequest;

import java.security.Principal;
import java.util.List;

public interface UserService {

    UserDto getCurrentUser(String username);

    WalletAccountResponse signUp(AdminSignUpRequest adminSignUpRequest, Principal principal);

    WalletAccountResponse signUp(UserSignUpRequest request);

    List<UserDto> getUserByRole(String role);

//    SuccessResponseDto updateUserRole(UserRoleUpdateRequest updateRequest, Principal principal);
//
//    SuccessResponseDto deleteUser(String emailId, Principal principal);
//
//    WalletAccountResponse restoreUserWalletAccount(String mnemonic, String username);
//
    WalletAccountResponse getKeys(String username);

    List<NotificationDto> getUserAllNotification(String username);

    List<NotificationDto> getAllUnreadNotifications(String username);

    SuccessResponseDto markNotificationAsRead(ReadNotificationRequest request, String username);
}
