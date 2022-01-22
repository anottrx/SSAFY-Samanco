package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Project;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ApiModel("ProjectSelectPostRes")
public class ProjectSelectPostRes extends BaseResponseBody {

    Long hostId;
    Long projectId;
    String title;
    String collectStatus;
    String description;
    String startDate;
    String endDate;
    int size;
    List<Map<String, Integer>> stacks;
    List<Map<String, Integer>> position;

    public static ProjectSelectPostRes of(Integer statusCode, String message, Project project) {
        ProjectSelectPostRes res = new ProjectSelectPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setHostId(project.getHostId());
        res.setProjectId(project.getId());
        res.setTitle(project.getTitle());
        res.setCollectStatus(project.getCollectStatus());
        res.setDescription(project.getDescription());
        res.setStartDate(project.getStartDate());
        res.setEndDate(project.getEndDate());

        return res;
    }
}
