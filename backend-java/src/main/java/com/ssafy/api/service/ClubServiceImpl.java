package com.ssafy.api.service;

import com.ssafy.api.request.ClubRegisterPostReq;
import com.ssafy.api.request.ClubUpdatePostReq;
import com.ssafy.db.entity.Study;
import com.ssafy.db.repository.ClubRepository;
import com.ssafy.db.repository.ClubRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClubServiceImpl implements ClubService{

    @Autowired
    ClubRepository clubRepository;

    @Autowired
    ClubRepositorySupport clubRepositorySupport;

    @Override
    public Study createClub(ClubRegisterPostReq clubRegisterPostReq) {
        Study study = new Study();
//        study.setHostId(clubRegisterPostReq.getUserId());
//        study.setCollectStatus(clubRegisterPostReq.getCollectStatus());
//        study.setDescription(clubRegisterPostReq.getDescription());
//        study.setSchedule(clubRegisterPostReq.getSchedule());
//        study.setSize(clubRegisterPostReq.getSize());
//        study.setCollectStatus(clubRegisterPostReq.getCollectStatus());
//        study.setTag(clubRegisterPostReq.getTag());
//        study.setTitle(clubRegisterPostReq.getTitle());
//        study.setStartDate(clubRegisterPostReq.getStartDate());
//        study.setEndDate(clubRegisterPostReq.getEndDate());

        return clubRepository.save(study);
    }

    @Override
    public void updateClub(ClubUpdatePostReq updateInfo) {
        clubRepositorySupport.updateClub(updateInfo);
    }
}
