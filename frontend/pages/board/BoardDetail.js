import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { Paper, Box, Chip, Button, Grid, Stack, Divider, Typography} from "@mui/material";
import styled from "@emotion/styled";
import { useRouter } from 'next/router';
import styles from "../../styles/Board.module.css"
import Datas from "./data.js";

export default function BoardDetail(props) {
    const router = useRouter();
    const no = router.query.boardId;
    let [articles,setArticles] = useState(Datas);

    const CusPaper = styled(Paper)`
        width: 100%;
        padding: 10px;
        margin: 0 auto;

        & > div {
            margin: 10px 0px;
        }

        & .registBtn{
            display: flex;
            justify-content: flex-end;
        }

        & .imgInput{
            display:none;
        }
    `

    useEffect(()=>{
        console.log(articles[no]);
    });

    return (
        <Layout>
            <h1>Board Detail</h1>
            <CusPaper>  
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <Box sx={{ my: 3, mx: 2 }}>
                        <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography gutterBottom variant="h2" component="div">
                            {articles[no].title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography gutterBottom variant="h6" component="div">
                            {articles[no].userId}
                            </Typography>
                        </Grid>
                        </Grid>
                        <Typography color="text.secondary" variant="body2">
                        {articles[no].startDate}
                        </Typography>
                    </Box>
                    <Divider variant="middle" />
                    <Box sx={{ m: 2 }}>
                        <Typography gutterBottom variant="body1">
                        {articles[no].content}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                        <Button>Add to cart</Button>
                    </Box>
                </Box>
            </CusPaper>
        </Layout>
    )
}
