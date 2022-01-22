package com.ssafy.db.repository;

import com.ssafy.db.entity.StackGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface StackRepository extends JpaRepository<StackGrade, Long> {
//    Long CreateStack(List<Map<String, Integer>> stacks);
}
