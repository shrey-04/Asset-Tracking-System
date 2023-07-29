package com.blockchain.logistics.exception;

import com.blockchain.logistics.exception.auth.ResourceNotFoundException;
import com.blockchain.logistics.dto.exception.LogisticsExceptionResponseDto;
import com.blockchain.logistics.dto.exception.MultiLogisticsErrors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<LogisticsExceptionResponseDto> globalHandler(Exception e) {
        log.error("Error occurred in the application {}", e.getMessage());
        log.debug("Error occurred in the application: {}", e.getStackTrace());
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(GenericException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> genericHandler(GenericException e) {
        log.error("Generic error: {}", e.getMessage());
        log.debug("Generic error: {}", e.getStackTrace());
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MultiLogisticsErrors> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
        log.error("Method argument invalid for parameter: {} exception is: {}", e.getParameter(), e.getMessage());
        log.debug("Method argument invalid {}", e.getStackTrace());

        var errorList = e.getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        return new ResponseEntity<>(buildMultipleErrorMessages(errorList), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> constraintViolationExceptionHandler(ConstraintViolationException e) {
        log.error("Constraint violation error occurred {} message is: {}", e.getConstraintViolations(), e.getMessage());
        log.debug("Constraint violation error occurred {}", e.getStackTrace());

        StringBuilder sb = new StringBuilder();
        AtomicReference<String> errorMsg = new AtomicReference<>();

        e.getConstraintViolations().forEach(c -> {
            sb.append(c.getMessage()).append(": ");
            c.getPropertyPath().forEach(p -> errorMsg.set(p.getName()));
            sb.append(errorMsg);
        });

        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(sb.toString()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleAccessDenied(AccessDeniedException e) {
        log.error("Access denied: {}", e.getMessage());
        log.debug("Access denied: {}", e.getStackTrace());

        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleResourceNotFoundException(ResourceNotFoundException e) {
        log.error("{}", e.getMessage());
        log.debug("Not found: {} {} {} {}", e.getResourceName(), e.getFieldName(), e.getFieldValue(), e.getStackTrace());

        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserServiceException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleUserAlreadyExistException(UserServiceException e) {
        log.debug("{}", e.getStackTrace());
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MerchantServiceException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleMerchantServiceException(MerchantServiceException e) {
        log.debug("{}", e.getStackTrace());

        var returnStatus = Objects.nonNull(e.getHttpStatus()) ? e.getHttpStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), returnStatus);
    }

    @ExceptionHandler(CustomerServiceException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleCustomerServiceException(CustomerServiceException e) {
        log.debug("{}", e.getStackTrace());
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), e.getStatus());
    }

    @ExceptionHandler(DashboardServiceException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleDashboardServiceException(DashboardServiceException e) {
        log.debug("{}", e.getStackTrace());
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RoleServiceException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleRoleServiceException(RoleServiceException e) {
        log.debug("{}", e.getStackTrace());
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(WalletAccountException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleWalletAccountException(WalletAccountException e) {
        log.error("{}", e.getMessage());
        log.debug("{}", e.getStackTrace());
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BlockChainServiceException.class)
    public ResponseEntity<LogisticsExceptionResponseDto> handleBlockChainServiceException(BlockChainServiceException e) {
        return new ResponseEntity<>(logisticsExceptionResponseDtoBuilder(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }


    private LogisticsExceptionResponseDto logisticsExceptionResponseDtoBuilder(String msg) {
        return LogisticsExceptionResponseDto.builder()
                .error(true)
                .message(msg)
                .build();
    }

    private MultiLogisticsErrors buildMultipleErrorMessages(List<String> errors) {
        return MultiLogisticsErrors.builder()
                .error(true)
                .message(errors)
                .build();
    }
}
