package com.ssafy.api.service;

import com.ssafy.api.model.RoomDto;
import com.ssafy.api.request.RoomRegisterReq;
import com.ssafy.api.request.RoomUpdateReq;
import com.ssafy.common.util.DateUtil;
import com.ssafy.db.entity.*;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    RoomRepositorySupport roomRepositorySupport;

    @Autowired
    ValidRepository valid;

    @Autowired
    CommonRepository commonRepository;

//    @Autowired
//    UserRepositorySupport userRepositorySupport;

    @Override
    public RoomDto createRoom(RoomRegisterReq roomRegisterReq) {
        Room room = new Room();
        String tag=roomRegisterReq.getTag();
        Long hostId=roomRegisterReq.getHostId();
        Long tagId=roomRegisterReq.getTagId();
        User user=commonRepository.selectUser(hostId);
        if (user==null || user.getRoomId()!=0l){
            return null;
        }
        Room oldRoom=roomRepositorySupport.selectRoomByHostId(hostId);
        if (oldRoom!=null){ // 등록한 미팅이 있음
            return null;
        }
        if ("project".equalsIgnoreCase(tag)){
            if (!user.getProjectId().equals(tagId)){
                return null;
            }
        } else if ("study".equalsIgnoreCase(tag)){
            if (commonRepository.selectUserStudy(hostId, tagId)==null){
                return null;
            }
        } else if ("board".equalsIgnoreCase(tag)){
            Board board = commonRepository.selectBoard(tagId);
            if (board==null || !board.getUserId().equals(hostId)){
                return null;
            }
        }

        room.setHostId(hostId);
        room.setTitle(roomRegisterReq.getTitle());
        room.setTag(tag);
        room.setTagId(tagId);
        room.setIsSecret(roomRegisterReq.getIsSecret());
        room.setPassword(roomRegisterReq.getPassword());

        return roomEntityToDto(roomRepository.save(room));
    }

    @Override
    public int updateRoom(RoomUpdateReq updateInfo) {
        Long hostId= updateInfo.getHostId();
        Long roomId= updateInfo.getRoomId();
        if (!valid.isUserValid(hostId)){
            return 402;
        }
        Room room = roomRepositorySupport.selectRoom(roomId);
        if (room==null || !hostId.equals(room.getHostId())){
            return 401;
        }
        return roomRepositorySupport.updateRoom(updateInfo);
    }

    @Override
    public RoomDto selectRoom(Long roomId) {
        Room result=roomRepositorySupport.selectRoom(roomId);
        if (result==null){
            return null;
        }
        RoomDto room=roomEntityToDto(result);

        return room;
    }

    @Override
    public List<RoomDto> selectRoomAll() {
        List<Room> results = roomRepositorySupport.selectRoomAll();
        if (results==null){
            return null;
        }
        List<RoomDto> rooms=new ArrayList<>();
        for (Room result: results) {
            RoomDto room=roomEntityToDto(result);
            if (room==null){
                continue;
            }
            rooms.add(room);
        }

        return rooms;
    }

    @Override
    public RoomDto roomEntityToDto(Room result) {
        Long roomId=result.getId();
        RoomDto roomDto=new RoomDto();
        roomDto.setRoomId(roomId);
        roomDto.setHostId(result.getHostId());
        roomDto.setTitle(result.getTitle());
        roomDto.setTag(result.getTag());
        roomDto.setTagId(result.getTagId());
        roomDto.setPassword(result.getPassword());
        roomDto.setIsSecret(result.getIsSecret());
        roomDto.setRunTime(DateUtil.Runtime(result.getCreatedDate().toString()));
        // 작성자 닉네임
        String nickname = commonRepository.selectUserNickname(result.getHostId());
        if (nickname==null){
            return null;
        }
        roomDto.setNickname(nickname);

        return  roomDto;
    }

    @Override
    public List<RoomDto> selectRoomByTitle(String title) {
        List<Room> results=roomRepositorySupport.selectByTitle(title);
        if (results==null || results.size()==0){
            return null;
        }
        List<RoomDto> rooms=new ArrayList<>();
        for (Room result: results) {
            RoomDto room=roomEntityToDto(result);
            if (room!=null) {
                rooms.add(room);
            }
        }

        return rooms;

    }
}
