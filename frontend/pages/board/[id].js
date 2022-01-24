import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

import Layout from "../../components/layout";
import { Paper, Box, Chip, Button, Grid, Stack, Divider, Typography} from "@mui/material";
import styled from "@emotion/styled";
import { useRouter } from 'next/router';
import styles from "../../styles/Board.module.css"
import Datas from "./data.js";
import board from "../../store/module/project";

export default function BoardDetail(props) {
    const detail = useSelector(({ board }) => board.boardDetail);

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

    return (
        <Layout>
            <h1>Board Detail</h1>
            <CusPaper> 
                <div>{detail.title}</div>
            </CusPaper>
        </Layout>
    )
}
