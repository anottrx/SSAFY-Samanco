package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Room extends BaseEntity{

    private String name;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    private int size;

    @Column(name = "is_secret")
    private Boolean isSecret;

    private String password;


    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private User host;

}
