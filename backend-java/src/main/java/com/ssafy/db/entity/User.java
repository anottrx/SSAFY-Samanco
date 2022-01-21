package com.ssafy.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import static javax.persistence.FetchType.LAZY;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String nickname;

    private String name;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String birthday;

    private String phone;

    private String userClass;   // JAVA, PYTHON, EMBEDDED, MOBILE

    private int generation;

    private String studentId;

    private String position;  // 사용자 포지션 [FRONTEND, BACKEND,  MOBILE, EMBEDDED]
    private String link;

    private String description;
    private Long projectId=0l;
    private String projectJoinStatus;

}
