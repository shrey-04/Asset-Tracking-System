package com.blockchain.logistics.exception;

public class DashboardServiceException extends RuntimeException {

    public DashboardServiceException(String msg, Throwable error) {
        super(msg, error);
    }
}
