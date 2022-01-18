package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "image")
public class ImageFile extends BaseEntity{

    @Column(name = "save_folder")
    private String saveFolder;

    @Column(name = "save_file")
    private String saveFile;

    @Column(name = "origin_file")
    private String originFile;

    @OneToOne(mappedBy = "image")
    private User user;

    @OneToOne(mappedBy = "image")
    private Club club;

}
