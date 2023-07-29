package com.blockchain.logistics.service.impl;

import com.blockchain.logistics.exception.GenericException;
import com.blockchain.logistics.exception.UserServiceException;
import com.blockchain.logistics.exception.auth.ResourceNotFoundException;
import com.blockchain.logistics.persistence.entity.Roles;
import com.blockchain.logistics.persistence.entity.Users;
import com.blockchain.logistics.dto.SuccessResponseDto;
import com.blockchain.logistics.dto.WalletAccountResponse;
import com.blockchain.logistics.dto.login.UserDto;
import com.blockchain.logistics.dto.notification.NotificationDto;
import com.blockchain.logistics.dto.signup.AdminSignUpRequest;
import com.blockchain.logistics.dto.signup.UserSignUpRequest;
import com.blockchain.logistics.dto.user.ReadNotificationRequest;
import com.blockchain.logistics.lib.constant.AuthProvider;
import com.blockchain.logistics.lib.constant.RoleConstant;
import com.blockchain.logistics.persistence.entity.Notification;
import com.blockchain.logistics.persistence.repository.NotificationRepository;
import com.blockchain.logistics.persistence.repository.RolesRepository;
import com.blockchain.logistics.persistence.repository.UserRepository;
import com.blockchain.logistics.service.UserService;
import com.blockchain.logistics.service.impl.helper.BlockChainService;
import com.blockchain.logistics.service.impl.helper.WalletAccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.web3j.abi.datatypes.Function;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.WalletUtils;
import org.web3j.model.Logistics;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Value("${chain.account.wallet-directory}")
    private String walletFileDirectory;

    private final PasswordEncoder encoder;
    private final WalletAccountService walletAccountService;
    private final BlockChainService blockChainService;

    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public UserDto getCurrentUser(String username) {
        var user = existingUser(username).orElseThrow(() -> new ResourceNotFoundException("User", "id", username));

        return transformToUserDto(user);
    }

    @Override
    public WalletAccountResponse signUp(AdminSignUpRequest adminSignUpRequest, Principal principal) {
        var requestedBy = principal.getName();
        log.info("{} requested to add an Admin user", requestedBy);

        var newUserMailId = adminSignUpRequest.getEmail();
        var updater = existingUser(principal.getName());

        if (existingUser(newUserMailId).isEmpty() && updater.isPresent()) {
            var newUserMail = adminSignUpRequest.getEmail();

            var newUseWalletCreationResponse = walletAccountService.createAccount(newUserMail);
            var newUserCredentials = WalletUtils.loadBip39Credentials(newUserMail, newUseWalletCreationResponse.getMnemonic());

            var userIntroducer = updater.get();

            try {
                var introducerWallerFile = userIntroducer.getWalletFileName();
                var introducerCredentials =
                        WalletUtils.loadCredentials(userIntroducer.getEmail(), walletFileDirectory + introducerWallerFile);

                var role = existingRole(adminSignUpRequest.getRole());

                Function function = new Function(Logistics.FUNC_GRANTROLES,
                        Arrays.asList(
                                new org.web3j.abi.datatypes.Utf8String(role.getRole()),
                                new org.web3j.abi.datatypes.Address(160, newUserCredentials.getAddress())),
                        Collections.emptyList());

                var response = blockChainService.signAndTransactOnLogisticsContract(function, introducerCredentials);

                log.info("Hash is: {}", response.getTransactionHash());

//                if (role.getRole().equals(RoleConstant.ROLE_SUPPLIER.getValue())
//                        || role.getRole().equals(RoleConstant.ROLE_ADMIN.getValue())
//                        || role.getRole().equals(RoleConstant.ROLE_SUPER_ADMIN.getValue())) {
//                    Function addTokenIssuerFunction = new Function(LogisticsNativeToken.FUNC_ADDUSERS,
//                            List.of(new Address(160, newUserCredentials.getAddress())),
//                            Collections.emptyList());

//                    var addTokenIssuerResponse =
//                            blockChainService.signAndTransactOnNativeTokenContract(addTokenIssuerFunction, introducerCredentials);

//                    log.info("New token issuer added. Transaction hash is: {}", addTokenIssuerResponse.getTransactionHash());
//                }

                Users user = transformRequestToAdminEntity(adminSignUpRequest, requestedBy, role, newUseWalletCreationResponse.getFilename());

                userRepository.save(user);

                log.info("Admin account created successfully");

//                return AccountResponse.builder()
//                        .id(user.getId())
//                        .name(user.getName())
//                        .email(user.getEmail())
//                        .userRole(user.getUserRole())
//                        .build();

                return WalletAccountResponse.builder()
                        .accountAddress(newUserCredentials.getAddress())
                        .mnemonicPhrase(newUseWalletCreationResponse.getMnemonic())
                        .privateKey(newUserCredentials.getEcKeyPair().getPrivateKey().toString(16))
                        .publicKey(newUserCredentials.getEcKeyPair().getPublicKey().toString(16))
                        .build();
            } catch (IOException | CipherException e) {
                log.error("Error occurred while loading wallet file", e);
                throw new UserServiceException("Error occurred while loading wallet file", e);
            } catch (Exception e) {
                log.error("Error occurred", e);
                throw new UserServiceException("Error occurred", e);
            }
        } else {
            log.error("Admin with id: {} already exists", newUserMailId);
            throw new UserServiceException("Admin already exist with id: " + newUserMailId);
        }
    }

    @Override
    public WalletAccountResponse signUp(UserSignUpRequest request) {
        var userMailId = request.getEmail();

        if (existingUser(userMailId).isEmpty()) {
            var userName = request.getEmail();

            var walletCreationResponse = walletAccountService.createAccount(userName);
            var credentials = WalletUtils.loadBip39Credentials(userName, walletCreationResponse.getMnemonic());

            Roles userRole = existingRole(RoleConstant.ROLE_USER.getValue());

            try {
                Function function = new Function(Logistics.FUNC_GRANTROLES,
                        Arrays.asList(
                                new org.web3j.abi.datatypes.Utf8String(userRole.getRole()),
                                new org.web3j.abi.datatypes.Address(160, credentials.getAddress())),
                        Collections.emptyList());

                var response = blockChainService.signAndTransactOnLogisticsContract(function, credentials);

                log.info("Transaction hash: {}", response.getTransactionHash());

                Users user =
                        buildUser(request.getName(), userMailId, request.getPassword(), userRole, "Self", walletCreationResponse.getFilename());

                userRepository.save(user);

                log.info("User account created successfully");

//                return AccountResponse.builder()
//                        .id(user.getId())
//                        .name(user.getName())
//                        .email(user.getEmail())
//                        .userRole(user.getUserRole())
//                        .build();

                return WalletAccountResponse.builder()
                        .accountAddress(credentials.getAddress())
                        .mnemonicPhrase(walletCreationResponse.getMnemonic())
                        .privateKey(credentials.getEcKeyPair().getPrivateKey().toString(16))
                        .publicKey(credentials.getEcKeyPair().getPublicKey().toString(16))
                        .build();
            } catch (IOException e) {
                log.error("Error occurred while loading wallet file", e);
                throw new UserServiceException("Error occurred while loading wallet file", e);
            } catch (Exception e) {
                log.error("Error occurred while writing transaction on network");
                throw new UserServiceException("Unable to add user with email: " + userMailId, e);
            }
        } else {
            log.error("User already exist with the id: {}", userMailId);
            throw new UserServiceException("User already exist with the id: " + userMailId);
        }
    }

//    @Override
//    public SuccessResponseDto updateUserRole(UserRoleUpdateRequest updateRequest, Principal principal) {
//        var user = existingUser(updateRequest.getEmailId());
//        var updater = existingUser(principal.getName());
//
//        if (user.isPresent() && updater.isPresent()) {
//            var newRoleToUpdate = existingRole(updateRequest.getRoleToUpdate());
//
//            try {
//                var userToUpdate = user.get();
//                var userWalletFile = userToUpdate.getWalletFileName();
//                var userCredentials = WalletUtils.loadCredentials(userToUpdate.getEmail(), walletFileDirectory + userWalletFile);
//
//                var userUpdater = updater.get();
//                var updaterWalletFile = userUpdater.getWalletFileName();
//                var updaterCredentials = WalletUtils.loadCredentials(principal.getName(), walletFileDirectory + updaterWalletFile);
//
//                TransactionReceipt response;
//
//                Function roleRevokeFunction = new Function(Logistics.FUNC_REVOKEROLES,
//                        Arrays.asList(
//                                new org.web3j.abi.datatypes.Utf8String(userToUpdate.getUserRole().getRole()),
//                                new org.web3j.abi.datatypes.Address(160, userCredentials.getAddress())),
//                        Collections.emptyList());
//
//                response = blockChainService.signAndTransactOnLogisticsContract(roleRevokeFunction, userCredentials);
//
//                log.info("Role revoked successfully. Hash is: {}", response.getTransactionHash());
//
//                Function addNewRoleFunction = new Function(Logistics.FUNC_GRANTROLES,
//                        Arrays.asList(
//                                new org.web3j.abi.datatypes.Utf8String(newRoleToUpdate.getRole()),
//                                new org.web3j.abi.datatypes.Address(160, userCredentials.getAddress())),
//                        Collections.emptyList());
//
//                response = blockChainService.signAndTransactOnLogisticsContract(addNewRoleFunction, updaterCredentials);
//
//                log.info("{}", response.getTransactionHash());
//
//                userToUpdate.setUserRole(newRoleToUpdate);
//                userToUpdate.setModifiedBy(principal.getName());
//                userToUpdate.setModifiedOn(LocalDate.now());
//
//                userRepository.save(userToUpdate);
//
//                return SuccessResponseDto.builder()
//                        .response("Successfully updated user role")
//                        .build();
//            } catch (IOException | CipherException e) {
//                log.error("Error occurred while loading wallet file");
//                throw new MerchantServiceException("Error occurred while loading wallet file", HttpStatus.INTERNAL_SERVER_ERROR);
//            } catch (Exception e) {
//                log.error("Error occurred while writing transaction on the network: {}", e.getMessage());
//                throw new UserServiceException("Error occurred while writing transaction on the network", e);
//            }
//        } else {
//            throw new UserServiceException("No user found with email id " + updateRequest.getEmailId());
//        }
//    }

//    @Override
//    public SuccessResponseDto deleteUser(String emailId, Principal principal) {
//        var user = existingUser(emailId);
//
//        if (user.isPresent()) {
//            try {
//                var userToRemove = user.get();
//                var userToRemoveWalletFile = userToRemove.getWalletFileName();
//                var userToRemoveCredentials =
//                        WalletUtils.loadCredentials(emailId, walletFileDirectory + userToRemoveWalletFile);
//
//                Function function = new Function(Logistics.FUNC_REVOKEROLES,
//                        Arrays.asList(
//                                new org.web3j.abi.datatypes.Utf8String(userToRemove.getUserRole().getRole()),
//                                new org.web3j.abi.datatypes.Address(160, userToRemoveCredentials.getAddress())),
//                        Collections.emptyList());
//
//                blockChainService.signAndTransactOnLogisticsContract(function, userToRemoveCredentials);
//
//                log.info("User successfully deleted by: {}", principal.getName());
//
//                userRepository.delete(user.get());
//
//                return SuccessResponseDto.builder()
//                        .response("Successfully Deleted User")
//                        .build();
//            } catch (IOException | CipherException e) {
//                log.error("Error occurred while loading wallet file", e);
//                throw new UserServiceException("Error occurred while loading wallet file", e);
//            } catch (Exception e) {
//                log.error("Error occurred while writing transaction on network");
//                throw new UserServiceException("" + e.getMessage(), e);
//            }
//        } else {
//            throw new UserServiceException("User not found with email Id: " + emailId);
//        }
//    }

//    @Override
//    public WalletAccountResponse restoreUserWalletAccount(String mnemonic, String username) {
//        return walletAccountService.restoreUserAccount(username, mnemonic);
//    }

    @Override
    public WalletAccountResponse getKeys(String username) {
        return walletAccountService.retrieveKeys(username);
    }

    @Override
    public List<UserDto> getUserByRole(String role) {
        var usersList = userRepository.findUsersByRole(role);

        if (usersList.isEmpty()) {
            throw new GenericException("No users present with the role: " + role);
        } else {
            List<UserDto> userDtoList = new ArrayList<>();

            usersList.forEach(u -> {
                UserDto dto = UserDto.builder()
                        .name(u.getName())
                        .email(u.getEmail())
                        .loginId(u.getLoginId())
                        .active(u.isActive())
                        .credentialsNonExpired(u.isCredentialsNonExpired())
                        .accountNonExpired(u.isAccountNonExpired())
                        .accountNonLocked(u.isAccountNonLocked())
                        .userCreatedBy(u.getUserCreatedBy())
                        .userCreatedOn(u.getUserCreatedOn())
                        .roles(u.getUserRole().getRole())
                        .build();
                userDtoList.add(dto);
            });

            return userDtoList;
        }
    }

    @Override
    public List<NotificationDto> getUserAllNotification(String username) {
        var optionalUser = existingUser(username);

        if (optionalUser.isPresent()) {
            var notifications = notificationRepository.findByNotifications(username);

            return buildNotificationResponse(notifications);
        } else {
            throw new UserServiceException("User not found with email Id: " + username);
        }
    }

    @Override
    public List<NotificationDto> getAllUnreadNotifications(String username) {
        var optionalUser = existingUser(username);

        if (optionalUser.isPresent()) {
            var notifications = notificationRepository.findUnreadNotifications(username);
            return buildNotificationResponse(notifications);
        } else {
            throw new UserServiceException("User not found with email Id: " + username);
        }
    }

    @Override
    public SuccessResponseDto markNotificationAsRead(ReadNotificationRequest request, String name) {
        var optionalNotification =
                notificationRepository.findByUniqueNotificationId(request.getUniqueNotificationId());

        if (optionalNotification.isPresent()) {
            var notification = optionalNotification.get();

            notification.setIsRead(request.getIsRead());
            notificationRepository.save(notification);

            return SuccessResponseDto.builder()
                    .response("Notification marked as read")
                    .build();
        } else {
            log.info("No such notification exist");
            throw new UserServiceException("No such notification exist");
        }
    }

    private List<NotificationDto> buildNotificationResponse(List<Notification> notifications) {
        var notificationDtoList = new ArrayList<NotificationDto>();

        notifications.forEach(n -> {
            NotificationDto notificationDto = NotificationDto.builder()
                    .message(n.getNotificationMsg())
                    .isRead(n.getIsRead())
                    .uniqueNotificationId(n.getUniqueNotificationId())
                    .build();

            notificationDtoList.add(notificationDto);
        });

        return notificationDtoList;
    }

    private Optional<Users> existingUser(String emailId) {
        return userRepository.findByEmail(emailId);
    }

    private Roles existingRole(String role) {
        var roleFromDb = rolesRepository.findByRole(role);

        if (roleFromDb.isPresent()) {
            return roleFromDb.get();
        } else {
            throw new UserServiceException("No such role");
        }
    }

    private UserDto transformToUserDto(Users user) {
        return UserDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .loginId(user.getLoginId())
                .active(user.isActive())
                .credentialsNonExpired(user.isCredentialsNonExpired())
                .accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked())
                .userCreatedBy(user.getUserCreatedBy())
                .userCreatedOn(user.getUserCreatedOn())
                .roles(user.getUserRole().getRole())
                .build();
    }

    private Users transformRequestToAdminEntity(AdminSignUpRequest request, String requestedBy, Roles userRole, String walletFileName) {

        return buildUser(request.getName(), request.getEmail(), request.getPassword(), userRole, requestedBy, walletFileName);
    }

    private Users buildUser(String name, String email, String password, Roles userRole, String requestedBy, String walletFileName) {
        return Users.builder()
                .name(name)
                .email(email)
                .loginId(email)
                .password(encoder.encode(password))
                .userRole(userRole)
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isActive(true)
                .userCreatedBy(requestedBy)
                .userCreatedOn(LocalDate.now())
                .provider(AuthProvider.LOCAL)
                .providerId(null)
                .imageUrl(null)
                .walletFileName(walletFileName)
                .build();
    }
}
