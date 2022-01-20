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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private CollectStatus collectStatus;

    private String schedule;

    private int size;

    private String description;

    private Long image_id;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Long likes;

    private Long host_id;

    private Long hit;

    @Enumerated(EnumType.STRING)
    private ClubTag clubTag;

}
