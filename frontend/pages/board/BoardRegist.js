import Layout from "../../components/layout"
import { Paper, TextField, Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import React from "react";
var FormData = require('form-data');


function BoardRegist() {
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
    

    const [inputValue, setInputValue] = useState({});


    const changeHandle = (value, name) => {
        inputValue[name] = value;
    }

    return (
        <Layout>
            <h1>Board Regist</h1>
            <CusPaper>   

                <TextField fullWidth name="title" label="제목" onChange={(e) => changeHandle(e.target.value, "title")}
                    value={inputValue.title}/>

                <TextField fullWidth name="user_id" label="아이디" onChange={(e) => changeHandle(e.target.value, "user_id")}
                    value={inputValue.user_id}/>    
                <TextField
                    id="outlined-textarea"
                    name="content"
                    label="게시글 내용"
                    placeholder="게시글 내용"
                    fullWidth
                    rows={30}
                    multiline
                    onChange={(e) => changeHandle(e.target.value, "content")}
                    value={inputValue.description}
                />


                <div className="registBtn">
                    <Button variant="outlined" onClick={() => {
                        console.log(inputValue);
                    }}>등록하기</Button>
                </div>
            </CusPaper>
        </Layout>
    )
}

export default BoardRegist;