package com.ssafy.api.response;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.License;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("ProjectSelectAllPostRes")
public class ProjectSelectAllPostRes extends BaseResponseBody {

    private List<ProjectDto> projects;

    public static ProjectSelectAllPostRes of(Integer statusCode, String message, List<ProjectDto> projects) {
        ProjectSelectAllPostRes res = new ProjectSelectAllPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setProjects(projects);
//        res.setHostId(project.getHostId());
//        res.setProjectId(project.getId());
//        res.setTitle(project.getTitle());
//        res.setCollectStatus(project.getCollectStatus());
//        res.setDescription(project.getDescription());
//        res.setStartDate(project.getStartDate());
//        res.setEndDate(project.getEndDate());

        return res;
    }
}
