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

    private String collectStatus="ING";     // ING, END

    private String schedule;

    private int size;

    private String description;

    private String startDate;

    private String endDate;

    private Long likes=0l;

    private Long hostId;

    private Long hit=0l;

    private String tag;     // STUDY, PROJECT;
}
