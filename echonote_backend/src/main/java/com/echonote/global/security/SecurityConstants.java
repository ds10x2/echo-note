package com.echonote.global.security;

public class SecurityConstants {
	// 인증 없이도 접근할 수 있는 공통 경로를 변수로 정의한다.
	public static final String[] EXCLUDE_URI_LIST = {
		"/swagger-ui/**",
		"/v3/api-docs/**",
		"/swagger-resources/**",
		"/webjars/**",
		"/**",
		"/api/user/login/**",
	};
}
