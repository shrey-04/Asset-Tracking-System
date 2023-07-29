package com.blockchain.logistics.service.impl.helper;

import com.blockchain.logistics.persistence.entity.Users;
import com.blockchain.logistics.persistence.entity.Notification;
import com.blockchain.logistics.persistence.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationSender {

    private final NotificationRepository notificationRepository;

    public void sendNotification(Users user, String to, String msg) {
        if (Objects.isNull(user)) {
            log.info("Unable to send notification as user isn't registered");
        } else {
            log.info("Sending notification to: {}", to);

            var sendUserNotification = Notification.builder()
                    .isRead(false)
                    .notificationMsg(msg)
                    .user(user)
                    .uniqueNotificationId(to + LocalTime.now())
                    .build();

            notificationRepository.save(sendUserNotification);
        }
    }
}
