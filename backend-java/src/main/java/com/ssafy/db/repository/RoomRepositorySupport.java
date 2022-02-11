package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.RoomUpdateReq;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.QRoom;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public class RoomRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    @Autowired
    ValidRepository valid;

    QRoom qRoom=QRoom.room;

    QUser qUser=QUser.user;

    @Transactional
    public void deleteRoom(Long roomId) {
        // isDelete=true

        jpaQueryFactory.update(qRoom)
                .where(qRoom.id.eq(roomId))
                .set(qRoom.isDeleted, true).execute();
    }

    @Transactional
    public int updateRoom(RoomUpdateReq roomUpdateInfo){

        Long roomId=roomUpdateInfo.getRoomId();
        jpaQueryFactory.update(qRoom).where(qRoom.id.eq(roomId))
                .set(qRoom.title, roomUpdateInfo.getTitle())
                .set(qRoom.isSecret, roomUpdateInfo.getIsSecret())
                .set(qRoom.password, roomUpdateInfo.getPassword())
                .execute();

        return 200;
    }

//    public Room selectByUser(Long userId) {
//        return jpaQueryFactory.selectFrom(qRoom)
//                .where(qRoom.us.eq(userId), qRoom.isDeleted.eq(false)).orderBy(qRoom.id.desc()).fetchOne();
//    }

    @Transactional
    public Room selectRoom(Long roomId) {
        Room result = jpaQueryFactory.selectFrom(qRoom)
                .where(qRoom.id.eq(roomId), qRoom.isDeleted.eq(false)).fetchOne();
        if (result==null){
            return null;
        }
        return result;
    }


    public List<Room> selectRoomAll() {
        return jpaQueryFactory.selectFrom(qRoom).where(qRoom.isDeleted.eq(false)).orderBy(qRoom.id.desc()).fetch();
    }


    public List<Room> selectByTitle(String title) {
        return jpaQueryFactory.selectFrom(qRoom)
                .where(qRoom.isDeleted.eq(false), qRoom.title.contains(title)).orderBy(qRoom.id.desc()).fetch();

    }

    public Room selectRoomByTagId(Long tagId, String tag) {
        return jpaQueryFactory.selectFrom(qRoom)
                .where(qRoom.tagId.eq(tagId), qRoom.tag.equalsIgnoreCase(tag), qRoom.isDeleted.eq(false))
                .fetchOne();
    }

//    public List<User> selectRoomUsers(Long roomId) {
//        if (!valid.isRoomValid(roomId)){
//            return null;
//        }
//        return jpaQueryFactory.selectFrom(qUser)
//                .where(qUser.roomId.eq(roomId), qUser.isDeleted.eq(false))
//                .fetch();
//    }

}
