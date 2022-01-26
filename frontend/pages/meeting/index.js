import Layout from "../../components/layout";
import SearchBar from "../../components/Common/Search";
import ItemList from "../../components/Meeting/ItemList";

import { Button } from "@mui/material";
import styled from "@emotion/styled";

import Router from "next/router";

export default function Meeting() {
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
      <h1>Meeting</h1>
      <ItemWrapper>
        <StudyActions>
          <SearchBar></SearchBar>
          <CusButton variant="outlined" size="medium"
            onClick={() => {
              Router.replace("/meeting/regist");
            }}>
            등록
          </CusButton>
        </StudyActions>
      <ItemList></ItemList>
      </ItemWrapper>
    </Layout>
  );
}
