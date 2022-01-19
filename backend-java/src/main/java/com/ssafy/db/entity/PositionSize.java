package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PositionSize extends BaseEntity{

    private String name;

    private int size;

    @JoinColumn(name = "user_club_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private UserClub userClub;

    @JoinColumn(name = "club_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Club club;
}
