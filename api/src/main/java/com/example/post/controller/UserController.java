package com.example.post.controller;

import java.util.HashSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.validation.Valid;

import com.example.post.model.ERole;
import com.example.post.repository.UserRepository;
import com.example.post.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.post.model.Role;
import com.example.post.model.User;
import com.example.post.payload.request.VerificationRequest;
import com.example.post.payload.request.LoginRequest;
import com.example.post.payload.request.CreateNewUserRequest;
import com.example.post.payload.response.MessageResponse;
import com.example.post.repository.RoleRepository;
import com.example.post.security.jwt.JwtUtils;
import com.example.post.security.services.UserDetailsImpl;
import com.example.post.utility.CurrentUser;
import com.example.post.config.CustomPropertyConfig;
import com.example.post.model.Mail;
import com.example.post.service.EmailSenderService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
	@Value("${postexample.app.env}")
	private String env;

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@Autowired
	EmailSenderService emailSenderService;

	@Autowired
	CustomPropertyConfig customPropertyConfig;

	private Boolean isAdmin(User user) {
		return user.hasRole(roleRepository.findByName(ERole.ROLE_ADMIN)
				.orElseThrow(() -> new RuntimeException("Error: isAdmin(User user) ERole.ROLE_ADMIN not found.")));
	}

	private ResponseEntity<?> sendMail(User user, String success, String failure) {
		try {
			Mail mail = this.newUserRegistionMail(user.getEmail(), user.getVerificationString());
			emailSenderService.sendEmail(mail, "email-registration");
			return ResponseEntity.ok(new MessageResponse(success));

		} catch(Exception e) {
			System.err.println(e);
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse(failure));
		}
	}

	// TODO: update to thymeleaf best practices, https://www.thymeleaf.org/doc/articles/springmail.html
	private Mail newUserRegistionMail(String email, String verificationString) {
		Mail mail = new Mail();
		mail.setFrom(customPropertyConfig.mailFrom);
		mail.setReplyTo(customPropertyConfig.mailReplyTo);
		mail.setTo(email);
		mail.setCc("post@example.com");
		//mail.setBcc();
		mail.setSubject("New Account Registration Confirmation");
		Map<String, Object> model = new HashMap<>();
		model.put("registerurl", String.format(
				"https://post.example.com/#/verification?v=%s",
				verificationString));
		mail.setModel(model);
		return mail;
	}

	private void logVerificationString(User user) {
		System.out.println(String.format(
				"http://localhost:4200/#/verification?v=%s",
				user.getVerificationString()));
	}

	@PostMapping("/")
	public ResponseEntity<?> createUser(@Valid @RequestBody CreateNewUserRequest createNewUserRequest) {
		if (userRepository.existsByEmail(createNewUserRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already taken!"));
		}

		User user = new User(createNewUserRequest, encoder.encode(createNewUserRequest.getPassword()));
		user.setVerified(false);
		user.setVerificationString(UUID.randomUUID().toString());

		Set<Role> roles = new HashSet<>();
		Role userRole = roleRepository.findByName(ERole.ROLE_REGISTERED)
				.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		roles.add(userRole);
		user.setRoles(roles);

		userRepository.save(user);
		if("PROD".equals(this.env)) {
			return this.sendMail(
					user,
					"User registered successfully!",
					"Sending email registration failed, is this a valid email address?"
			);
		} else {
			System.out.println(String.format("env set to: ",this.env));
			System.out.println(String.format("development mode detected, no registration email sent for: %s",
					user.getEmail()));
			this.logVerificationString(user);
			return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
		}
	}

	@PostMapping("/verification")
	public ResponseEntity<?> verifyUser(@Valid @RequestBody VerificationRequest verificationRequest) {
		User user = userRepository.findByVerificationString(verificationRequest.getVerificationString())
				.orElseThrow(() -> new RuntimeException(String.format(
						"Error: User with verification string %s not found.",verificationRequest.getVerificationString())));
		user.setVerified(true);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User verification success! Please log-in."));
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		User user = userRepository.findByEmail(loginRequest.getEmail())
				.orElseThrow(() -> new RuntimeException(String.format(
						"Error: User with email %s not found.",loginRequest.getEmail())));
		if(!user.getVerified()) {
			System.out.println(String.format(
					"User not verified: %s", loginRequest.getEmail()));
			this.logVerificationString(user);
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Please check your email for a verification link. You must verify your email address."));
		} else if(user.getVerificationString() != null) {
			System.out.println(String.format(
					"First-time-login for user: %s", loginRequest.getEmail()));
			user.setVerificationString(null);
			userRepository.save(user);
		}

		return CurrentUser.getInstance().getResponseEntity(jwt);
	}

	@PostMapping("/logout")
	@PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
	public ResponseEntity<?> logoutUser(@Valid @RequestBody LoginRequest loginRequest) {

		return null;
	}

	@PostMapping("/invite")
	@PreAuthorize("hasRole('LEADERSHIP') or hasRole('ADMIN')")
	public ResponseEntity<?> inviteUser(@Valid @RequestBody CreateNewUserRequest createNewUserRequest) {
		if (userRepository.existsByEmail(createNewUserRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already taken!"));
		}

		User user = new User(createNewUserRequest, encoder.encode(createNewUserRequest.getPassword()));
		user.setVerified(false);
		user.setVerificationString(UUID.randomUUID().toString());
		Set<String> strRoles = createNewUserRequest.getRoles();
		Set<Role> roles = new HashSet<>();

		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_REGISTERED)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				Role lookupRole;
				switch (role) {
					case "admin":
						lookupRole = roleRepository.findByName(ERole.ROLE_ADMIN)
								.orElseThrow(() -> new RuntimeException("Error: admin role is not found."));
						break;
					case "leadership":
						lookupRole = roleRepository.findByName(ERole.ROLE_LEADERSHIP)
								.orElseThrow(() -> new RuntimeException("Error: leadership role is not found."));

						break;
					case "moderator":
						lookupRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
								.orElseThrow(() -> new RuntimeException("Error: moderator role is not found."));

						break;
					case "authenticated":
						lookupRole = roleRepository.findByName(ERole.ROLE_AUTHENTICATED)
								.orElseThrow(() -> new RuntimeException("Error: authenticated role is not found."));

						break;
					case "registered":
					default:
						lookupRole = roleRepository.findByName(ERole.ROLE_REGISTERED)
								.orElseThrow(() -> new RuntimeException("Error: registered role is not found."));
				}
				roles.add(lookupRole);
			});
		}

		user.setRoles(roles);
		userRepository.save(user);

		return this.sendMail(
				user,
				"User invited successfully!",
				"Sending email registration failed, is this a valid email address?"
		);
	}

	@PostMapping("/password")
	@PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
	public ResponseEntity<?> changePassword(@Valid @RequestBody LoginRequest loginRequest) {
		User user = userRepository.findByEmail(loginRequest.getEmail())
				.orElseThrow(() -> new RuntimeException(String.format(
						"Error: User with email %s not found.",loginRequest.getEmail())));
		user.setPassword(loginRequest.getChangePassword());
		userRepository.save(user);

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getChangePassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		return CurrentUser.getInstance().getResponseEntity(jwt);
	}

	// TODO: /email

	@PostMapping("/update")
	@PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
	public ResponseEntity<?> updateUser(@Valid @RequestBody CreateNewUserRequest request) {

		UserDetailsImpl details = CurrentUser.getInstance().getDetails();
		User loggedInUser = userRepository.findByEmail(details.getEmail())
				.orElseThrow(() -> new UsernameNotFoundException(String.format(
						"Error: Unable to retrieve logged in user: %s", details.getEmail())));

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException(String.format(
						"Error: User with email %s not found.", request.getEmail())));

		Boolean isAdmin = this.isAdmin(loggedInUser);
		// updating self on user-profile
		// updating self on user-management
		// updating other on user-management
		if(loggedInUser.getId() != user.getId() && !isAdmin) {
			String msg = "Unauthorized update to user!";
			System.err.println(msg);
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse(msg));
		}

		user.setNameFirst(request.getNameFirst());
		user.setNameLast(request.getNameLast());
		user.setPhone(request.getPhone());

		user.setCustomer(request.getCustomer());
		user.setContract(request.getContract());
		user.setDivision(request.getDivision());
		user.setJobTitle(request.getJobTitle());
		user.setLocation(request.getLocation());
		user.setBiography(request.getBiography());

		if(isAdmin) {
			Set<Role> roles = new HashSet<>();
			for(String str_role : request.getRoles()) {
				Role role = roleRepository.findByName(Role.convertFromString(str_role))
						.orElseThrow(() -> new RuntimeException(String.format(
								"Error: Role is not found: %s", str_role)));
				roles.add(role);
			}
			user.setRoles(roles);
		}
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
	}

    @GetMapping("/by/email/{userEmail}")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public User getUserByName(@PathVariable String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + userEmail));
    }


    @GetMapping("/by/id/{userId}")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public User getUserById(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

	@GetMapping("/list")
	@PreAuthorize("hasRole('LEADERSHIP') or hasRole('ADMIN')")
	public Page<User> getAllUsers(Pageable pageable) {
		return userRepository.findAll(pageable);
	}
}
