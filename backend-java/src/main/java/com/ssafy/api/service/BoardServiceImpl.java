package com.ssafy.api.service;

import com.ssafy.api.model.CommentDto;
import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.BoardDto;
import com.ssafy.api.request.BoardRegisterReq;
import com.ssafy.api.request.BoardUpdateReq;
import com.ssafy.common.util.DateUtil;
import com.ssafy.db.entity.*;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    BoardRepository boardRepository;

    @Autowired
    BoardRepositorySupport boardRepositorySupport;

    @Autowired
    FileRepositorySupport fileRepositorySupport;

    @Autowired
    ValidRepository valid;

    @Autowired
    UserLikeRepositorySupport userLikeRepositorySupport;

    @Autowired
    CommonRepository commonRepository;

    @Autowired
    CommentService commentService;

    @Autowired
    RoomRepositorySupport roomRepositorySupport;

//    @Autowired
//    UserRepositorySupport userRepositorySupport;

    @Override
    public Board createBoard(BoardRegisterReq boardRegisterReq) {
        Board board = new Board();
        board.setUserId(boardRegisterReq.getUserId());
        board.setContent(boardRegisterReq.getContent());
        board.setTitle(boardRegisterReq.getTitle());
        board.setTag(boardRegisterReq.getTag());
        return boardRepository.save(board);
    }

    @Override
    public int updateBoard(BoardUpdateReq updateInfo) {
        Long userId=updateInfo.getUserId();
        Long boardId=updateInfo.getBoardId();
        if (!valid.isUserValid(userId)){
            return 402;
        }
        if (!valid.isBoardValid(boardId)) {
            return 401;
        }
        Board board = boardRepositorySupport.selectBoard(boardId, 0);
        if (board==null || !userId.equals(board.getUserId())){
            return 402;
        }
        return boardRepositorySupport.updateBoard(updateInfo);
    }

    @Override
    public int deleteBoard(Long userId, Long boardId) {
        boardRepositorySupport.deleteBoard(userId, boardId);
        fileRepositorySupport.deleteFile(boardId, "board");
        return 200;
    }

    @Override
    public BoardDto selectBoard(Long userId, Long boardId, int addHit) {
        Board result=boardRepositorySupport.selectBoard(boardId, addHit);
        if (result==null){
            return null;
        }
        BoardDto board=boardEntityToDto(result);
        board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
        UserLike userLike = userLikeRepositorySupport.userLike(userId, boardId, "board");

        if (board.getUserId().equals(userId)){     // 게시글 작성자면 방 생성 가능
            board.setCanRegister(true);
        } else{     // 게시글 방이 만들어져있으면 누구나 참여 가능
            Room room = roomRepositorySupport.selectRoomByTagId(boardId, "board");
            if (room!=null){
                board.setCanJoin(true);
                board.setRoomId(room.getId());
            }
        }
        if (userLike!=null) {
            board.setUserLike(true);
        }

        return board;
    }

    @Override
    public List<BoardDto> selectByUser(Long userId) {
        List<Board> results = boardRepositorySupport.selectByUser(userId);
        if (results==null || results.size()==0){
            return null;
        }
        List<BoardDto> boards=new ArrayList<>();
        for (Board result: results) {
            BoardDto board=boardEntityToDto(result);
            if (board==null){
                continue;
            }
            Long boardId=board.getBoardId();
            board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
            boards.add(board);
        }

        return boards;
    }

    @Override
    public List<BoardDto> selectBoardAll() {
        List<Board> results = boardRepositorySupport.selectBoardAll();
        if (results==null || results.size()==0){
            return null;
        }
        List<BoardDto> boards=new ArrayList<>();
        for (Board result: results) {
            BoardDto board=boardEntityToDto(result);
            if (board==null){
                continue;
            }
            Long boardId=board.getBoardId();
            board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
            boards.add(board);
        }

        return boards;
    }

    @Override
    public List<BoardDto> selectBoardAllByTag(String tag) {
        List<Board> results = boardRepositorySupport.selectBoardAllByTag(tag);
        if (results==null || results.size()==0){
            return null;
        }
        List<BoardDto> boards=new ArrayList<>();
        for (Board result: results) {
            BoardDto board=boardEntityToDto(result);
            if (board==null){
                continue;
            }
            Long boardId=board.getBoardId();
            board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
            boards.add(board);
        }

        return boards;
    }

    @Override
    public BoardDto boardEntityToDto(Board result) {
        // like
        int likes=userLikeRepositorySupport.countUserLikeByTarget(result.getId(), "board");

        BoardDto boardDto=new BoardDto();
        boardDto.setBoardId(result.getId());
        boardDto.setContent(result.getContent());
        boardDto.setUserId(result.getUserId());
        boardDto.setHit(result.getHit());
        boardDto.setTitle(result.getTitle());
        boardDto.setLikes(likes);
        boardDto.setTag(result.getTag());

        List<CommentDto> comments = commentService.selectBoardCommentAll(result.getId());
        boardDto.setComments(comments);

        // 작성자 닉네임
        String nickname = commonRepository.selectUserNickname(result.getUserId());
        if (nickname==null){
            return null;
        }
        boardDto.setNickname(nickname);

        // 작성 시간
        String createdDate=result.getCreatedDate().toString();
        boardDto.setDateOrTime(DateUtil.DateOrTime(createdDate));
        boardDto.setDateAndTime(DateUtil.DateAndTime(createdDate));

        return  boardDto;
    }

    @Override
    public List<BoardDto> selectBoardByTitle(String title) {
        List<Board> results=boardRepositorySupport.selectByTitle(title);
        if (results==null || results.size()==0){
            return null;
        }
        List<BoardDto> boards=new ArrayList<>();
        for (Board result: results) {
            BoardDto board=boardEntityToDto(result);
            if (board==null){
                continue;
            }
            Long boardId=board.getBoardId();
            board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
            boards.add(board);
        }

        return boards;

    }

    @Override
    public List<BoardDto> selectBoardByTitleTag(String title, String tag) {

        List<Board> results=boardRepositorySupport.selectByTitleTag(title, tag);
        if (results==null || results.size()==0){
            return null;
        }
        List<BoardDto> boards=new ArrayList<>();
        for (Board result: results) {
            BoardDto board=boardEntityToDto(result);
            if (board==null){
                continue;
            }
            Long boardId=board.getBoardId();
            board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
            boards.add(board);
        }

        return boards;
    }

    @Override
    public List<BoardDto> selectBoardLikeOrder() {
        List<Board> results=boardRepositorySupport.selectBoardAll();
        if (results==null || results.size()==0){
            return null;
        }
        List<BoardDto> boards=new ArrayList<>();
        for (Board result: results) {
            BoardDto board=boardEntityToDto(result);
            if (board==null){
                continue;
            }
            Long boardId=board.getBoardId();
            board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
            boards.add(board);
        }
        Collections.sort(boards, new Comparator<BoardDto>() {
            @Override
            public int compare(BoardDto o1, BoardDto o2) {
                return (int) (o2.getLikes()-o1.getLikes());
            }
        });

        return boards;
    }

    @Override
    public List<BoardDto> selectBoardLikeOrderTag(String tag) {
        List<Board> results=boardRepositorySupport.selectBoardAllByTag(tag);
        if (results==null || results.size()==0){
            return null;
        }
        List<BoardDto> boards=new ArrayList<>();
        for (Board result: results) {
            BoardDto board=boardEntityToDto(result);
            if (board==null){
                continue;
            }
            Long boardId=board.getBoardId();
            board.setFiles(fileRepositorySupport.selectFiles(boardId, "board"));
            boards.add(board);
        }
        Collections.sort(boards, new Comparator<BoardDto>() {
            @Override
            public int compare(BoardDto o1, BoardDto o2) {
                return (int) (o2.getLikes()-o1.getLikes());
            }
        });

        return boards;
    }


}
