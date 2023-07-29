package com.blockchain.logistics.exception;

public class RoleServiceException extends RuntimeException {

    public RoleServiceException(String msg) {
        super(msg);
    }

    public RoleServiceException(String msg, Throwable t) {
        super(msg, t);
    }
}
