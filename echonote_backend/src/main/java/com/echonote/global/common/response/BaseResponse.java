package com.echonote.global.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"code", "message", "data"})
public class BaseResponse<T> {
	private final int code;
	private final String message;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private T data;

	public BaseResponse(T data) {
		this.message = BaseResponseStatus.SUCCESS.getMessage();
		this.code = BaseResponseStatus.SUCCESS.getCode();
		this.data = data;
	}

	public BaseResponse(BaseResponseStatus status) {
		this.message = status.getMessage();
		this.code = status.getCode();
	}

	public static BaseResponse<Void> ok() {
		return new BaseResponse<>(BaseResponseStatus.SUCCESS);
	}

	public static BaseResponse<Void> successCreating() {
		return new BaseResponse<>(BaseResponseStatus.SUCCESS_CREATING);
	}
}

