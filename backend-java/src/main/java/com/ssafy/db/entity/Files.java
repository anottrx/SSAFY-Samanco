package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Files extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String path;
    private String saveFolder;
    private String saveFile;
    private String originFile;
    private Long tagId;
    private String tag;
//    private Long boardId;
//    private Long userId;
//    private Long studyId;
//    private Long projectId;

}
