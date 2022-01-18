package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class File extends BaseEntity{

    @Column(name = "save_folder")
    private String saveFolder;

    @Column(name = "save_file")
    private String saveFile;

    @Column(name = "origin_file")
    private String originFile;

    @JoinColumn(name="board_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Board board;

}
