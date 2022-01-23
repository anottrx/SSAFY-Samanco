package com.ssafy.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserDto {

    private Long id;
    private String email;
    private String nickname;
    private String name;
//    @JsonIgnore
//    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String birthday;
    private String phone;
    private String userClass;   // JAVA, PYTHON, EMBEDDED, MOBILE
    private int generation;
    private String studentId;
    private String position;  // 사용자 포지션 [FRONTEND, BACKEND,  MOBILE, EMBEDDED]
    private String link;
    private String description;
    private Long projectId;
    private String projectJoinStatus;
    private List<StackGradeDto> stacks;

    public UserDto(Long id, String email, String nickname, String name, String password, String birthday,
                   String phone, String userClass, int generation, String studentId, String position, String link,
                   String description, Long projectId, String projectJoinStatus, List<StackGradeDto> stacks) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.name = name;
        this.password = password;
        this.birthday = birthday;
        this.phone = phone;
        this.userClass = userClass;
        this.generation = generation;
        this.studentId = studentId;
        this.position = position;
        this.link = link;
        this.description = description;
        this.projectId = projectId;
        this.projectJoinStatus = projectJoinStatus;
        this.stacks = stacks;
    }
}
