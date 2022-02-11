package com.ssafy.api.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class StudyDto {

    private Long id;
    private String title;
    private String collectStatus;     // ING, END
    private List<StackGradeDto> stacks;
    private String description;
    private String schedule;
    private int likes;  // Long으로 캐스팅이 안됨..
    private Long hostId;
    private Long hit=0l;
    private int size=6;
    private FileDto file;
    private boolean userLike=false;
    private String studyJoinStatus;
    private boolean canRegister=false;
    private boolean canJoin=false;
}
