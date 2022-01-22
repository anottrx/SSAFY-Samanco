package com.ssafy.api.service;

import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;

public interface ProjectService {

    Project createProject(ProjectRegisterPostReq projectRegisterPostReq);

    int updateProject(ProjectUpdatePostReq updateInfo);
}
