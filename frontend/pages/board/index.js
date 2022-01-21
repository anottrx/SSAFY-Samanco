import * as React from 'react';
import PropTypes from 'prop-types';
import {Tabs, Tab, Typography, Box, Button} from '@mui/material';
import styled from "@emotion/styled";
import Router from "next/router";
import Layout from "../../components/layout";
import SearchBar from "../../components/Common/Search";

import BoardList from "./BoardList";

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
          <Typography>{children}</Typography>
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

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
  `

  const ProjectActions = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `

  const CusButton = styled(Button)`
    height: fit-content;
  `

  return (
    <Layout>
        <h1>Board</h1>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="공지사항" {...a11yProps(0)} />
              <Tab label="자유게시판" {...a11yProps(1)} />
              <Tab label="질문게시판" {...a11yProps(2)} />
              <Tab label="정보공유" {...a11yProps(3)} />
              <Tab label="사람구해요" {...a11yProps(4)} />
            </Tabs>
          </Box>
          <ItemWrapper>
            <ProjectActions>
              <SearchBar></SearchBar>
              <CusButton variant="outlined" size="medium"
                onClick={() => {
                  Router.push("/board/BoardRegist");
                }}>
                등록하기
              </CusButton>
            </ProjectActions>
          </ItemWrapper>
          <TabPanel value={value} index={0}>
            <BoardList tag="notice"/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BoardList tag="free"/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <BoardList tag="qna"/>
          </TabPanel>
      </Box>
    </Layout>
  );
}
