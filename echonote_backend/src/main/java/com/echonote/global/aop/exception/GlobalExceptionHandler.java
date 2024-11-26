package com.echonote.global.aop.exception;

import org.slf4j.MDC;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.echonote.global.common.exception.BaseException;
import com.echonote.global.common.response.BaseResponse;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
	@ExceptionHandler(BaseException.class)
	public ResponseEntity<BaseResponse<BaseException>> handleBaseException(BaseException e) {
		e.printStackTrace();
		log.info("[error handler requestId {}, status: {}, message: {}]", MDC.get("requestId"), e.getStatus(),
			e.getMessage());
		return ResponseEntity
			.status(HttpStatusCode.valueOf(e.getStatus().getCode()))
			.body(new BaseResponse<>(e.getStatus()));
	}
}
