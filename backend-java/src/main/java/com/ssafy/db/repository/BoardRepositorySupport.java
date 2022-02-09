package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.BoardUpdateReq;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.QBoard;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public class BoardRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    @Autowired
    ValidRepository valid;

    QBoard qBoard=QBoard.board;

    QUser qUser=QUser.user;

    @Transactional
    public void deleteBoard(Long userId, Long boardId) {
        // isDelete=true

        jpaQueryFactory.update(qBoard).where(
                qBoard.id.eq(boardId),
                        qBoard.userId.eq(userId)
                )
                .set(qBoard.isDeleted, true).execute();
    }

    @Transactional
    public int updateBoard(BoardUpdateReq boardUpdateInfo){

        Long boardId=boardUpdateInfo.getBoardId();
        String content=(boardUpdateInfo.getContent());
        String title=(boardUpdateInfo.getTitle());
//        String startDate=(boardUpdateInfo.getStartDate());
//        String endDate=(boardUpdateInfo.getEndDate());
        jpaQueryFactory.update(qBoard).where(qBoard.id.eq(boardId))
                .set(qBoard.content, content)
                .set(qBoard.title, title)
//                .set(qBoard.startDate, startDate)
//                .set(qBoard.endDate, endDate)
                .execute();

        return 200;
    }

    public List<Board> selectByUser(Long userId) {
        return jpaQueryFactory.selectFrom(qBoard)
                .where(qBoard.userId.eq(userId), qBoard.isDeleted.eq(false)).orderBy(qBoard.id.desc()).fetch();
    }

    @Transactional
    public Board selectBoard(Long boardId, int addHit) {
        Board result = jpaQueryFactory.selectFrom(qBoard)
                .where(qBoard.id.eq(boardId), qBoard.isDeleted.eq(false)).fetchOne();
        if (result==null){
            return null;
        }
        // 조회수 증가
        jpaQueryFactory.update(qBoard).where(qBoard.id.eq(boardId))
                .set(qBoard.hit, qBoard.hit.add(addHit))
                .execute();

        return result;
    }


    public List<Board> selectBoardAll() {
        return jpaQueryFactory.selectFrom(qBoard).where(qBoard.isDeleted.eq(false)).orderBy(qBoard.id.desc()).fetch();
    }


    public List<Board> selectByTitle(String title) {
        return jpaQueryFactory.selectFrom(qBoard)
                .where(qBoard.isDeleted.eq(false), qBoard.title.contains(title)).orderBy(qBoard.id.desc()).fetch();
    }


    public List<Board> selectByTitleTag(String title, String tag) {
        return jpaQueryFactory.selectFrom(qBoard)
                .where(qBoard.isDeleted.eq(false), qBoard.title.contains(title), qBoard.tag.equalsIgnoreCase(tag))
                .orderBy(qBoard.id.desc()).fetch();
    }

    public List<Board> selectBoardAllByTag(String tag) {
        return jpaQueryFactory.selectFrom(qBoard)
                .where(qBoard.isDeleted.eq(false), qBoard.tag.equalsIgnoreCase(tag))
                .orderBy(qBoard.id.desc()).fetch();
    }
}
