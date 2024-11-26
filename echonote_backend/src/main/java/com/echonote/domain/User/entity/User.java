package com.echonote.domain.User.entity;

import java.sql.Timestamp;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	private String email;
	private String password;
	private String phoneNumber;

	@CreatedDate
	private Timestamp createdAt;

	@LastModifiedDate
	private Timestamp lastModified;



	@Builder
	public User(String email, String password, String phoneNumber) {
		this.email = email;
		this.password = password;
		this.phoneNumber = phoneNumber;
	}

	@Override
	public String toString() {
		return "User{" +
			"id=" + id +
			", email='" + email + '\'' +
			", password='" + password + '\'' +
			", phoneNumber='" + phoneNumber + '\'' +
			", createdAt=" + createdAt +
			", lastModified=" + lastModified +
			'}';
	}
}
