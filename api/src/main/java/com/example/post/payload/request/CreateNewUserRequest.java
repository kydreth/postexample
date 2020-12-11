package com.example.post.payload.request;

import java.util.Set;

import javax.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CreateNewUserRequest {
    @NotBlank
    private String nameFirst;

    @NotBlank
    private String nameLast;

    @NotBlank
    @Email
    private String email;

    private String phone;

    @NotBlank
    private String password;

    private String customer;

    private String location;

    private String contract;

    private String division;

    private String jobTitle;

    private String biography;

    private Set<String> roles;

    public Set<String> getRoles() {
      return this.roles;
    }

    public void setRole(Set<String> roles) {
      this.roles = roles;
    }
}
