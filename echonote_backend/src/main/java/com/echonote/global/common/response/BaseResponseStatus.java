package com.echonote.global.common.response;

import lombok.Getter;

/**
 * status code 및 메시지 관리
 */
@Getter
public enum BaseResponseStatus {
	/**
	 * 200 : 요청 성공
	 */
	SUCCESS(200, "요청에 성공하였습니다."),
	SUCCESS_CREATING(201, "생성에 성공하였습니다."),

	/**
	 * 404 리소스 못 찾는 에러
	 */
	USER_NOT_FOUND(404, "유저를 찾을 수 없습니다."),
	RESOURCE_NOT_FOUND(404, "리소스를 찾을 수 없습니다.");


	private final int code;
	private final String message;

	private BaseResponseStatus(int code, String message) { //BaseResponseStatus 에서 각 해당하는 코드를 생성자로 맵핑
		this.code = code;
		this.message = message;
	}
}
