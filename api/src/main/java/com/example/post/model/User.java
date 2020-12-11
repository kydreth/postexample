package com.example.post.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.post.payload.request.CreateNewUserRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(	name = "users",
		uniqueConstraints = {
				@UniqueConstraint(columnNames = "email")
		})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User extends AuditModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Column(columnDefinition = "text")
	private String nameFirst;

	@NotBlank
	@Column(columnDefinition = "text")
	private String nameLast;

	@NotBlank
	@Column(columnDefinition = "text")
	@Email
	private String email;

	@Column(columnDefinition = "text")
	private String phone;

	@NotBlank
	@Column(columnDefinition = "text")
	@JsonIgnore
	private String password;

	@Column(columnDefinition = "text")
	private String customer;

	@Column(columnDefinition = "text")
	private String location;

	@Column(columnDefinition = "text")
	private String contract;

	@Column(columnDefinition = "text")
	private String division;

	@Column(columnDefinition = "text")
	private String jobTitle;

	@Column(columnDefinition = "text")
	private String biography;

	@NotBlank
	@Column(columnDefinition = "boolean")
	private Boolean verified;

	@Column(columnDefinition = "text")
	@JsonIgnore
	private String verificationString;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(	name = "user_roles",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();

	public User(CreateNewUserRequest createNewUserRequest, String password) {
		this.nameFirst = createNewUserRequest.getNameFirst();
		this.nameLast = createNewUserRequest.getNameLast();
		this.email = createNewUserRequest.getEmail();
		this.phone = createNewUserRequest.getPhone();
		this.customer = createNewUserRequest.getCustomer();
		this.location = createNewUserRequest.getLocation();
		this.contract = createNewUserRequest.getContract();
		this.division = createNewUserRequest.getDivision();
		this.jobTitle = createNewUserRequest.getJobTitle();
		this.biography = createNewUserRequest.getBiography();
		this.password = password;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public Boolean hasRole(Role role) {
		return this.roles.contains(role);
	}
}
