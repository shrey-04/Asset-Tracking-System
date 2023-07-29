package com.blockchain.logistics.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class MerchantServiceException extends RuntimeException {

    private final String message;
    private final HttpStatus httpStatus;
}
