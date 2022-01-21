package com.ssafy.db.repository;

import com.ssafy.db.entity.Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Study, Long> {
}
