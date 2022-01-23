import React, { useEffect } from "react";
import Layout from "../../components/layout";
import { Paper, TextField, Box, Button, MenuItem} from "@mui/material";
import styled from "@emotion/styled";
import { useRouter } from 'next/router';
import styles from "../../styles/Board.module.css"

export default function BoardDetail(props) {
    const router = useRouter();

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
        console.log("아이디는"+router.query.board_id);
    });

    return (
        <Layout>
            <h1>Board Detail</h1>
            <CusPaper>  
                <TextField
                    id="outlined-textarea"
                    name="content"
                    label="게시글 내용"
                    placeholder="게시글 내용"
                    fullWidth
                    rows={30}
                    multiline
                />
            </CusPaper>
            
        </Layout>
    )
}
