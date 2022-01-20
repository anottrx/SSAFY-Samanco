package com.ssafy.api.service;

import com.ssafy.db.entity.User;

import java.util.List;
import java.util.Map;

public interface StackService {

    void CreateStack(List<Map<String, Integer>> stacks, Long userId);
}
