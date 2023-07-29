package com.blockchain.logistics;

import com.blockchain.logistics.exception.GenericException;
import com.blockchain.logistics.persistence.entity.Users;
import com.blockchain.logistics.service.impl.helper.WalletAccountService;
import com.blockchain.logistics.lib.constant.AuthProvider;
import com.blockchain.logistics.lib.constant.RoleConstant;
import com.blockchain.logistics.persistence.repository.RolesRepository;
import com.blockchain.logistics.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.web3j.crypto.WalletUtils;
import org.web3j.model.Logistics;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@SpringBootApplication
@RequiredArgsConstructor
public class Application implements CommandLineRunner {

    @Value("${chain.account.super-admin-wallet-address}")
    private String superAdminWalletAddress;


    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;

    private final Logistics logistics;


    private final PasswordEncoder encoder;
    private final WalletAccountService service;

    private int counter = 1;
    private static final String SUPER_ADMIN = "SUPER_ADMIN";

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) {
        List<Users> usersList = new ArrayList<>();


        usersList.add(createUsers(RoleConstant.ROLE_USER.getValue(), "User", "user@nitw.com"));
        usersList.add(createUsers(RoleConstant.ROLE_ADMIN.getValue(), "Admin", "admin@nitw.com"));
        usersList.add(createUsers(RoleConstant.ROLE_SUPPLIER.getValue(), "Supplier", "supplier@nitw.com"));
        usersList.add(createUsers(RoleConstant.ROLE_CARRIER.getValue(), "Carrier", "carrier@nitw.com"));
        usersList.add(createUsers(RoleConstant.ROLE_WAREHOUSE.getValue(), "Warehouse", "warehouse@nitw.com"));
        usersList.add(createUsers(RoleConstant.ROLE_SUPER_ADMIN.getValue(), "Shreya", "shreya.bawaskar@nitw.com"));

        usersList.removeAll(Collections.singletonList(null));

        userRepository.saveAll(usersList);
    }

    private Users createUsers(String role, String userName, String email) {
        var user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            var roleFromDb = rolesRepository.findByRole(role);

            if (roleFromDb.isPresent()) {
                log.info("{}", counter);
                var wallet = service.createAccount(email);
                var address = WalletUtils.loadBip39Credentials(email, wallet.getMnemonic()).getAddress();

                counter++;

                var userRole = roleFromDb.get();

                try {
                    logistics.grantRoles(role, address).send();

                } catch (Exception e) {
                    log.error("Unable to add user on the network");
                    throw new GenericException("Unable to add user on the network", e);
                }

                return Users.builder()
                        .userRole(userRole)
                        .name(userName)
                        .email(email)
                        .loginId(email)
                        .password(encoder.encode("p"))
                        .isAccountNonExpired(true)
                        .isAccountNonLocked(true)
                        .isCredentialsNonExpired(true)
                        .isActive(true)
                        .provider(AuthProvider.LOCAL)
                        .userCreatedBy(SUPER_ADMIN)
                        .userCreatedOn(LocalDate.now())
                        .modifiedBy(SUPER_ADMIN)
                        .walletFileName(wallet.getFilename())
                        .build();
            } else {
                throw new GenericException("No such role");
            }
        } else {
            log.info("User already exist");
            return null;
        }
    }
}




// Flow of the application
// Supplier => Carrier => Warehouse => Carrier => Consignee
// Transactions are done in above order except for the consignee
// When consignee is receiving the asset transaction is done by Carrier that he/she has delivered it
// Creation of asset transaction is done by supplier and transfering it to carrier is also done by Supplier