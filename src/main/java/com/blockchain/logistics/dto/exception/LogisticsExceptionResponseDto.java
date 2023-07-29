package com.blockchain.logistics.dto.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogisticsExceptionResponseDto {

    private Boolean error;

    private String message;
}
