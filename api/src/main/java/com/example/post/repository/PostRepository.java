package com.example.post.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.post.model.User;
import com.example.post.model.Post;
import com.example.post.model.PostAggregateByUser;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserId(Long userId, Pageable pageable);
    Page<Post> findByUser(User user, Pageable pageable);
    Long countByUser(User user);
    @Query("SELECT i.user.id AS userId, COUNT(i.id) AS totalPosts FROM Post AS i GROUP BY i.user.id ORDER BY totalPosts DESC")
    List<PostAggregateByUser> countTotalPostsByUserInterface();
}
