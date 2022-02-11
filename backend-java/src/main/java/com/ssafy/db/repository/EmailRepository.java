package com.ssafy.db.repository;

import com.ssafy.db.entity.EmailCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<EmailCode, Long> {
}
