import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {ButtonGroup, Button, TextField} from '@mui/material';

import commentDatas from "./data/commentData.json";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

//댓글 목록 페이지
function CommentList(props) {
    let CommentWrapper = styled.div`
        padding: 10px;
    `

    let [comments,setComments] = useState([]);

    let [editStatus, setEditStatus] = useState(false);
    let [editComment, setEditComment] = useState({});
    
    const handleCommentChange = (name, value) => {
        editComment[name] = value;
        // let newComment = {...editComment, "content": e.target.value}
        // setEditComment(newComment);
      };

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

    let CusTextField = styled(TextField)`
        width: calc(100% - 100px);
        margin-right: 15px;

    `


    return (
        <CommentWrapper>
            {comments.map((data, index) => {
                return (
                <CusComment key={index}>
                    <div style={{width: "100%"}}>
                        <span className='user-id'>{data.userId}</span>
                        {
                            editStatus && editComment.commentId === data.commentId?
                            <CusTextField size="small"
                                value={editComment.content} 
                                onChange={(e) => {
                                    e.persist();
                                    console.log(e.target.value);
                                    handleCommentChange("content", e.target.value)
                                }}></CusTextField>
                            :
                            <span className='comment-content'>{data.content}</span>
                        }
                    </div>
                    
                    {/* 편집 모드일 때 */}
                    {
                        editStatus?
                         editComment.commentId !== data.commentId?
                            <ButtonGroup variant="outlined">
                                <Button onClick={() => {
                                    setEditStatus(true);
                                    setEditComment(data);
                                }}><EditIcon /></Button>
                                <Button color="error"><DeleteIcon /></Button>
                            </ButtonGroup>
                            :
                            <ButtonGroup variant="outlined">
                                <Button onClick={() => {
                                    setEditStatus(false);
                                    setEditComment(null);
                                }}><EditIcon /></Button>
                                <Button color="error"><DeleteIcon /></Button>
                            </ButtonGroup>
                        :
                        <ButtonGroup variant="outlined">
                            <Button onClick={() => {
                                setEditStatus(true);
                                setEditComment({...data});
                            }}><EditIcon /></Button>
                            <Button color="error"><DeleteIcon /></Button>
                        </ButtonGroup>
                    }
                </CusComment>
            )})}
        </CommentWrapper>
    );
}

export default CommentList;