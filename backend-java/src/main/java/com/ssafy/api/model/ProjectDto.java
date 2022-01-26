package com.ssafy.api.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ProjectDto {
    private Long id;
    private String title;
    private String collectStatus;     // ING, END
//    private int size;
    private List<PositionDto> positions;
    private List<StackGradeDto> stacks;
    private String description;
    private String startDate;
    private String endDate;
    private Long likes;
    private Long hostId;
    private String hostPosition;
    private Long hit;
    private FileDto file;

    public ProjectDto(Long id, String title, String collectStatus, List<PositionDto> positions,
                      List<StackGradeDto> stacks, String description, String startDate, String endDate, Long likes,
                      Long hostId, String hostPosition, Long hit, FileDto file) {
        this.id = id;
        this.title = title;
        this.collectStatus = collectStatus;
//        this.size = size;
        this.positions = positions;
        this.stacks = stacks;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.likes = likes;
        this.hostId = hostId;
        this.hostPosition = hostPosition;
        this.hit = hit;
        this.file = file;
    }
}
