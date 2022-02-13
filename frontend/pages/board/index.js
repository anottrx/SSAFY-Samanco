import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Layout from '../../components/Layout';
import styled from '@emotion/styled';

import BoardColor from '../../data/BoardColor.json';
import BoardList from '../../components/Board/BoardList';
import * as boardActions from '../../store/module/board';
import Router from 'next/router';

//게시판 탭(공지사항, 자유게시판, 질문게시판, 정보공유, 사람구해요)

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Board() {
  const dispatch = useDispatch();
  const detail = useSelector(({ board }) => board.boardDetail);

  const [value, setValue] = useState(0);
  const [tagColor, setTagColor] = useState('535353');

  const handleChange = (e, newValue) => {
    setValue(newValue);
    setTagColor(BoardColor[e.target.id].color);
  };

  // useEffect(() => {
  //   if (detail) {
  //     switch (detail.tag) {
  //       case 'notice':
  //         setValue(1);
  //         break;
  //       case 'free':
  //         setValue(2);
  //         break;
  //       case 'qna':
  //         setValue(3);
  //         break;
  //       case 'exam':
  //         setValue(4);
  //         break;
  //       case 'job':
  //         setValue(5);
  //         break;
  //       default:
  //         setValue(0);
  //         break;
  //     }
  //   }
  // }, []);

  const CusButton = styled(Button)`
    height: fit-content;
    align-self: right;
  `;

  const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
  `;

  const CusTabs = styled(Tabs)`
    & .MuiTab-root {
      font-size: 13px;
    }

    & .Mui-selected {
      font-weight: bolder;
      color: #${tagColor}!important;
    }

    & .MuiTab-root:hover {
      font-weight: bolder;
    }

    & .MuiTabs-indicator {
      background-color: #${tagColor};
    }
  `;

  return (
    <Layout>
      <h1>Board</h1>
      <ButtonWrapper>
        <CusButton
          variant="outlined"
          size="medium"
          onClick={() => {
            if (sessionStorage.getItem('userId')) Router.push('/board/regist');
            else {
              alert('로그인이 필요한 작업입니다.');
              Router.push('/login');
            }
          }}
        >
          등록하기
        </CusButton>
      </ButtonWrapper>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <CusTabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="전체 보기" {...a11yProps('all')} />
            <Tab label="공지사항" {...a11yProps('notice')} />
            <Tab label="자유게시판" {...a11yProps('free')} />
            <Tab label="질문게시판" {...a11yProps('qna')} />
            <Tab label="정보공유" {...a11yProps('exam')} />
            <Tab label="사람구해요" {...a11yProps('job')} />
          </CusTabs>
        </Box>
        <TabPanel value={value} index={0}>
          <BoardList tag="all" />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BoardList tag="notice" />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <BoardList tag="free" />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <BoardList tag="qna" />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <BoardList tag="exam" />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <BoardList tag="job" />
        </TabPanel>
      </Box>
    </Layout>
  );
}
