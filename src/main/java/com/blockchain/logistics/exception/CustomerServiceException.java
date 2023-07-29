package com.blockchain.logistics.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class CustomerServiceException extends RuntimeException {

    private final String message;
    private final HttpStatus status;
}
