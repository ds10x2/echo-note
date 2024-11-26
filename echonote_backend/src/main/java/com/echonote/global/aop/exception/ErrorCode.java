package com.echonote.global.aop.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	GLOBAL_EXCEPTION(500, "알 수 없는 오류"),
	BAD_REQUEST(400, "잘못된 요청입니다."),
	NOT_FOUND(404, "찾을 수 없습니다."),
	NOT_MEMBER_CLOTHES(403, "자신의 옷이 아닙니다."),
	NOT_MATCH_TOP(400, "상하의가 맞지 않습니다."),
	LOGIN_FAILED(401, "로그인에 실패했습니다.");

	private final int status;
	private final String message;
}
