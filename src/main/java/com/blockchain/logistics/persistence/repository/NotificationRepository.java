package com.blockchain.logistics.persistence.repository;

import com.blockchain.logistics.persistence.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("from Notification n inner join n.user u where u.email = ?1")
    List<Notification> findByNotifications(String username);

    @Query("from Notification n inner join n.user u where u.email = ?1 and n.isRead = false")
    List<Notification> findUnreadNotifications(String username);

    Optional<Notification> findByUniqueNotificationId(String uniqueId);
}
