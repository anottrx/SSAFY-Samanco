import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';

import Router from 'next/router';
import * as boardActions from '../../store/module/board';
import style from '@emotion/styled';
import Cookies from 'universal-cookie';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getArticleById, getArticleByUserId } from '../../pages/api/board';
import BoardColor from '../../data/BoardColor.json';

//내 게시글 목록 페이지

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#A2C2DC',
    color: theme.palette.common.black,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function MyBoardList(props) {
  const dispatch = useDispatch();
  let tag = props.tag;

  let boardData, setDetail, filterData, setArticles;

  boardData = useSelector(({ board }) => board.boardList);
  filterData = useSelector(({ board }) => board.boardFilterList);

  setDetail = useCallback(
    ({ detail }) => {
      dispatch(boardActions.setBoardDetail({ detail }));
    },
    [dispatch]
  );

  setArticles = useCallback(
    ({ list }) => {
      dispatch(boardActions.setBoardList({ list }));
    },
    [dispatch]
  );

  const cookies = new Cookies();
  const [isLogin, setIsLogin] = useState(false);
  const [isMyList, setIsMyList] = useState(false);

  // const [tagInfo, setTagInfo] = useState({});

  useEffect(() => {
    if (
      cookies.get('userToken') != '' &&
      sessionStorage.getItem('nickname') != null
    ) {
      setIsLogin(true);
    }
    return () => {
      dispatch(boardActions.setBoardFilterList({ list: null }));
    };
  }, []);
  useLayoutEffect(() => {
    if (tag === 'mylist') {
      setIsMyList(true);
      getArticleByUserId(sessionStorage.getItem('userId')).then((res) => {
        if (res.boards) setArticles({ list: res.boards });
        else setArticles({ list: [] });
      });
    }
  }, [tag]);

  useEffect(() => {
    getArticleByUserId(sessionStorage.getItem('userId')).then((res) => {
      if (res.boards) setArticles({ list: res.boards });
      else setArticles({ list: [] });
    });
  }, []);

  const [page, setPage] = useState(1);
  const purPage = useRef(10);
  let allPage = 1;

  if (boardData) {
    allPage = parseInt(boardData.length / purPage.current);
    if (boardData.length % purPage.current > 0) allPage += 1;
  }

  const handleChange = (index, value) => {
    setPage(value);
  };

  const handleOrderChange = (e) => {
    setArticleOrder(e.target.value);
  };

  const CusPagination = styled(Pagination)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  `;

  const FileIcon = style.span`
          margin: 0px 10px 0px 20px;
          color: gray;
      `;
  
  const TagSpan = style.span`
      margin-right: 10px;
      padding: 0;
      font-weight: bolder;
      ${({ colorinfo }) => colorinfo && `color: #${colorinfo}`}
  `;

  return (
    <>
      <TableContainer>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>제목</StyledTableCell>
              <StyledTableCell align="right">닉네임</StyledTableCell>
              <StyledTableCell align="right">작성일</StyledTableCell>
              <StyledTableCell align="right">좋아요</StyledTableCell>
              <StyledTableCell align="right">조회수</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!boardData || boardData.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell>등록된 게시물이 없습니다.</StyledTableCell>
              </StyledTableRow>
            ) : (
              <>
                {typeof filterData !== 'undefined' && filterData !== null ? (
                  <Articles article={filterData}></Articles>
                ) : (
                  <Articles article={boardData}></Articles>
                )}
              </>
            )}
          </TableBody>
        </Table>
        <CusPagination
          count={allPage}
          color="primary"
          page={page}
          onChange={handleChange}
        />
      </TableContainer>
    </>
  );

  function Articles({ article }) {
    return article
      .slice(purPage.current * (page - 1), purPage.current * page)
      .map((data) => {
        return (
          <StyledTableRow
            key={data.boardId}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              getArticleById({
                boardId: data.boardId,
                userId:
                  sessionStorage.getItem('userId') == null
                    ? 0
                    : sessionStorage.getItem('userId'),
                addHit: '1',
              }).then((res) => {
                if (res.statusCode == 200) setDetail({ detail: res.board });
                Router.push('/board/' + data.boardId);
              }); // 조회수 증가
            }}
          >
            <StyledTableCell component="th" scope="row">
              <TagSpan colorinfo={BoardColor[data.tag].color}>
                  [{BoardColor[data.tag].label}]
              </TagSpan>
              {`${data.title} (${data.comments ? data.comments.length : 0})`}
              {Array.isArray(data.files) && data.files.length !== 0 ? (
                <FileIcon>
                  <AttachFileIcon />
                  첨부파일
                </FileIcon>
              ) : null}
            </StyledTableCell>
            <StyledTableCell align="right">{data.nickname}</StyledTableCell>
            <StyledTableCell align="right">{data.dateOrTime}</StyledTableCell>
            <StyledTableCell align="right">{data.likes}</StyledTableCell>
            <StyledTableCell align="right">{data.hit}</StyledTableCell>
          </StyledTableRow>
        );
      });
  }
}

export default MyBoardList;
