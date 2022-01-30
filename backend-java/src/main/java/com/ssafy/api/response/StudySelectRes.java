package com.ssafy.api.response;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.model.StudyDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudySelectRes extends BaseResponseBody {

    private StudyDto study;

    public static StudySelectRes of(Integer statusCode, String message, StudyDto study) {
        StudySelectRes res = new StudySelectRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setStudy(study);

        return res;
    }
}
