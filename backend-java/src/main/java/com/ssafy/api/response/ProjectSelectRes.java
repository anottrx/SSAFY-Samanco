package com.ssafy.api.response;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("ProjectSelectPostRes")
public class ProjectSelectRes extends BaseResponseBody {

    private ProjectDto project;
//    Long hostId;
//    Long projectId;
//    String title;
//    String collectStatus;
//    String description;
//    String startDate;
//    String endDate;
//    int size;
//    List<Map<String, Integer>> stacks;
//    List<Map<String, Integer>> position;

    public static ProjectSelectRes of(Integer statusCode, String message, ProjectDto project) {
        ProjectSelectRes res = new ProjectSelectRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setProject(project);
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
