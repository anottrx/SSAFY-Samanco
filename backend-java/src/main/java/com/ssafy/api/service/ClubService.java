package com.ssafy.api.service;

import com.ssafy.api.request.ClubRegisterPostReq;
import com.ssafy.api.request.ClubUpdatePostReq;
import com.ssafy.db.entity.Club;

public interface ClubService {

    Club createClub(ClubRegisterPostReq clubRegisterPostReq);

    void updateClub(ClubUpdatePostReq updateInfo);
}
