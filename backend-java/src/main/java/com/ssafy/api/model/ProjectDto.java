package com.ssafy.api.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ProjectDto {
    private Long id;
    private String title;
    private String collectStatus;     // ING, END
    private List<PositionDto> positions;
    private List<StackGradeDto> stacks;
    private String description;
    private String startDate;
    private String endDate;
    private int likes;  // Long으로 캐스팅이 안됨..
    private Long hostId;
    private String hostPosition;
    private Long hit;
    private FileDto file;
    private Long deadline;
    private boolean userLike=false;
    private String projectJoinStatus;

}

