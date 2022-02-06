import Layout from "../../components/Layout";
import ItemList from "../../components/Club/ItemList";
import SearchBar from "../../components/Common/Search";
import StackTagList from "../../components/Club/StackTagList";
import Carousel from "../../components/Club/Carousel";
import MyClub from "../../components/Club/MyClub";

import styled from "@emotion/styled";
import { Button, Divider } from "@mui/material";
import Router from "next/router";

export default function Study() {
  const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
  `

  const StudyActions = styled.div`
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
      <h1>Study</h1>
      <ItemWrapper>
        {
          sessionStorage.getItem("userId")?
          <MyClub label="내 스터디" from="study"></MyClub>
          :
          null
        }
        <StudyActions>
          <SearchBar target="study"></SearchBar>
          <CusButton variant="outlined" size="medium"
            onClick={() => {
              if (sessionStorage.getItem("userId"))
                Router.push("/study/regist")
              else {
                alert("로그인이 필요한 작업입니다.");
                Router.push("/login");
              }
            }}>
            등록
          </CusButton>
        </StudyActions>

        <StackTagList from="study"></StackTagList>
        <ItemList from="study"></ItemList>
      </ItemWrapper>

      <CusDivider variant="middle" />

      <Carousel label="인기 많은 스터디" target="study" subject="deadline"></Carousel>
      {/* <Carousel label="곧 마감 되는 스터디" target="study" subject="likes"></Carousel> */}
    </Layout>
  );
}
