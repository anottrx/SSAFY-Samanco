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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Router from 'next/router';
import * as boardActions from '../../store/module/board';
import SearchBar from '../Common/Search';
import style from '@emotion/styled';
import Cookies from 'universal-cookie';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  getArticleById,
  orderArticleByLike,
  getArticleByTag,
} from '../../pages/api/board';

import BoardColor from '../../data/BoardColor.json';

//게시글 목록 페이지

const ItemWrapper = style.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;

    & .MuiSelect-select{
        padding: 12px 32px 12px 14px;
    }
`;

const ProjectActions = style.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

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

function BoardList(props) {
  const dispatch = useDispatch();
  let tag = props.tag;

  let boardData, setDetail, filterData, setArticles, articleTag;

  boardData = useSelector(({ board }) => board.boardList);
  filterData = useSelector(({ board }) => board.boardFilterList);
  // articleTag = useSelector(({ board }) => board.tag);

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
  const [isAll, setIsAll] = useState(false);
  const [isNotice, setIsNotice] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [articleOrder, setArticleOrder] = useState('new');

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

      // return () => {
      //   dispatch(boardActions.setTag({ tag: null }));
      // };
    };
  }, []);

  useLayoutEffect(() => {
    // if (articleDetail.tag) tag = articleDetail.tag;
    // 조회했던 게시물의 태그가 있으면 변경
    // if (articleTag) tag = articleTag;
    // console.log(tag);

    getArticleByTag(tag).then((res) => {
      if (res.boards) setArticles({ list: res.boards });
      else setArticles({ list: [] });
    });

    if (tag === 'notice') setIsNotice(true);
    else if (tag === 'all') setIsAll(true);
    if (sessionStorage.getItem('nickname') === 'admin') setIsAdmin(true);
  }, [tag]);

  useEffect(() => {
    if (articleOrder === 'like') {
      orderArticleByLike(tag).then((res) => {
        if (res.boards) setArticles({ list: res.boards });
        else setArticles({ list: [] });
      });
    } else if (articleOrder === 'new') {
      getArticleByTag(tag).then((res) => {
        if (res.boards) setArticles({ list: res.boards });
        else setArticles({ list: [] });
      });
    }
  }, [articleOrder]);

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
      <ItemWrapper>
        <ProjectActions>
          <SearchBar target="board" tag={tag}></SearchBar>
          {/* {
                        isAll? */}
          <FormControl sx={{ minWidth: 80 }}>
            <Select
              labelId="articleOrder"
              id="articleOrder"
              value={articleOrder}
              onChange={handleOrderChange}
              autoWidth
            >
              <MenuItem value={'new'}>최신순</MenuItem>
              <MenuItem value={'like'}>인기순</MenuItem>
            </Select>
          </FormControl>
          {/* : null
                    } */}
        </ProjectActions>
      </ItemWrapper>
      <TableContainer>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">제목</StyledTableCell>
              <StyledTableCell align="center">닉네임</StyledTableCell>
              <StyledTableCell align="center">작성일</StyledTableCell>
              <StyledTableCell align="center">좋아요</StyledTableCell>
              <StyledTableCell align="center">조회수</StyledTableCell>
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
                if (res.statusCode == 200) {
                  setDetail({ detail: res.board });
                  // dispatch(boardActions.setTag({ tag: res.board.tag }));
                }
                // Router.push(`/board/${data.boardId}`, '/board', {
                //   shallow: true,
                // });
                Router.push('/board/' + data.boardId);
              }); // 조회수 증가
            }}
          >
            <StyledTableCell component="th" scope="row">
              {isAll ? (
                <TagSpan colorinfo={BoardColor[data.tag].color}>
                  [{BoardColor[data.tag].label}]
                </TagSpan>
              ) : null}
              {`${data.title} (${data.comments ? data.comments.length : 0})`}
              {Array.isArray(data.files) && data.files.length !== 0 ? (
                <FileIcon>
                  <AttachFileIcon />
                  첨부파일
                </FileIcon>
              ) : null}
            </StyledTableCell>
            <StyledTableCell align="center">{data.nickname}</StyledTableCell>
            <StyledTableCell align="center">{data.dateOrTime}</StyledTableCell>
            <StyledTableCell align="center">{data.likes}</StyledTableCell>
            <StyledTableCell align="center">{data.hit}</StyledTableCell>
          </StyledTableRow>
        );
      });
  }
}

export default BoardList;
