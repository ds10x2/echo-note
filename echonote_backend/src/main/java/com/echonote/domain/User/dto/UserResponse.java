package com.echonote.domain.User.dto;

import lombok.Builder;
import lombok.Getter;

public class UserResponse {
	@Getter
	public static class LoginDto {
		private final String email;

		@Builder
		public LoginDto(String email) {
			this.email = email;
		}
	}
}
