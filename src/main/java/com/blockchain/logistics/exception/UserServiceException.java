package com.blockchain.logistics.exception;

public class UserServiceException extends RuntimeException {

    public UserServiceException(String msg) {
        super(msg);
    }

    public UserServiceException(String msg, Throwable t) {
        super(msg, t);
    }
}
