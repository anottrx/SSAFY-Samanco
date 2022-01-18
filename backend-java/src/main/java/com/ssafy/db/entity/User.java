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

    private String email;

    private String nickname;

    private String name;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String birthday;

    private String phone;

    @JoinColumn(name = "class")
    @Enumerated(EnumType.STRING)
    private UserClass userClass;

    private int generation;

    @Column(name = "student_id")
    private String studentId;

    @Enumerated(EnumType.STRING)
    private UserPosition position;  // 사용자 포지션 [FRONTEND, BACKEND,  MOBILE, EMBEDDED]

    @Column(name = "stack_id")
    private Long stackId;

    private String link;

    private String description;

    @JoinColumn(name="image_id")
    @OneToOne
    private ImageFile image;

    @JoinColumn(name = "room_id")
    @OneToOne(mappedBy = "host", fetch = LAZY)
    private Room room;

    @OneToMany(mappedBy = "user")
    private List<UserClub> userClubs=new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Board> boards=new ArrayList<>();



}
