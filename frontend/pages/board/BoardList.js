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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
},
[`&.${tableCellClasses.body}`]: {
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

    let boardData, setDetail, filterData, setList;

    boardData = useSelector(({ board }) => board.boardList);
    filterData = useSelector(({ board }) => board.boardFilterList);
    console.log(filterData)

   setDetail = useCallback(
        ({detail}) => {
            dispatch(boardActions.setBoardDetail({detail}))
        },
        [dispatch],
    )

    setList = useCallback(
        ({list}) => {
            dispatch(boardActions.setBoardList({list}))
        },
        [dispatch],
    )

    const cookies = new Cookies();
    const [isLogin, setIsLogin] = useState(false);
    let [articles,setBoardList] = useState([]);


    useEffect(()=>{
        if (cookies.get("userToken")!='' && sessionStorage.getItem("nickname") != null) {
            setIsLogin(true);
        }

        // var articlesArray = [];
        // Datas.map((data)=>{
        //     if(data.tag === props.tag){
        //         articlesArray.push(data);
        //     }
        // })
        // setArticles(articlesArray);
    },[]);

    
    useLayoutEffect(() => {
        // 빈 배열이면 배열 요청
        getBoardListAPI().then((res => {
            console.log(res.boards); 
            setList({list: res.boards});
        }));
        // if (props.from === "project") {
        //     getProjectAllAPI().then(res => setList({list: res.projects}));
        // } else if (props.from === "study") {
        //     getProjectAllAPI().then(res => setList({list: res.projects}));
        // }
    }, [])

    async function viewBoard(e) {
        let title = e.target.value;
        console.log(title)
        viewBoardAPI(title).then((res => {
            setDetail({detail: res.board});
            // api 작성
            Router.push({
                pathname: `/${title}`,
                query: { id: data.id }
            })
        }));
    }

    const [page, setPage] = useState(1);
    const purPage = useRef(10);
    let allPage = parseInt(articles.length / purPage.current);
    if (articles.length % purPage.current > 0) allPage += 1;

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
        <div>
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
                        {filterData!=null? 
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
                        }
                    </TableBody>
                </Table>
                <CusPagination count={allPage} color="primary" page={page} onChange={handleChange} />
            </TableContainer>
        </div>
    );
}

export default BoardList;