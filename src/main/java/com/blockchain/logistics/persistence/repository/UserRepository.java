package com.blockchain.logistics.persistence.repository;

import com.blockchain.logistics.persistence.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    @Query("from Users u inner join u.userRole r where r.role = ?1")
    List<Users> findUsersByRole(String roleConstant);
}
