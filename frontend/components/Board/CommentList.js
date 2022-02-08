import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  ButtonGroup,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { updateComment, deleteComment } from '../../pages/api/board';
import forceReload from '../../util/ForceReload';

//댓글 목록 페이지
function CommentList({ detail }) {
  let CommentWrapper = styled.div`
    padding: 10px;
  `;

  let [comments, setComments] = useState([]);

  let [editStatus, setEditStatus] = useState(false);
  let [targetComment, setTargetComment] = useState({});
  let [editComment, setEditComment] = useState({});

  const handleCommentChange = (name, value) => {
    editComment[name] = value;
  };

  useEffect(() => {
    var commentsArray = [];

    detail.comments.map((data) => {
      if (detail.boardId === data.boardId) {
        commentsArray.push(data);
      }
    });
    setComments(commentsArray);
  }, []);

  let CusComment = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;

    & .user-id {
      font-weight: bolder;
      margin-right: 20px;
    }

    & .comment-time {
      color: gray;
      font-size: 14px;
      margin: 0px 20px;
    }

    & Button {
      padding: 0;
    }
  `;

  let CusUpdateWrapper = styled.div`
    display: flex;
    flex-direction: row;
  `;

  let CusTextField = styled(TextField)`
    width: inherit;
    margin-right: 15px;
    flex: 1;
  `;

  function updateRequest() {
    updateComment({
      boardId: detail.boardId,
      commentId: targetComment.commentId,
      content: editComment.content,
      userId:
        sessionStorage.getItem('userId') == null
          ? 0
          : sessionStorage.getItem('userId'),
    }).then((res) => {
      if (res.statusCode === 200) {
        alert('댓글이 수정되었습니다.');
        forceReload();
      } else {
        alert(`${res.message}`);
      }
    });
  }

  return (
    <CommentWrapper>
      {comments.map((data, index) => {
        return (
          <CusComment key={index}>
            <div style={{ width: '100%' }}>
              <span className="user-id">{data.nickname}</span>
              {
                // 댓글 수정 클릭 시, 댓글 내용 -> 입력창, 버튼 모양 변경
                editStatus && targetComment.commentId === data.commentId ? (
                  <CusUpdateWrapper>
                    <CusTextField
                      size="small"
                      defaultValue={targetComment.content}
                      value={editComment.content}
                      onChange={(e) => {
                        handleCommentChange('content', e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateRequest();
                        }
                      }}
                    ></CusTextField>
                    <ButtonGroup variant="outlined">
                      <Button
                        onClick={() => {
                          setEditStatus(false);
                          setEditComment({});
                          setTargetComment({});
                          updateRequest();
                        }}
                      >
                        <CheckIcon />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => {
                          setEditStatus(false);
                        }}
                      >
                        <ClearIcon />
                      </Button>
                    </ButtonGroup>
                  </CusUpdateWrapper>
                ) : (
                  <span className="comment-content">{data.content}</span>
                )
              }
              <span className="comment-time">{data.dateOrTime}</span>
            </div>

            {editStatus && data.userId === sessionStorage.getItem('userId') ? (
              targetComment.commentId === data.commentId ? (
                <CommentOperation data={data} />
              ) : null
            ) : (
              <CommentOperation data={data} />
            )}
          </CusComment>
        );
      })}
    </CommentWrapper>
  );

  function CommentOperation({ data }) {
    const [open, setOpen] = useState(false);

    const DeleteDialogOpen = () => {
      setOpen(true);
    };
    const DeleteDialogClose = () => {
      setOpen(false);
    };

    return data.userId == sessionStorage.getItem('userId') ? (
      <>
        <ButtonGroup variant="outlined">
          <Button
            onClick={() => {
              setEditStatus(false);
              setEditComment({});
              setTargetComment({});

              setEditStatus(true);
              setTargetComment(data);
            }}
          >
            <EditIcon />
          </Button>
          <Button
            color="error"
            onClick={() => {
              DeleteDialogOpen();
            }}
          >
            <DeleteIcon />
          </Button>
        </ButtonGroup>
        <DeleteDialog
          open={open}
          DeleteDialogClose={DeleteDialogClose}
          commentId={data.commentId}
        />
      </>
    ) : null;
  }

  function DeleteDialog({ open, DeleteDialogClose, commentId }) {
    return (
      <Dialog open={open} onClose={DeleteDialogClose}>
        <DialogTitle>{'삭제 하시겠습니까?'}</DialogTitle>
        <DialogActions>
          <Button onClick={DeleteDialogClose}>취소</Button>
          <Button
            onClick={() => {
              DeleteDialogClose();
              deleteComment({
                commentId: commentId,
                userId:
                  sessionStorage.getItem('userId') == null
                    ? 0
                    : sessionStorage.getItem('userId'),
              }).then((res) => {
                if (res.statusCode === 200) {
                  alert('댓글이 삭제되었습니다.');
                  forceReload();
                } else {
                  alert(`${res.message}`);
                }
              });
            }}
            autoFocus
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CommentList;
