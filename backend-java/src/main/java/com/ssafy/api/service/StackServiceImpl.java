package com.ssafy.api.service;

import com.ssafy.db.entity.StackGrade;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.StackRepository;
import com.ssafy.db.repository.StackRepositorySupport;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("stackService")
public class StackServiceImpl implements StackService{

    @Autowired
    StackRepository stackRepository;

    @Autowired
    StackRepositorySupport stackRepositorySupport;

    @Override
    public void CreateStack(List<Map<String, Integer>> stacks, User user) {
        for (Map<String, Integer> stack: stacks){
            for (Map.Entry<String, Integer>entry: stack.entrySet()){
                String name= entry.getKey();
                int grade= entry.getValue();
                StackGrade stackGrade=new StackGrade();
                stackGrade.setName(name);
                stackGrade.setGrade(grade);
                stackGrade.setUser(user);
                stackRepository.save(stackGrade);
            }
        }
    }
}
