package com.ssafy.db.repository;

import com.ssafy.db.entity.UserStudy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStudyRepository extends JpaRepository<UserStudy, Long> {
}
