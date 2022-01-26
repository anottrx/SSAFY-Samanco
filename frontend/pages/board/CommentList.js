import React, {useState, useRef, useEffect,useCallback, useLayoutEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Link from "next/link";
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, ButtonGroup, Button} from '@mui/material';
import Router from "next/router";
import * as boardActions from '../../store/module/board';

import commentDatas from "./commentData.json";

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

function CommentList(props) {


    let [comments,setComments] = useState([]);
    
    useEffect(()=>{
        var commentsArray = [];
        commentDatas.map((data)=>{
            if(props.detail.boardId === data.boardId){
                commentsArray.push(data);
            }
        })
        setComments(commentsArray);
    },[]);


    return (
        <div>
            <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>댓글</StyledTableCell>
                        <StyledTableCell align="right">아이디</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {comments.map((comment) => (
                        <StyledTableRow key={comment.content}>
                        <StyledTableCell>{comment.content}</StyledTableCell>
                        <StyledTableCell align="right">{comment.userId}</StyledTableCell>
                        <StyledTableCell align="right">
                            <ButtonGroup variant="outlined">
                                <Button>수정</Button>
                                <Button color="error">삭제</Button>
                            </ButtonGroup>
                        </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default CommentList;