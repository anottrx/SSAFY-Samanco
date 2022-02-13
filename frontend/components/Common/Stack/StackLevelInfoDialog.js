import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Swal from 'sweetalert2';

import React, { useState } from 'react';

function StackLevelInfoDialog() {
  const [levelOpen, setLevelOpen] = useState(false);
  const handleLevelOpen = () => {
    setLevelOpen(true);
  };
  const handleLevelClose = () => {
    setLevelOpen(false);
  };

  return (
    <>
      <Button sx={{ fontSize: '8px' }} onClick={handleLevelOpen}>
        <i>*숙련도</i>
      </Button>
      <Dialog
        open={levelOpen}
        onClose={handleLevelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'기술 스택 숙련도'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <b>하</b> - 코드를 읽을 수 있으며, 책을 참고하여 약간의 수정 작업
            또는 작은 변경 사항 추가를 할 수 있음
            <br />
            <b>중</b> - 시스템 동작 방식을 알고 있으며, 기본적인 기능을 구현할
            수 있음
            <br />
            <b>상</b> - 중간 규모 또는 그 이상 규모의 프로그램 및 시스템을
            개발할 수 있으며, 주요 이슈 트러블 슈팅을 할 수 있을 정도로 내부
            구조에 대해 이해하고 있음
            <br />
            <br />
            <i style={{ float: 'right' }}>네이버 채용 공고 참조</i>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLevelClose}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StackLevelInfoDialog;
