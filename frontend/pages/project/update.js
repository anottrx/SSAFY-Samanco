import React, { useState, useRef, useEffect } from "react";
import { useSelector } from 'react-redux';

import Layout from "../../components/Layout"
import { Paper, TextField, Button, Autocomplete, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import DateAdapter from '@mui/lab/AdapterDateFns';
import {LocalizationProvider } from '@mui/lab';

import DatePicker from "../../components/Common/DatePicker";
import StackSelect from "../../components/Common/Stack/StackSelect";
import Counter from "../../components/Common/PositionSelect";

import styled from "@emotion/styled";
import { updateAPI } from "../api/project"

import Router from "next/router";

const position = [
    {name:"Frontend", count: 0},
    {name:"Backend", count: 0},
    {name:"Embedded", count: 0},
    {name:"Mobile", count: 0}
]

function projectUpdate() {
    const detail = useSelector(({ project }) => project.projectDetail);
    const url = "../../../backend-java";

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

    const [inputValue, setInputValue] = useState({
        projectId: detail.id,
        hostId: sessionStorage.getItem("userId"),
        startDate: detail.startDate,
        endDate: detail.endDate,
        stacks: detail.stacks,
        positions: detail.positions,
        hostPosition: detail.hostPosition
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
        let saveFile, saveFolder

        if (detail.file) {
            saveFile = detail.file.saveFile;
            saveFolder = detail.file.saveFolder;
        }
        reader.onload = () => (
        
            detail.file? 
            imgEl.style.backgroundImage = `url(${url}/${saveFolder}/${saveFile})`
            :
            imgEl.style.backgroundImage = `url(${reader.result})`
        )

        imgEl.innerText  = "";
        reader.readAsDataURL(files)
    }

    const changeHandle = (value, name) => {
        inputValue[name] = value;
        // 리렌더링 X
    }

    const handleAutocompleteChange = (event) => {
        const name = event.target.innerText;
        inputValue["hostPosition"] = name;
    };

    function validateCheck() {
        let [check, msg] = [true, ""]
        
        if (typeof(inputValue.title)=='undefined')
            inputValue["title"] = detail.title;
        else if (inputValue.title=="")
                [check, msg] = [false, "프로젝트 이름을 입력해주세요."]
        if (typeof(inputValue.collectStatus)=='undefined')
            inputValue["collectStatus"] = detail.collectStatus;
        if (typeof(inputValue.description)=='undefined')
            inputValue["description"] = detail.description;
        if (typeof(inputValue.hostPosition)=='undefined')   
            [check, msg] = [false, "본인의 포지션을 선택해주세요."]
        if (typeof(inputValue.stacks)=='undefined')   
            inputValue["stacks"] = detail.stacks;
        else if (inputValue.stacks.length == 0)   
            [check, msg] = [false, "프로젝트 스택을 한가지 이상 선택해주세요."]
        else if (inputValue.positions.totalFrontendSize + inputValue.positions.totalBackendSize + 
            inputValue.totalEmbeddedSize + inputValue.positions.totalMobileSize <= 1)   
            [check, msg] = [false, "팀원은 한 명이상 존재해야 합니다."]
        
        if (!check)
            alert(msg)
        return check;
    }

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
        <Layout>
            <h1>Project Update</h1>
            <CusPaper>   
                <ImgUploadBtn id="img_box" onClick={(event) => {
                    event.preventDefault();
                    uploadRef.current.click();
                }}>Image Upload</ImgUploadBtn>
                
                <input ref={uploadRef} type="file"
                    className="imgInput" id="projectImg"
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
                    label="프로젝트 이름" 
                    onChange={(e) => changeHandle(e.target.value, "title")}
                    defaultValue={detail.title}
                    value={inputValue.title}
                    />
                <TextField
                    id="outlined-textarea"
                    name="description"
                    label="프로젝트 설명"
                    placeholder="프로젝트 설명"
                    fullWidth
                    rows={4}
                    multiline
                    onChange={(e) => changeHandle(e.target.value, "description")}
                    defaultValue={detail.description}
                    value={inputValue.description}
                />

                <StackSelect changeHandle={changeHandle} initData={detail.stacks} label="프로젝트 스택"></StackSelect>
                
                <DatePickerWrapper>
                    <DatePicker initDate={inputValue.startDate} changeHandle={changeHandle} label="시작 날짜"/>
                    <DatePicker initDate={inputValue.endDate}  changeHandle={changeHandle} label="종료 날짜"/>
                </DatePickerWrapper>

                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    value={inputValue.hostPosition}
                    options={position.map((stack) => stack.name)}
                    onChange={handleAutocompleteChange}
                    renderInput={(params) => <TextField {...params} label="본인 포지션" />}
                />

                <Counter changeHandle={changeHandle} initData={inputValue.positions}></Counter>

                <div className="registBtn">
                    <Button variant="outlined" onClick={() => {
                        if (validateCheck()) {
                            const formData = new FormData();

                            Object.keys(inputValue).map(key => {
                                let value = inputValue[key];
                                if (key === 'stacks' || key == 'positions')
                                    formData.append(key, JSON.stringify(value));
                                else 
                                    formData.append(key, value);
                            })
                            formData.append("file",files);
                
                            // for(var key of formData.entries())
                            // {
                            //     console.log(`${key}`);
                            // } 

                            updateAPI(formData).then((res) => {
                                if (res.statusCode == 200) {
                                    alert("프로젝트가 수정되었습니다.")
                                    Router.push("/project/"+inputValue.projectId);
                                } else {
                                    alert(`${res.message}`)
                                }
                            });
                        }
                    }}>수정하기</Button>
                </div>
            </CusPaper>
        </Layout>
        </LocalizationProvider>

    )
}

export default React.memo(projectUpdate);