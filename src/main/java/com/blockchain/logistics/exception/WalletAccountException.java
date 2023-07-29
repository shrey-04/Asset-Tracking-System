package com.blockchain.logistics.exception;

public class WalletAccountException extends RuntimeException {

    public WalletAccountException(String msg) {
        super(msg);
    }

    public WalletAccountException(String msg, Throwable error) {
        super(msg, error);
    }
}
