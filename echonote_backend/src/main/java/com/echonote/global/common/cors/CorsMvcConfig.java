package com.echonote.global.common.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry corsRegistry) {

		corsRegistry
			.addMapping("/**")
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE",
				"OPTIONS") // 허용하려는 HTTP Method 설정 (OPTIONS는 Preflight 설정)
			.allowedOriginPatterns("http://localhost:3000", "https://REMOVED/api", "http://localhost:5173") // 허용하려는 클라이언트 측 주소
			.allowCredentials(true) // HttpOnly Cookie를 사용하기 위한 설정
			.allowedHeaders("Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "text/event-stream") // 허용할 헤더에 Content-Type 추가
			.exposedHeaders("Set-Cookie")
			.exposedHeaders("Access-Control-Allow-Methods")
			.exposedHeaders("Access-Control-Allow-Headers")
			.exposedHeaders("Access-Control-Allow-Credentials")
			.exposedHeaders("FAuthorization")
			.maxAge(3600); // Preflight Cache 설정
	}
}
