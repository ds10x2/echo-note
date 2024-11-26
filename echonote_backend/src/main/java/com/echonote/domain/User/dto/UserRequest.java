package com.echonote.domain.User.dto;


import lombok.Builder;
import lombok.Getter;

public class UserRequest {

	@Getter
	public static class LoginDto {
		private final String email;
		private final String password;
		private final String phoneNumber;

		@Builder
		public LoginDto(String email, String password, String phoneNumber) {
			this.email = email;
			this.password = password;
			this.phoneNumber = phoneNumber;
		}
	}

}
