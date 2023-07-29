package com.blockchain.logistics.persistence.repository;

import com.blockchain.logistics.persistence.entity.Menus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menus,Long> {

    Optional<Menus> findByMenuId(Long menuId);
}
