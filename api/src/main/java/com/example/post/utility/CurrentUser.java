package com.example.post.utility;

import java.util.List;
import java.util.stream.Collectors;

import com.example.post.security.services.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.post.payload.response.JwtResponse;

public class CurrentUser {
    private static CurrentUser SINGLETON;
    private Authentication authentication;
    private UserDetailsImpl details;
    private List<String> roles;

    private CurrentUser() {
        authentication = SecurityContextHolder.getContext().getAuthentication();
        getDetails(true);
        getRoles(true);
    }

    public static CurrentUser getInstance() {
        return new CurrentUser();
    }

    public UserDetailsImpl getDetails(Boolean noCache) {
        if (details == null || noCache) {
            details = (UserDetailsImpl) authentication.getPrincipal();
        }
        return details;
    }

    public UserDetailsImpl getDetails() {
        return details;
    }

    public List<String> getRoles(Boolean noCache) {
        if (roles == null || noCache) {
            roles = details.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());
        }
        return roles;
    }

    public List<String> getRoles() {
        return roles;
    }

    public ResponseEntity<?> getResponseEntity(String jwt) {
        return ResponseEntity.ok(new JwtResponse(jwt,
                details.getId(),
                details.getNameFirst(),
                details.getNameLast(),
                details.getEmail(),
                details.getPhone(),
                details.getCustomer(),
                details.getLocation(),
                details.getContract(),
                details.getDivision(),
                details.getJobTitle(),
                details.getBiography(),
                roles));
    }
}
