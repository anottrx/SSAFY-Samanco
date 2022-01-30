package com.ssafy.api.response;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.model.StudyDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudySelectAllRes extends BaseResponseBody {

    private List<StudyDto> studies;

    public static StudySelectAllRes of(Integer statusCode, String message, List<StudyDto> studies) {
        StudySelectAllRes res = new StudySelectAllRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setStudies(studies);

        return res;
    }
}
