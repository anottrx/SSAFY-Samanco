import Layout from "../../components/layout"
import { Paper, TextField, Box, Button, MenuItem} from "@mui/material";
import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import React from "react";
import styles from "../../styles/Board.module.css"
var FormData = require('form-data');

//게시글 등록 페이지
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
    
    const currencies = [
        // {
        //     value: 'notice',
        //     label: '공지사항',
        // },
        {
            value: 'free',
            label: '자유게시판',
        },
        {
            value: 'qna',
            label: '질문게시판',
        },
        {
            value: 'exam',
            label: '정보공유',
        },
        {
            value: 'job',
            label: '사람구해요',
        },
    ];

    const adminCurrencies = [{value: 'notice', label: '공지사항'}].concat(currencies)

    //파일 업로드 부분
    const FileUploadBtn = styled(Button)`
        padding: 10px;
        border: 1px dashed grey;
        width : 100%;
    `

    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [inputValue, setInputValue] = useState({});

    const [formData, changeFormData] = useState(new FormData());
    const [files, setFiles] = useState('');


    const changeHandle = (value, name) => {
        inputValue[name] = value;
    }
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
        setUserId(sessionStorage.getItem("userId"));
        setNickname(sessionStorage.getItem("nickname"));

        let fileName;
        if (!files) return false;

        const fileEl = document.querySelector("#file_box");
        const reader = new FileReader();

        reader.onload=()=>{
            fileName = files.name;
            fileEl.innerText  = fileName;
        }

        
        reader.readAsDataURL(files)
    }

    return (
        <Layout>
            <h1>Board Regist</h1>
            <CusPaper>   
                {nickname=="admin"? (<TextField
                    className={styles.boardRegistTag}
                    id="filled-select-currency"
                    select
                    label="태그"
                    
                    onChange={(e) => changeHandle(e.target.value, "tag")}
                    >
                    {adminCurrencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>) : (<TextField
                    className={styles.boardRegistTag}
                    id="filled-select-currency"
                    select
                    label="태그"
                    
                    onChange={(e) => changeHandle(e.target.value, "tag")}
                    >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>)}
               

                <TextField fullWidth name="title" label="제목" onChange={(e) => changeHandle(e.target.value, "title")}
                    value={inputValue.title}/>

                {/* <TextField fullWidth name="userId" label="아이디" onChange={(e) => changeHandle(e.target.value, "userId")}
                    value={inputValue.userId}/>     */}
                <TextField
                    id="outlined-textarea"
                    name="content"
                    label="게시글 내용"
                    placeholder="게시글 내용"
                    fullWidth
                    rows={20}
                    multiline
                    onChange={(e) => changeHandle(e.target.value, "content")}
                    value={inputValue.description}
                />

                {/*파일 업로드 부분*/}
                <FileUploadBtn id="file_box" onClick={(event) => {
                    event.preventDefault();
                    uploadRef.current.click();
                }}>파일 업로드</FileUploadBtn>
                
                <input ref={uploadRef} type="file"
                    className="imgInput" id="projectImg"
                    accept="*" name="file"
                    onChange={onImgChange}></input>


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