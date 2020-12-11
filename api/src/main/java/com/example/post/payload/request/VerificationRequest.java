package com.example.post.payload.request;

import javax.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class VerificationRequest {
	@NotBlank
	private String verificationString;
}
