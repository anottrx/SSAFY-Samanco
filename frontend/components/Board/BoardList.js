import React, {useState, useRef, useEffect,useCallback, useLayoutEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Pagination, Button} from '@mui/material';
import Router from "next/router";
import * as boardActions from '../../store/module/board';
import SearchBar from "../Common/Search";
import style from "@emotion/styled";
import Cookies from "universal-cookie";

import AttachFileIcon from '@mui/icons-material/AttachFile';

import { getArticleByTag } from "../../pages/api/board";

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
    let tag = props.tag;
    
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
    const [isNotice, setIsNotice] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(()=>{
        if (cookies.get("userToken")!='' && sessionStorage.getItem("nickname") != null) {
            setIsLogin(true);
        }
    },[]);
    
    useLayoutEffect(() => {
        // To do: tag 바뀔 때마다 태그로 리스트 불러오기
        // /api/board/tag/{tag}
        getArticleByTag(tag).then((res => {
            if (res.boards)
                setArticles({list: res.boards});
            else
                setArticles({list: []});
        }));

        if (tag === "notice") setIsNotice(true);
        if (sessionStorage.getItem("nickname") === "admin") setIsAdmin(true);
    }, [tag])

    async function viewBoard(e) {
        let title = e.target.value;
        console.log(title)
        getArticleByTitle(title).then((res => {
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

    const FileIcon = style.span`
        margin: 0px 10px 0px 20px;
        color: gray;
    `

    return (
        <>
            <ItemWrapper>
                <ProjectActions>
                    <SearchBar target="board"></SearchBar>
                    {
                        isLogin? 
                            !isNotice || (isNotice && isAdmin)?
                            <CusButton variant="outlined" size="medium"
                                onClick={() => {
                                Router.push("/board/regist");
                                }}>
                                등록하기
                            </CusButton>
                            :
                            null
                        :
                        null
                    }
                    
                </ProjectActions>
            </ItemWrapper>
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
                        {
                            !boardData || boardData.length === 0 ?
                            <StyledTableRow>
                                <StyledTableCell>
                                    등록된 게시물이 없습니다.
                                </StyledTableCell>
                            </StyledTableRow>
                            :
                            <>
                            {
                                filterData!==null?
                                filterData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                                    return(
                                    <StyledTableRow key={data.boardId} style={{cursor: "pointer"}}
                                        onClick={()=>{
                                            setDetail({detail: data}); 
                                            Router.push("/board/"+data.boardId); 
                                        }}>
                                        <StyledTableCell component="th" scope="row">
                                        {`${data.title} (${data.comments.length})`}
                                        {
                                            Array.isArray(data.files) && data.files.length !== 0?
                                            <FileIcon><AttachFileIcon />첨부파일</FileIcon>
                                            : null
                                        }
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{data.nickname}</StyledTableCell>
                                        <StyledTableCell align="right">{data.dateOrTime}</StyledTableCell>
                                        <StyledTableCell align="right">{data.likes}</StyledTableCell>
                                        <StyledTableCell align="right">{data.hit}</StyledTableCell>
                                    </StyledTableRow>
                                    )
                                })
                                :
                                boardData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                                    return (
                                    <StyledTableRow key={data.boardId} style={{cursor: "pointer"}}
                                        onClick={()=>{
                                            setDetail({detail: data}); 
                                            Router.push("/board/"+data.boardId); 
                                        }}>
                                        <StyledTableCell component="th" scope="row">
                                            {`${data.title} (${data.comments? data.comments.length: 0})`}
                                            {
                                                Array.isArray(data.files) && data.files.length !== 0?
                                                <FileIcon><AttachFileIcon />첨부파일</FileIcon>
                                                : null
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{data.nickname}</StyledTableCell>
                                        <StyledTableCell align="right">{data.dateOrTime}</StyledTableCell>
                                        <StyledTableCell align="right">{data.likes}</StyledTableCell>
                                        <StyledTableCell align="right">{data.hit}</StyledTableCell>
                                    </StyledTableRow>
                                )})
                            }
                            </>
                        }
                    </TableBody>
                </Table>
                <CusPagination count={allPage} color="primary" page={page} onChange={handleChange} />
            </TableContainer>
        </>
    );
}

export default BoardList;