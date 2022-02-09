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
} from '@mui/material';

import Router from 'next/router';

function RoomInfo() {
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
        <span className="roomTitle">방 제목</span>
        <span className="hostName">방장 이름</span>
      </div>
      <Stack>
        <div>
          <AccessTimeIcon />
          10분 / 50분
        </div>
        <Button onClick={exitDialogOpen}>
          <ExitToAppIcon />
          나가기
        </Button>
      </Stack>
      <ExitDialog open={open} exitDialogClose={exitDialogClose}></ExitDialog>
    </InfoWrapper>
  );
}

function ExitDialog(props) {
  let { open, exitDialogClose } = props;
  return (
    <Dialog open={open} onClose={exitDialogClose}>
      <DialogTitle>{'방을 나가시겠습니까?'}</DialogTitle>
      <DialogActions>
        <Button onClick={exitDialogClose}>취소</Button>
        <Button
          onClick={() => {
            // Router.push("/meeting")
            window.close();
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
