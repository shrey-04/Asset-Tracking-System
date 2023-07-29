package com.blockchain.logistics.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadNotificationRequest {

    private String uniqueNotificationId;

    private Boolean isRead;
}
