package com.echonote.domain.User.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.echonote.domain.User.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
