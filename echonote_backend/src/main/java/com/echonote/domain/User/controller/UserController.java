package com.echonote.domain.User.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.echonote.domain.User.dto.UserRequest;
import com.echonote.global.common.response.BaseResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "user api")
public class UserController {
	@PostMapping("/login")
	@Operation(summary = "유저 로그인", description = "아이디와 패스워드로 로그인을 합니다.")
	public ResponseEntity<BaseResponse<Void>> loginMember(@RequestBody UserRequest.LoginDto loginDto) {

		return ResponseEntity.ok(BaseResponse.ok());
	}

}
