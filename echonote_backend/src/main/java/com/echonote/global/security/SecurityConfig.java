package com.echonote.global.security;

import java.util.Collections;
import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// cors
		http
			.cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

				@Override
				public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

					CorsConfiguration configuration = new CorsConfiguration();

					configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "https://REMOVED/api", "http://localhost:5173"));
					configuration.setAllowedMethods(Collections.singletonList("*"));
					configuration.setAllowCredentials(true);
					configuration.setAllowedHeaders(Collections.singletonList("*"));
					configuration.setMaxAge(3600L);

					// 클라이언트가 응답에서 접근할 수 있는 헤더를 설정
					configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"));
					configuration.setExposedHeaders(Arrays.asList("Set-Cookie", "Authorization"));

					return configuration;
				}
			}));

		// csrf disable
		http
			.csrf((auth) -> auth.disable());

		// Form 로그인 방식 disable
		http
			.formLogin((auth) -> auth.disable());

		// HTTP Basic 인증 방식 disable
		http
			.httpBasic((auth) -> auth.disable());


		// 경로별 인가 작업
		http
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(SecurityConstants.EXCLUDE_URI_LIST).permitAll()
				.anyRequest().authenticated() // 그 외 모든 요청 인증처리
			);


		// 세션 설정 : STATELESS
		http
			.sessionManagement((session) -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

}
