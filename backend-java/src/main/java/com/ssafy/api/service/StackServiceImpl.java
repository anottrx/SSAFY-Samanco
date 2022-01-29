package com.ssafy.api.service;

import com.ssafy.api.model.StackGradeDto;
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
    public void createStack(List<Map<String, Integer>> stacks, Long tagId, String tag) {
        if (stacks==null){
            return;
        }
        for (Map<String, Integer> stack: stacks){
            for (Map.Entry<String, Integer>entry: stack.entrySet()){
                String name= entry.getKey();
                int grade= entry.getValue();
                StackGrade stackGrade=new StackGrade();
                stackGrade.setName(name);
                stackGrade.setGrade(grade);
                stackGrade.setTagId(tagId);
                stackGrade.setTag(tag);
                stackRepository.save(stackGrade);
            }
        }
    }

    @Override
    public void updateStack(List<Map<String, Integer>> stacks, Long tagId, String tag) {
        if (stacks==null){
            return;
        }
        stackRepositorySupport.deleteStack(tagId, tag);
        createStack(stacks, tagId, tag);
    }

    @Override
    public List<StackGradeDto> selectStack(Long tagId, String tag) {
        return stackRepositorySupport.selectStack(tagId, tag);
    }

    @Override
    public List<String> selectStackAll(String tag) {
        return stackRepositorySupport.selectStackAll(tag);
    }
}
