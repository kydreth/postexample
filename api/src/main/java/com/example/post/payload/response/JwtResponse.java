package com.example.post.payload.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String email;
	private String phone;
	private String nameFirst;
	private String nameLast;
	private String customer;
	private String location;
	private String contract;
	private String division;
	private String jobTitle;
	private String biography;
	private List<String> roles;

	// TODO: just have User object?
	public JwtResponse(String accessToken, Long id, String nameFirst, String nameLast, String email, String phone,
					   String customer, String location, String contract, String division, String jobTitle,
					   String biography, List<String> roles) {
		this.token = accessToken;
		this.id = id;
		this.nameFirst = nameFirst;
		this.nameLast = nameLast;
		this.email = email;
		this.phone = phone;
		this.customer = customer;
		this.location = location;
		this.contract = contract;
		this.division = division;
		this.jobTitle = jobTitle;
		this.biography = biography;
		this.roles = roles;
	}

	public String getAccessToken() {
		return token;
	}

	public void setAccessToken(String accessToken) {
		this.token = accessToken;
	}

	public String getTokenType() {
		return type;
	}

	public void setTokenType(String tokenType) {
		this.type = tokenType;
	}

	public List<String> getRoles() {
		return roles;
	}
}
