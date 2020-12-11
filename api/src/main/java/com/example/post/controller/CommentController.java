package com.example.post.controller;

import com.example.post.exception.ResourceNotFoundException;
import com.example.post.model.Comment;
import com.example.post.model.User;
import com.example.post.repository.PostRepository;
import com.example.post.repository.UserRepository;
import com.example.post.security.services.UserDetailsImpl;
import com.example.post.utility.CurrentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.post.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@Transactional
@RestController
@RequestMapping("/api/post")
public class CommentController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    PostRepository postRepository;

    @GetMapping("/{postId}/comments")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Page<Comment> getCommentsByPostId(@PathVariable Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable);
    }

    @PostMapping("/{postId}/comments")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Comment addComment(@PathVariable Long postId,
                            @Valid @RequestBody Comment comment) {
        return postRepository.findById(postId)
                .map(post -> {
                    comment.setPost(post);

                    UserDetailsImpl details = CurrentUser.getInstance().getDetails();
                    User user = userRepository.findByEmail(details.getEmail())
                            .orElseThrow(() -> new UsernameNotFoundException(
                                    "User Not Found with email: " + details.getEmail()));
                    comment.setUser(user);

                    return commentRepository.save(comment);
                }).orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + postId));
    }

    @PutMapping("/{postId}/comments/{commentId}")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public Comment updateComment(@PathVariable Long postId,
                               @PathVariable Long commentId,
                               @Valid @RequestBody Comment commentRequest) {
        if(!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id " + postId);
        }

        return commentRepository.findById(commentId)
                .map(comment -> {
                    comment.setDescription(commentRequest.getDescription());
                    return commentRepository.save(comment);
                }).orElseThrow(() -> new ResourceNotFoundException("Comment not found with id " + commentId));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    @PreAuthorize("hasRole('REGISTERED') or hasRole('AUTHENTICATED') or hasRole('MODERATOR') or hasRole('LEADERSHIP') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId,
                                          @PathVariable Long commentId) {
        if(!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id " + postId);
        }

        return commentRepository.findById(commentId)
                .map(comment -> {
                    commentRepository.delete(comment);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Comment not found with id " + commentId));

    }
}
