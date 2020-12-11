package com.example.post.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
	@GetMapping("/all")
	public String allAccess() {
		return "Public Content.";
	}

	@GetMapping("/registered")
	@PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
	public String registeredAccess() {
		return "Registered Content.";
	}

	@GetMapping("/authenticated")
	@PreAuthorize("hasRole('AUTHENTICATED')")
	public String authenticatedAccess() {
		return "Authenticated Board.";
	}

	@GetMapping("/moderator")
	@PreAuthorize("hasRole('MODERATOR')")
	public String moderatorAccess() {
		return "Moderator Board.";
	}

	@GetMapping("/leadership")
	@PreAuthorize("hasRole('LEADERSHIP')")
	public String leadershipAccess() {
		return "Leadership Board.";
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public String adminAccess() {
		return "Admin Board.";
	}
}
