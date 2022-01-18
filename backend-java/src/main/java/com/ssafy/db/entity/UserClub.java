package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class UserClub extends BaseEntity{

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @JoinColumn(name = "club_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Club club;

    @JoinColumn(name = "position_id")
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private PositionSize positionSize;

    @Enumerated(EnumType.STRING)
    private UserJoinClubStatus joinStatus;



}
