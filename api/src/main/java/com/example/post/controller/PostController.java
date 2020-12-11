package com.example.post.controller;

import javax.validation.Valid;

import com.example.post.model.*;
import com.example.post.model.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import com.example.post.exception.ResourceNotFoundException;
import com.example.post.repository.StatusRepository;
import com.example.post.repository.UserRepository;
import com.example.post.repository.PostRepository;
import com.example.post.security.services.UserDetailsImpl;
import com.example.post.utility.CurrentUser;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Transactional
@RestController
@RequestMapping("/api/post")
public class PostController {
    @Autowired
    StatusRepository statusRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PostRepository postRepository;

    @PostMapping("/")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Post createPost(@Valid @RequestBody Post post) {
        UserDetailsImpl details = CurrentUser.getInstance().getDetails();
        User user = userRepository.findByEmail(details.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User Not Found with email: " + details.getEmail()));
        post.setUser(user);

        Status status = statusRepository.findByName(EStatus.STATUS_DRAFT)
                .orElseThrow(() -> new RuntimeException("Error: status is not found."));
        post.setStatus(status);

        post.setActive(true);

        return postRepository.save(post);
    }

    @GetMapping("/{postId}")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Post getPost(@PathVariable Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + postId));
    }

    @PutMapping("/{postId}")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Post updatePost(@PathVariable Long postId, @Valid @RequestBody Post postRequest) {
        return postRepository.findById(postId)
                .map(post -> {
                    post.setTitle(postRequest.getTitle());
                    post.setDescription(postRequest.getDescription());
                    post.setBusinessCase(postRequest.getBusinessCase());
                    return postRepository.save(post);
                }).orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + postId));
    }

    @DeleteMapping("/{postId}")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        return postRepository.findById(postId)
                .map(post -> {
                    postRepository.delete(post);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + postId));
    }

    @GetMapping("/list/authored")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Page<Post> getPostsAuthored(Pageable pageable) {
        UserDetailsImpl details = CurrentUser.getInstance().getDetails();
        User user = userRepository.findByEmail(details.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User Not Found with email: " + details.getEmail()));
        return postRepository.findByUser(user, pageable);
    }

    @GetMapping("/list/user/{userId}")
    @PreAuthorize("hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Page<Post> getPostsByUser(@PathVariable Long userId, Pageable pageable) {
        return postRepository.findByUserId(userId, pageable);
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    @GetMapping("/count/by/user/{userId}")
    @PreAuthorize("hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Long countByUserId(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User Not Found with id: " + userId));
        return postRepository.countByUser(user);
    }

    @GetMapping("/aggregate/by/user")
    @PreAuthorize("hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public List<PostAggregateByUser> aggregateByUser() {
        return postRepository.countTotalPostsByUserInterface();
    }
}
