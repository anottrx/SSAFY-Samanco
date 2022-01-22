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
    public void createStack(List<Map<String, Integer>> stacks, Long id, int flag) {
        for (Map<String, Integer> stack: stacks){
            for (Map.Entry<String, Integer>entry: stack.entrySet()){
                String name= entry.getKey();
                int grade= entry.getValue();
                StackGrade stackGrade=new StackGrade();
                stackGrade.setName(name);
                stackGrade.setGrade(grade);
                if (flag==1) {
                    stackGrade.setUserId(id);
                } else if (flag==2) {
                    stackGrade.setProjectId(id);
                } else if (flag==3) {
                    stackGrade.setStudyId(id);
                }
                stackRepository.save(stackGrade);
            }
        }
    }

    @Override
    public void updateStack(List<Map<String, Integer>> stacks, Long id, int flag) {
        stackRepositorySupport.deleteStack(id, flag);
        createStack(stacks, id, flag);

    }

    @Override
    public List<StackGradeDto> selectStack(Long id, int flag) {
        return stackRepositorySupport.selectStack(id, flag);
    }
}
