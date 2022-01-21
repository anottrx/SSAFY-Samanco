package com.ssafy.api.service;

import com.ssafy.api.request.ClubRegisterPostReq;
import com.ssafy.api.request.ClubUpdatePostReq;
import com.ssafy.db.entity.Club;
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
    public Club createClub(ClubRegisterPostReq clubRegisterPostReq) {
        Club club = new Club();
        club.setCollectStatus(clubRegisterPostReq.getCollectStatus());
        club.setDescription(clubRegisterPostReq.getDescription());
        club.setSchedule(clubRegisterPostReq.getSchedule());
        club.setSize(clubRegisterPostReq.getSize());
        club.setCollectStatus(clubRegisterPostReq.getCollectStatus());
        club.setTag(clubRegisterPostReq.getTag());
        club.setTitle(clubRegisterPostReq.getTitle());
        club.setStartDate(club.getStartDate());
        club.setEndDate(club.getEndDate());

        return clubRepository.save(club);
    }

    @Override
    public void updateClub(ClubUpdatePostReq updateInfo) {
        clubRepositorySupport.deleteClub(updateInfo.getId());

    }
}
