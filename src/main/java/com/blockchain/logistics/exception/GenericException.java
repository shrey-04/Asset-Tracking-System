package com.blockchain.logistics.exception;

public class GenericException extends RuntimeException {

    public GenericException(String msg) {
        super(msg);
    }

    public GenericException(String msg, Exception e) {
        super(msg, e);
    }
}
