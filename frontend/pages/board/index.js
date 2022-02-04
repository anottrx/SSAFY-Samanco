import { useState } from 'react';
import PropTypes from 'prop-types';
import {Tabs, Tab, Typography, Box, Button} from '@mui/material';

import Layout from "../../components/layout";
import styled from '@emotion/styled';

import BoardList from "../../components/Board/BoardList";


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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Board() {

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout>
        <h1>Board</h1>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="전체 보기" {...a11yProps(0)} />
              <Tab label="공지사항" {...a11yProps(1)} />
              <Tab label="자유게시판" {...a11yProps(2)} />
              <Tab label="질문게시판" {...a11yProps(3)} />
              <Tab label="정보공유" {...a11yProps(4)} />
              <Tab label="사람구해요" {...a11yProps(5)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <BoardList tag="all"/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BoardList tag="notice"/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <BoardList tag="free"/>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <BoardList tag="qna"/>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <BoardList tag="exam"/>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <BoardList tag="job"/>
          </TabPanel>
      </Box>
    </Layout>
  );
}
