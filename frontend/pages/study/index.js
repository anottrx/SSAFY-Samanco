import Layout from "../../components/layout";
import Items from "../../components/Club/ItemList";
import SearchBar from "../../components/Common/Search";
import StackTagList from "../../components/Club/StackTagList";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
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
            등록하기
          </CusButton>
        </StudyActions>

        <StackTagList></StackTagList>
        <Items></Items>
      </ItemWrapper>
    </Layout>
  );
}
