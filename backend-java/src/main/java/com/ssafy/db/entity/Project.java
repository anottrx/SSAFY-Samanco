package com.ssafy.db.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Project extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String collectStatus="ING";     // ING, END
    private int size=6;
    private int totalFrontendSize=0;
    private int totalBackendSize=0;
    private int totalMobileSize=0;
    private int totalEmbeddedSize=0;
    private int currentFrontendSize=0;
    private int currentBackendSize=0;
    private int currentMobileSize=0;
    private int currentEmbeddedSize=0;
    private String description;
    private String startDate;
    private String endDate;
    private Long likes=0l;
    private Long hostId;
    private String hostPosition;
    private Long hit=0l;

}
