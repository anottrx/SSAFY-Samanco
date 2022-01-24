import React, {useState, useRef, useEffect,useCallback, useLayoutEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/link";
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Pagination} from '@mui/material';
import Router from "next/router";
import * as boardActions from '../../store/module/board';

import Datas from "./data.js";

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

    const setDetail = useCallback(
        ({detail}) => {
            dispatch(boardActions.setBoardDetail({detail}))
        },
        [dispatch],
    )

    let [articles,setArticles] = useState([]);
    
    useEffect(()=>{
        var articlesArray = [];
        Datas.map((data)=>{
            if(data.tag === props.tag){
                articlesArray.push(data);
            }
        })
        setArticles(articlesArray);
    },[]);


    const [page, setPage] = useState(1);
    const purPage = useRef(10);
    let allPage = parseInt(articles.length / purPage.current);
    if (articles.length % purPage.current > 0) allPage += 1;

    const handleChange = (index,value) => {
        setPage(value);
    };

    const CusPagination = styled(Pagination)`
        margin-top: 20px;
    `;

    return (
        <div>
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
                    {articles.slice(purPage.current * (page-1), purPage.current * page).map((article) => (
                        <StyledTableRow key={article.boardId}>
                        <StyledTableCell component="th" scope="row" onClick={()=>{
                            Router.push("/board/"+article.boardId); setDetail({detail: article}); }}
                        >{article.title}</StyledTableCell>
                        <StyledTableCell align="right">{article.userId}</StyledTableCell>
                        <StyledTableCell align="right">{article.startDate}</StyledTableCell>
                        <StyledTableCell align="right">{article.likes}</StyledTableCell>
                        <StyledTableCell align="right">{article.hit}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
                <CusPagination count={allPage} color="primary" page={page} onChange={handleChange} />
            </TableContainer>
        </div>
    );
}

export default BoardList;