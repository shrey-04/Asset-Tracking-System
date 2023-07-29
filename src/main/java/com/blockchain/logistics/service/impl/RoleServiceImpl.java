package com.blockchain.logistics.service.impl;

import com.blockchain.logistics.persistence.repository.RolesRepository;
import com.blockchain.logistics.persistence.repository.UserRepository;
import com.blockchain.logistics.service.impl.helper.BlockChainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleServiceImpl {

    private static final String ROLE_BEGINNING = "ROLE_";

    @Value("${chain.account.wallet-directory}")
    private String walletFileDirectory;

    private final RolesRepository roleRepository;
    private final UserRepository userRepository;
    private final BlockChainService blockChainService;

//    @Override
//    public String createRole(String roleRequest, Principal principal) {
//        var roleToAdd = roleRequest.startsWith(ROLE_BEGINNING) ? roleRequest : ROLE_BEGINNING + roleRequest;
//
//        var roleFromDb = roleRepository.findByRole(roleToAdd);
//        var user = userRepository.findByEmail(principal.getName());
//
//        if (roleFromDb.isEmpty() && user.isPresent()) {
//            try {
//                var walletFile = user.get().getWalletFileName();
//                var credentials = WalletUtils.loadCredentials(user.get().getEmail(), walletFileDirectory + walletFile);
//                Function function = new Function(Logistics.FUNC_ADDROLE,
//                        List.of(
//                                new Utf8String(roleToAdd)),
//                        Collections.emptyList());
//
//                var response = blockChainService.signAndTransactOnLogisticsContract(function, credentials);
//
//                log.info("Transaction hash is: {}", response.getTransactionHash());
//
//                Roles role = Roles.builder()
//                        .role(roleToAdd)
//                        .createdBy(principal.getName())
//                        .createdOn(LocalDate.now())
//                        .build();
//
//                roleRepository.save(role);
//
//                return "Successfully created role: " + roleToAdd.toLowerCase();
//            } catch (IOException | CipherException e) {
//                log.error("Error occurred while loading wallet file", e);
//                throw new RoleServiceException("Error occurred while loading wallet file", e);
//            } catch (Exception e) {
//                log.error("Error occurred while writing transaction on network", e);
//                throw new RoleServiceException("Error occurred while writing transaction on network", e);
//            }
//        } else {
//            throw new RoleServiceException("Role already exist");
//        }
//    }

//    @Override
//    public List<RolesDto> getAllRoles() {
//        List<RolesDto> rolesDto = new ArrayList<>();
//
//        roleRepository.findAll().forEach(r -> {
//            RolesDto dto = RolesDto.builder()
//                    .role(r.getRole())
//                    .roleCreatedBy(Objects.nonNull(r.getCreatedBy()) ? r.getCreatedBy() : null)
//                    .roleCreatedOn(Objects.nonNull(r.getCreatedOn()) ? r.getCreatedOn() : null)
//                    .modifiedBy(Objects.nonNull(r.getModifiedBy()) ? r.getModifiedBy() : null)
//                    .modifiedOn(Objects.nonNull(r.getModifiedOn()) ? r.getModifiedOn() : null)
//                    .build();
//
//            rolesDto.add(dto);
//        });
//
//        return rolesDto;
//    }

//    @Override
//    public SuccessResponseDto deleteRole(String proposedRole, Principal principal) {
//        var role = roleRepository.findByRole(proposedRole);
//
//        if (role.isPresent()) {
//            roleRepository.delete(role.get());
//            log.info("Role deleted by {}", principal.getName());
//
//            return SuccessResponseDto.builder()
//                    .response("Deleted role " + proposedRole + " successfully")
//                    .build();
//        } else {
//            return SuccessResponseDto.builder()
//                    .response("Role does not exist")
//                    .build();
//        }
//    }

//    @Override
//    public SuccessResponseDto updateRole(RoleUpdateRequest roleUpdateRequest, Principal principal) {
//        var role = roleRepository.findByRole(roleUpdateRequest.getExistingRole());
//
//        if (role.isPresent()) {
//            var roleToUpdate = role.get();
//
//            var newRoleName = roleUpdateRequest.getNewName().startsWith(ROLE_BEGINNING) ?
//                    roleUpdateRequest.getNewName() : ROLE_BEGINNING + roleUpdateRequest.getNewName().toUpperCase();
//
//            if (roleUpdateRequest.getExistingRole().equals("ROLE_USER")) {
//                throw new RoleServiceException("USER role can't be updated");
//            }
//
//            roleToUpdate.setRole(newRoleName);
//            roleToUpdate.setModifiedBy(principal.getName());
//            roleToUpdate.setModifiedOn(LocalDate.now());
//
//            roleRepository.save(roleToUpdate);
//
//            return SuccessResponseDto.builder()
//                    .response("Role updated successfully")
//                    .build();
//        } else {
//            log.error("No role found with role name: {}", roleUpdateRequest.getExistingRole());
//            throw new RoleServiceException("Role doesn't exist");
//        }
//    }
}
