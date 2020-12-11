package com.example.post.security.services;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.post.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private Long id;
	private String nameFirst;
	private String nameLast;
	private String email;
	private String phone;
	private String customer;
	private String location;
	private String contract;
	private String division;
	private String jobTitle;
	private String biography;

	@JsonIgnore
	private String password;

	private Collection<? extends GrantedAuthority> authorities;

	public UserDetailsImpl(Long id, String nameFirst, String nameLast, String email, String phone, String password,
						   String customer, String location, String contract, String division, String jobTitle,
						   String biography, Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.nameFirst = nameFirst;
		this.nameLast = nameLast;
		this.email = email;
		this.phone = phone;
		this.password = password;
		this.customer = customer;
		this.location = location;
		this.contract = contract;
		this.division = division;
		this.jobTitle = jobTitle;
		this.biography = biography;
		this.authorities = authorities;
	}

	public static UserDetailsImpl build(User user) {
		List<GrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name()))
				.collect(Collectors.toList());

		return new UserDetailsImpl(
				user.getId(),
				user.getNameFirst(),
				user.getNameLast(),
				user.getEmail(),
				user.getPhone(),
				user.getPassword(),
				user.getCustomer(),
				user.getLocation(),
				user.getContract(),
				user.getDivision(),
				user.getJobTitle(),
				user.getBiography(),
				authorities);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getUsername() {
		return this.email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}
}
