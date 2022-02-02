package com.ssafy.api.service;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.model.StackGradeDto;
import com.ssafy.db.entity.StackGrade;
import com.ssafy.db.entity.User;

import java.util.List;
import java.util.Map;

public interface StackService {

    void createStack(List<Map<String, Integer>> stacks, Long tagId, String tag);
    void updateStack(List<Map<String, Integer>> stacks, Long tagId, String tag);
    List<StackGradeDto> selectStack(Long tagId, String tag);
    List<String> selectStackAll(String tag);
}
