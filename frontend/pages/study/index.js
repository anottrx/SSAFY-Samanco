import Layout from "../../components/layout";
import ItemList from "../../components/Club/ItemList";
import SearchBar from "../../components/Common/Search";
import StackTagList from "../../components/Club/StackTagList";
import Carousel from "../../components/Club/Carousel";

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
        <StudyActions>
          <SearchBar></SearchBar>
          <CusButton variant="outlined" size="medium"
            onClick={() => {
              Router.push("/study/regist");
            }}>
            등록
          </CusButton>
        </StudyActions>

        <StackTagList></StackTagList>
        <ItemList from="study"></ItemList>
      </ItemWrapper>

      <CusDivider variant="middle" />

      <Carousel label="인기 많은 스터디"></Carousel>
      <Carousel label="곧 마감 되는 스터디"></Carousel>
    </Layout>
  );
}
