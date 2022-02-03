import React, {useState, useRef, useEffect,useCallback, useLayoutEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Pagination, Button} from '@mui/material';
import Router from "next/router";
import * as boardActions from '../../store/module/board';
import BoardSearch from "./BoardSearch";
import style from "@emotion/styled";
import Cookies from "universal-cookie";

import {getBoardListAPI, viewBoardAPI} from "../api/board";

import Datas from "./data/boardData.json"; //임의 데이터

//게시글 목록 페이지

const ItemWrapper = style.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
`
const ProjectActions = style.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const CusButton = style(Button)`
    height: fit-content;
`

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#A2C2DC",
        color: theme.palette.common.black,
        fontFamily: "Pretendard-Regular",
        fontSize: 15
    },
    [`&.${tableCellClasses.body}`]: {
        fontFamily: "Pretendard-Regular",
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

    let boardData, setDetail, filterData, setArticles;

    boardData = useSelector(({ board }) => board.boardList);
    filterData = useSelector(({ board }) => board.boardFilterList);

   setDetail = useCallback(
        ({detail}) => {
            dispatch(boardActions.setBoardDetail({detail}))
        },
        [dispatch],
    )

    setArticles = useCallback(
        ({list}) => {
            dispatch(boardActions.setBoardList({list}))
        },
        [dispatch],
    )

    const cookies = new Cookies();
    const [isLogin, setIsLogin] = useState(false);


    useEffect(()=>{
        if (cookies.get("userToken")!='' && sessionStorage.getItem("nickname") != null) {
            setIsLogin(true);
        }
    },[]);

    
    useLayoutEffect(() => {
        // 빈 배열이면 배열 요청
        getBoardListAPI().then((res => {
            if (res.boards)
                setArticles({list: res.boards});
            else
                setArticles({list: []});
        }));
    }, [])

    async function viewBoard(e) {
        let title = e.target.value;
        console.log(title)
        viewBoardAPI(title).then((res => {
            setDetail({detail: res.board});
            Router.push({
                pathname: `/${title}`,
                query: { id: data.id }
            })
        }));
    }

    const [page, setPage] = useState(1);
    const purPage = useRef(10);
    let allPage = 1;
    
    if (boardData) {
        allPage = parseInt(boardData.length / purPage.current);
        if (boardData.length % purPage.current > 0) allPage += 1;
    }

    const handleChange = (index,value) => {
        setPage(value);
    };

    const CusPagination = styled(Pagination)`
        display : flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    `;

    return (
        <>
            <ItemWrapper>
                <ProjectActions>
                    <BoardSearch></BoardSearch>
                    {isLogin? 
                    (<CusButton variant="outlined" size="medium"
                        onClick={() => {
                        Router.push("/board/BoardRegist");
                        }}>
                        등록하기
                    </CusButton>):(<></>)}
                    
                </ProjectActions>
            </ItemWrapper>
            <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>제목</StyledTableCell>
                        <StyledTableCell align="right">아이디</StyledTableCell>
                        <StyledTableCell align="right">날짜</StyledTableCell>
                        <StyledTableCell align="right">좋아요</StyledTableCell>
                        <StyledTableCell align="right">조회수</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            boardData && typeof(filterData)=="undefined"?
                            boardData.slice(purPage.current * (page-1), purPage.current * page).map((data) => (
                                <StyledTableRow key={data.boardId}>
                                <StyledTableCell component="th" scope="row" onClick={()=>{
                                    Router.push("/board/"+data.title); setDetail({detail: data}); }}
                                >{data.title}</StyledTableCell>
                                <StyledTableCell align="right">{data.userId}</StyledTableCell>
                                <StyledTableCell align="right">{data.startDate}</StyledTableCell>
                                <StyledTableCell align="right">{data.likes}</StyledTableCell>
                                <StyledTableCell align="right">{data.hit}</StyledTableCell>
                                </StyledTableRow>
                            ))
                            :
                            <StyledTableRow>
                                <StyledTableCell>
                                    등록된 게시물이 없습니다.
                                </StyledTableCell>
                            </StyledTableRow>
                        }
                        {
                            typeof(filterData)!=="undefined"? 
                            filterData.slice(purPage.current * (page-1), purPage.current * page).map((data) => (
                                <StyledTableRow key={data.boardId}>
                                <StyledTableCell component="th" scope="row" onClick={()=>{
                                    Router.push("/board/"+data.title); setDetail({detail: data}); }}
                                >{data.title}</StyledTableCell>
                                <StyledTableCell align="right">{data.userId}</StyledTableCell>
                                <StyledTableCell align="right">{data.startDate}</StyledTableCell>
                                <StyledTableCell align="right">{data.likes}</StyledTableCell>
                                <StyledTableCell align="right">{data.hit}</StyledTableCell>
                                </StyledTableRow>
                            ))
                            :
                            <StyledTableRow>
                                <StyledTableCell>
                                    등록된 게시물이 없습니다.
                                </StyledTableCell>
                            </StyledTableRow>
                        }
                    </TableBody>
                </Table>
                <CusPagination count={allPage} color="primary" page={page} onChange={handleChange} />
            </TableContainer>
        </>
    );
}

export default BoardList;