package com.ssafy.api.service;

import com.ssafy.api.model.BoardDto;
import com.ssafy.api.request.BoardRegisterReq;
import com.ssafy.api.request.BoardUpdateReq;
import com.ssafy.db.entity.Board;

import java.util.List;

public interface BoardService {

    Board createBoard(BoardRegisterReq boardRegisterReq);

    int updateBoard(BoardUpdateReq updateInfo);

    int deleteBoard(Long userId, Long boardId);

    BoardDto selectBoard(Long userId, Long boardId);

    List<BoardDto> selectByUser(Long userId);
    List<BoardDto> selectBoardAll();
    BoardDto boardEntityToDto(Board entity);

    List<BoardDto> selectBoardByTitle(String title);

    List<BoardDto> selectBoardLikeOrder();

    List<BoardDto> selectBoardByTag(String tag);
}
