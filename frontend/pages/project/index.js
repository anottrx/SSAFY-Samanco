import Layout from "../../components/layout";
import ItemList from "../../components/Club/ItemList";
import SearchBar from "../../components/Common/Search";
import StackTagList from "../../components/Club/StackTagList";
import Carousel from "../../components/Club/Carousel";
import MyClub from "../../components/Club/MyClub";

import styled from "@emotion/styled";
import { Button, Divider } from "@mui/material";

import Router from "next/router";

export default function Project() {
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

  const CusDivider = styled(Divider)`
    margin: 20px 0px;
  `
  
  return (
    <Layout>
      <h1>Project</h1>
      <ItemWrapper >
        <MyClub label="내 프로젝트"></MyClub>
    
        <CusDivider variant="middle" />
        <ProjectActions>
          <SearchBar target="project"></SearchBar>
          <CusButton variant="outlined" size="medium"
            onClick={() => {
              if (sessionStorage.getItem("userId"))
                Router.push("/project/regist")
              else {
                alert("로그인이 필요한 작업입니다.");
                Router.push("/login");
              }
            }}>
            등록하기
          </CusButton>
        </ProjectActions>
        <StackTagList></StackTagList>
        <ItemList from="project"></ItemList>
      </ItemWrapper>
    
      <CusDivider variant="middle" />

      <Carousel label="곧 마감 되는 프로젝트" target="project" subject="deadline"></Carousel>
      <Carousel label="인기 많은 프로젝트" target="project" subject="likes"></Carousel>
    </Layout>
  );
}
