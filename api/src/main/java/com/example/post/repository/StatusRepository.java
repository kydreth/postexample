package com.example.post.repository;

import java.util.Optional;

import com.example.post.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.post.model.EStatus;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
	Optional<Status> findByName(EStatus name);
}
