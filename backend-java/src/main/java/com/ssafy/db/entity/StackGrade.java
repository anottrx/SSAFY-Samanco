package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@NoArgsConstructor
public class StackGrade extends BaseEntity{

    private String name;

    private int grade;

    @JoinColumn(name="club_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Club club;

    @JoinColumn(name="user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;




//    @Column(name="HTML")
//    private int html;
//
//    @Column(name="CSS")
//    private int css;
//
//    @Column(name="JavaScript")
//    private int js;
//
//    @Column(name="VueJS")
//    private int vuejs;
//
//    @Column(name="React")
//    private int react;
//
//    @Column(name="Angular")
//    private int angular;
//
//    @Column(name="Python")
//    private int python;
//
//    @Column(name="Java")
//    private int java;
//
//    @Column(name="C")
//    private int c;
//
//    @Column(name="Spring_boot")
//    private int springBoot;
//
//    @Column(name="MySQL")
//    private int mysql;
//
//    @Column(name="Git")
//    private int git;
//
//    @Column(name="AWS")
//    private int aws;
//
//    @Column(name="Docker")
//    private int docker;
//
//    @Column(name="Linux")
//    private int linux;
//
//    @Column(name="Jira")
//    private int jira;
//
//    @Column(name="Django")
//    private int django;
//
//    @Column(name="Redis")
//    private int redis;

}
