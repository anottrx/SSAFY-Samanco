package com.ssafy.api.response;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("ProjectSelectAllPostRes")
public class ProjectSelectAllRes extends BaseResponseBody {

    private List<ProjectDto> projects;

    public static ProjectSelectAllRes of(Integer statusCode, String message, List<ProjectDto> projects) {
        ProjectSelectAllRes res = new ProjectSelectAllRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setProjects(projects);

        return res;
    }
}
