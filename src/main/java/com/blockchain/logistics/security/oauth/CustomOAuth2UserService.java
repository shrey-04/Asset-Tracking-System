package com.blockchain.logistics.security.oauth;

import com.blockchain.logistics.exception.GenericException;
import com.blockchain.logistics.exception.auth.OAuth2AuthenticationProcessingException;
import com.blockchain.logistics.persistence.entity.Roles;
import com.blockchain.logistics.persistence.entity.Users;
import com.blockchain.logistics.lib.constant.AuthProvider;
import com.blockchain.logistics.lib.constant.RoleConstant;
import com.blockchain.logistics.persistence.repository.RolesRepository;
import com.blockchain.logistics.persistence.repository.UserRepository;
import com.blockchain.logistics.security.CustomUserDetails;
import com.blockchain.logistics.security.user.OAuth2UserInfo;
import com.blockchain.logistics.security.user.OAuthUserInfoFactory;
import com.blockchain.logistics.service.impl.helper.WalletAccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.web3j.crypto.Bip39Wallet;
import org.web3j.crypto.WalletUtils;
import org.web3j.model.Logistics;
//import org.web3j.model.LogisticsNativeToken;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Value("${chain.account.wallet-directory}")
    private String walletFileDirectory;

    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;

    private final WalletAccountService service;
    private final Logistics logistics;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOauthUserRequest(userRequest, oAuth2User);
        } catch (AuthenticationException e) {
            log.error("Authentication error: {}", e.getMessage());
            log.debug("Authentication error: ", e.getStackTrace());
            throw e;
        } catch (Exception e) {
            log.error("Error occurred while Authenticating {}", e.getMessage());
            log.debug("Error occurred while Authenticating ", e.getStackTrace());

            throw new InternalAuthenticationServiceException(e.getMessage(), e);
        }
    }

    private OAuth2User processOauthUserRequest(OAuth2UserRequest userRequest, OAuth2User oAuthUser) {
        log.info("OAuth request processing started");
        var authProvider = userRequest.getClientRegistration().getRegistrationId();
        var authUserInfo = OAuthUserInfoFactory.getOAuthUserInfo(authProvider, oAuthUser.getAttributes());

        if (StringUtils.isEmpty(authUserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<Users> userOptional = userRepository.findByEmail(authUserInfo.getEmail());

        Users user;
        if (userOptional.isPresent()) {
            user = userOptional.get();

            log.info("User found. Updating existing user");

            user = updateExistingUser(user, authUserInfo, authProvider);

            return new CustomUserDetails(user, oAuthUser.getAttributes(), null);

        } else {
            log.info("No user found. Creating a new user with the id {} and provider {}", authUserInfo.getEmail(), authProvider);
            var wallet = service.createAccount(authUserInfo.getEmail());

            user = registerNewUser(authProvider, authUserInfo, wallet);

            return new CustomUserDetails(user, oAuthUser.getAttributes(), wallet);
        }
    }

    private Users registerNewUser(String authProvider, OAuth2UserInfo oAuth2UserInfo, Bip39Wallet wallet) {
        Roles role;
        try {
            var userCredentials =
                    WalletUtils.loadCredentials(oAuth2UserInfo.getEmail(), walletFileDirectory + wallet.getFilename());

            role = rolesRepository.findByRole(RoleConstant.ROLE_USER.getValue()).get();

            logistics.grantRoles(role.getRole(), userCredentials.getAddress()).send();

//            nativeToken.mint(BigInteger.valueOf(nativeTokenInitialAmount)).send();
//            nativeToken.transfer(userCredentials.getAddress(), BigInteger.valueOf(nativeTokenInitialAmount));
        } catch (Exception e) {
            log.error("Error occurred while signing in: ", e);
            throw new GenericException("Error occurred while signing in", e);
        }

        Users user = Users.builder()
                .name(oAuth2UserInfo.getName())
                .email(oAuth2UserInfo.getEmail())
                .loginId(oAuth2UserInfo.getEmail())
                .provider(AuthProvider.valueOf(authProvider.toUpperCase()))
                .providerId(oAuth2UserInfo.getId())
                .imageUrl(oAuth2UserInfo.getImageUrl())
                .userRole(role)
                .isActive(true)
                .isCredentialsNonExpired(true)
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .userCreatedBy("Self")
                .userCreatedOn(LocalDate.now())
                .walletFileName(wallet.getFilename())
                .build();

        return userRepository.save(user);
    }

    private Users updateExistingUser(Users existingUser, OAuth2UserInfo oAuth2UserInfo, String authProvider) {
        existingUser.setName(oAuth2UserInfo.getName());
        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
        existingUser.setProvider(AuthProvider.valueOf(authProvider.toUpperCase()));
        existingUser.setProviderId(oAuth2UserInfo.getId());
        return userRepository.save(existingUser);
    }
}
