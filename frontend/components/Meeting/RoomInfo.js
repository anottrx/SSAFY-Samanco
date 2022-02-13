import { useState } from 'react';

import styled from '@emotion/styled';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Fab,
  Box,
} from '@mui/material';

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';

import Router from 'next/router';

function RoomInfo({
  detail,
  exitClick,
  micOn,
  setMicOn,
  camOn,
  setCamOn,
  handleVideoStateChanged,
  handleAudioStateChanged,
  screenShare,
  shareMonitor,
}) {
  const InfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0px;

    & .names {
      display: inline;
    }

    & .roomTitle {
      font-size: 35px;
      font-weight: bolder;
      margin-right: 10px;
    }

    & .hostName {
    }
  `;

  const OperWrapper = styled.div`
    float: left;
  `;

  const [open, setOpen] = useState(false);

  const exitDialogOpen = () => {
    setOpen(true);
  };
  const exitDialogClose = () => {
    setOpen(false);
  };

  return (
    <InfoWrapper>
      <div className="names">
        <span className="roomTitle">{detail.title}</span>
        <span className="hostName">[방장] {detail.nickname}</span>
        <Stack>
          <span>
            <AccessTimeIcon />
            {detail.startTime}분 / {detail.timeLimit}분
          </span>
        </Stack>
      </div>
      <div>
        <OperWrapper>
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
            {camOn ? (
              <Fab
                color="primary"
                variant="extended"
                aria-label="add"
                onClick={() => {
                  setCamOn(false); // 버튼
                  handleVideoStateChanged();
                  // changeVideo(false); // 상태 변경
                }}
              >
                <VideocamIcon fontSize="large" />
              </Fab>
            ) : (
              <Fab
                variant="extended"
                aria-label="add"
                onClick={() => {
                  setCamOn(true);
                  handleVideoStateChanged();
                  // changeVideo(true);
                }}
              >
                <VideocamOffOutlinedIcon fontSize="large" />
              </Fab>
            )}
            {micOn ? (
              <Fab
                color="primary"
                variant="extended"
                aria-label="edit"
                onClick={() => {
                  setMicOn(false);
                  // changeAudio(false);
                  // publisher.properties.publishVideo = false;
                  handleAudioStateChanged();
                }}
              >
                <MicIcon fontSize="large" />
              </Fab>
            ) : (
              <Fab
                variant="extended"
                aria-label="edit"
                onClick={() => {
                  setMicOn(true);
                  handleAudioStateChanged();
                  // changeAudio(true);

                  // publisher.properties.publishVideo = false;
                }}
              >
                <MicOffOutlinedIcon fontSize="large" />
              </Fab>
            )}
            {/* 화면 공유 */}
            {!screenShare && (
              <Fab variant="extended" aria-label="edit" onClick={shareMonitor}>
                <IosShareIcon fontSize="large" />
              </Fab>
            )}
            <Fab variant="extended" aria-label="edit" onClick={exitDialogOpen}>
              <ExitToAppIcon fontSize="large" />
            </Fab>
          </Box>
        </OperWrapper>
      </div>

      <ExitDialog
        open={open}
        exitDialogClose={exitDialogClose}
        exitClick={exitClick}
        detail={detail}
      ></ExitDialog>
    </InfoWrapper>
  );
}

function ExitDialog(props) {
  let { open, exitDialogClose, detail } = props;
  return (
    <Dialog open={open} onClose={exitDialogClose}>
      {/* {detail.hostId == sessionStorage.getItem('userId') ? (
        <DialogTitle>
          {'방장이 방을 나가면 미팅이 종료됩니다. 그래도 나가시겠습니까?'}
        </DialogTitle>
      ) : (
        <DialogTitle>{'방을 나가시겠습니까?'}</DialogTitle>
      )} */}

      <DialogTitle>{'방을 나가시겠습니까?'}</DialogTitle>
      <DialogActions>
        <Button onClick={exitDialogClose}>취소</Button>
        <Button
          onClick={() => {
            props.exitClick();
          }}
          autoFocus
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoomInfo;
