package com.example.post.payload.request;

import javax.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LoginRequest {
	@NotBlank
	@Email
	private String email;

	@NotBlank
	private String password;

	private String changePassword;

	private String verificationString;
}
