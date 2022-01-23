import React, { useState, useRef, useEffect } from "react";
import { useSelector } from 'react-redux';

import Layout from "../../components/layout"
import { Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DateAdapter from '@mui/lab/AdapterDateFns';
import {LocalizationProvider } from '@mui/lab';

import StackSelect from "../../components/Common/Stack/StackSelect";

import styled from "@emotion/styled";

function studyUpdate() {
    const detail = useSelector(({ study }) => study.studyDetail);

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

    const [inputValue, setInputValue] = useState({
        schedule: detail.schedule,
        startDate: detail.startDate,
        endDate: detail.endDate,
        stacks: detail.stacks,
        positions: detail.positions
    });

    const [files, setFiles] = useState('');

    const onImgChange = (event) => {
        const file = event.target.files[0];
        setFiles(file)
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

    async function validateCheck() {
        let [check, msg] = [true, ""]
        if (typeof(inputValue.title)=='undefined') 
            inputValue["title"] = detail.title;
        else if (inputValue.title=="")
            [check, msg] = [false, "스터디 이름을 입력해주세요."]
        else if (typeof(inputValue.size)=='undefined' || inputValue.size == 0)   
            [check, msg] = [false, "스터디 인원은 한 명 이상이여야 합니다."]
        else if (typeof(inputValue.schedule)=='undefined' || inputValue.schedule == "")   
            [check, msg] = [false, "스터디가 진행될 스케쥴을 입력해주세요."]
        else if (typeof(inputValue.stacks)=='undefined' || inputValue.stacks.length == 0)   
            [check, msg] = [false, "스터디 주제를 선택해주세요."]

        if (!check)
            alert(msg)
        return check;
    }


    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
        <Layout>
            <h1>Study Update</h1>
            <CusPaper>   
                <ImgUploadBtn id="img_box" onClick={(event) => {
                    event.preventDefault();
                    uploadRef.current.click();
                }}>Image Upload</ImgUploadBtn>
                
                <input ref={uploadRef} type="file"
                    className="imgInput" id="studyImg"
                    accept="image/*" name="file" encType="multipart/form-data"
                    onChange={onImgChange}></input>

                <FormControl>
                    <InputLabel id="status-select-label">모집 상태</InputLabel>
                    <Select
                        labelId="status-select-label"
                        id="status-select"
                        name="collectStatus"
                        defaultValue={detail.collectStatus}
                        value={inputValue.collectStatus}
                        label="모집 상태"
                        onChange={(e) => changeHandle(e.target.value, "collectStatus")}
                    >
                        <MenuItem value={"ING"}>모집중</MenuItem>
                        <MenuItem value={"END"}>모집 완료</MenuItem>
                    </Select>
                </FormControl>

                <TextField 
                    fullWidth name="title" 
                    label="스터디 이름" 
                    onChange={(e) => changeHandle(e.target.value, "title")}
                    defaultValue={detail.title}
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
                    defaultValue={detail.description}
                    value={inputValue.description}
                />

                <TextField fullWidth name="size" label="스터디 인원" 
                    onChange={(e) => changeHandle(e.target.value, "size")}
                    defaultValue={detail.size}
                    value={inputValue.size}/>

                <TextField fullWidth id="filled-basic" name="schedule" label="스케쥴" onChange={(e) => changeHandle(e.target.value, "schedule")}
                    defaultValue={detail.schedule}
                    value={inputValue.schedule}/>
                
                <StackSelect changeHandle={changeHandle} initData={inputValue.stacks} label="스터디 스택"></StackSelect>

                <div className="registBtn">
                    <Button variant="outlined" onClick={() => {
                        if (validateCheck()) {
                            const formData = new FormData();

                            Object.keys(inputValue).map(key => {
                                if (key!=="positions"){
                                    let value = inputValue[key];
                                    formData.append(key, JSON.stringify(value));
                                }
                            })

                            formData.append("file",files);

                            for(var key of formData.entries())
                            {
                                console.log(`${key}`);
                            } 

                            // updateAPI(formData).then((res) => {
                            //     if (res.statusCode == 200) {
                            //         alert("프로젝트가 수정되었습니다.")
                            //         // To do: 해당 페이지로 이동
                            //         Router.push("/study");
                            //     }
                            // });
                        }
                    }}>수정하기</Button>
                </div>
            </CusPaper>
        </Layout>
        </LocalizationProvider>

    )
}

export default React.memo(studyUpdate);