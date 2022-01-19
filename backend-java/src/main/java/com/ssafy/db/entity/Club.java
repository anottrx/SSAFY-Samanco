package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Club extends BaseEntity{

    private String title;

    @Column(name="collect_status")
    private CollectStatus collectStatus;

    private String schedule;

    private int size;

    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    private ImageFile image;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @OneToMany(mappedBy = "club")
    private List<StackGrade> stackGrades=new ArrayList<>();

    private Long likes;

    @OneToMany(mappedBy = "club")
    private List<PositionSize> positionSizes=new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="host")
    private User host;

    private Long hit;

    @Enumerated(EnumType.STRING)
    private ClubTag clubTag;

    @OneToMany(mappedBy = "club")
    private List<UserClub> userClubs=new ArrayList<>();

}
