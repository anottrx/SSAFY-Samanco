package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.ClubUpdatePostReq;
//import com.ssafy.db.entity.QClub;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public class ClubRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

//    QClub qClub=QClub.club;

    @Transactional
    public void deleteClub(Long id) {
        // isDelete=true
//        jpaQueryFactory.delete(qClub).where(qClub.id.eq(id)).execute();
    }

    @Transactional
    public void updateClub(ClubUpdatePostReq clubUpdateinfo){

//        Long clubId=clubUpdateinfo.getId();
//        String collectStatus=(clubUpdateinfo.getCollectStatus());
//        String description=(clubUpdateinfo.getDescription());
//        String schedule=(clubUpdateinfo.getSchedule());
//        int size=(clubUpdateinfo.getSize());
//        String tag=(clubUpdateinfo.getTag());
//        String title=(clubUpdateinfo.getTitle());
//        String startDate=(clubUpdateinfo.getStartDate());
//        String endDate=(clubUpdateinfo.getEndDate());
//
//        jpaQueryFactory.update(qClub).where(qClub.id.eq(clubId))
//                .set(qClub.collectStatus, collectStatus).set(qClub.schedule, schedule).set(qClub.size, size)
//                .set(qClub.description, description).set(qClub.tag, tag).set(qClub.title, title)
//                .set(qClub.startDate, startDate).set(qClub.endDate, endDate).execute();
    }
}
