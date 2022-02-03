import React, {useState, useRef, useEffect,useCallback, useLayoutEffect} from 'react';
import styled from '@emotion/styled';
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, ButtonGroup, Button} from '@mui/material';

import commentDatas from "./data/commentData.json";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

//댓글 목록 페이지
function CommentList(props) {
    let CusTableContainer = styled(TableContainer)`
        padding: 10px;
    `

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

    let CusComment = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 10px;

        & .user-id {
            font-weight: bolder;
            margin-right: 20px;
        }
    `


    return (
        <div>
            <CusTableContainer>
                <Table aria-label="customized table">
                    <TableBody>
                    {comments.map((comment, index) => (
                        <CusComment key={index}>
                            <div>
                                <span className='user-id'>{comment.userId}</span>
                                <span className='comment-content'>{comment.content}</span>
                            </div>
                            <ButtonGroup variant="outlined">
                                <Button><EditIcon /></Button>
                                <Button color="error"><DeleteIcon /></Button>
                            </ButtonGroup>
                        </CusComment>
                    ))}
                    </TableBody>
                </Table>
            </CusTableContainer>
        </div>
    );
}

export default CommentList;