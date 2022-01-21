package com.ssafy.api.service;

import com.ssafy.db.entity.User;

import java.util.List;
import java.util.Map;

public interface StackService {

    void createStack(List<Map<String, Integer>> stacks, Long id, int flag);
    void updateStack(List<Map<String, Integer>> stacks, Long id, int flag);
}
