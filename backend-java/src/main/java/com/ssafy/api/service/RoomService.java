package com.ssafy.api.service;

import com.ssafy.api.model.RoomDto;
import com.ssafy.api.request.RoomRegisterReq;
import com.ssafy.api.request.RoomUpdateReq;
import com.ssafy.db.entity.Room;

import java.util.List;

public interface RoomService {

    RoomDto createRoom(RoomRegisterReq roomRegisterReq);
    int updateRoom(RoomUpdateReq updateInfo);
//    int deleteRoom(Long userId, Long roomId);
    RoomDto selectRoom(Long roomId);
//    List<RoomDto> selectByUser(Long userId);
    List<RoomDto> selectRoomAll();
    RoomDto roomEntityToDto(Room entity);
    List<RoomDto> selectRoomByTitle(String title);
}
