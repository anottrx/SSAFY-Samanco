import React from "react";
import { useState, useRef, useEffect } from "react";

import Layout from "../../components/layout"
import Counter from "../../components/Common/PositionSelect";
import DatePicker from "../../components/Common/DatePicker";
import StackLevelSelect from "../../components/Common/Stack/StackLevelSelect";
import StackSelect from "../../components/Common/Stack/StackSelect";

import { Paper, TextField, Box, Button } from "@mui/material";
import {LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import styled from "@emotion/styled";

var FormData = require('form-data');

function StudyRegist() {
    const CusPaper = styled(Paper)`
        width: 100%;
        padding: 10px;

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
    const DatePickerWrapper = styled.div`
        display: flex;
        & > div{
            flex: 1;
            margin: 10px 5px;
        }
    `

    const ImgUploadBtn = styled(Button)`
        padding: 20px;
        border: 1px dashed grey;
        min-width: 150px;
        min-height: 150px; 
        margin: 10px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
    `

    const [inputValue, setInputValue] = useState({});

    const [formData, changeFormData] = useState(new FormData());
    const [files, setFiles] = useState('');

    const onImgChange = (event) => {
        const file = event.target.files[0];
        setFiles(file)

        const newData = new FormData();
        newData.append("file", file);
        changeFormData(newData);
    }

    const uploadRef = useRef(null);

    useEffect(() => {
        preview();
    });

    const preview = () => {
        if (!files) return false;

        const imgEl = document.querySelector("#img_box");
        const reader = new FileReader();

        reader.onload = () => (
            imgEl.style.backgroundImage = `url(${reader.result})`
        )

        imgEl.innerText  = "";
        reader.readAsDataURL(files)
    }

    const changeHandle = (value, name) => {
        inputValue[name] = value;
        // 리렌더링 X
    }

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
        <Layout>
            <h1>Study Regist</h1>
            <CusPaper>   
                <ImgUploadBtn id="img_box" onClick={(event) => {
                    event.preventDefault();
                    uploadRef.current.click();
                }}>Image Upload</ImgUploadBtn>
                
                <input ref={uploadRef} type="file"
                    className="imgInput" id="studyImg"
                    accept="image/*" name="file"
                    onChange={onImgChange}></input>

                <TextField fullWidth name="title" label="스터디 이름" onChange={(e) => changeHandle(e.target.value, "title")}
                    value={inputValue.title}/>
                <TextField
                    id="outlined-textarea"
                    name="description"
                    label="스터디 설명"
                    placeholder="스터디 설명"
                    fullWidth
                    rows={4}
                    multiline
                    onChange={(e) => changeHandle(e.target.value, "description")}
                    value={inputValue.description}
                />
                <TextField fullWidth id="filled-basic" name="schedule" label="스케쥴" onChange={(e) => changeHandle(e.target.value, "schedule")}
                    value={inputValue.schedule}/>
                
                {/* <StackLevelSelect></StackLevelSelect> */}
                <StackSelect changeHandle={changeHandle} label="스터디 스택"></StackSelect>
                
                <DatePickerWrapper>
                    <DatePicker changeHandle={changeHandle} label="시작 날짜"/>
                    <DatePicker changeHandle={changeHandle} label="종료 날짜"/>
                </DatePickerWrapper>

                {/* 스터디 등록엔 포지션 필요 X */}
                {/* <Counter changeHandle={changeHandle}></Counter> */}

                <div className="registBtn">
                    <Button variant="outlined" onClick={() => {
                        console.log(inputValue);
                        
                        for (var pair of formData.entries()) {
                            console.log(pair[1]);
                        }
                    }}>등록하기</Button>
                </div>
            </CusPaper>
        </Layout>
        </LocalizationProvider>
    )
}


export default React.memo(StudyRegist);