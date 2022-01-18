package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PositionSize extends BaseEntity{

    private int frontend;

    private int backend;

    private int embedded;

    private int mobile;

    @JoinColumn(name = "user_club")
    @OneToOne(mappedBy = "positionSize")
    private UserClub userClub;

    @OneToOne(mappedBy = "positionSize")
    private Club club;
}
