import { useState, useRef, useEffect } from "react";
import Layout from "../../components/Layout"

import { Paper, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import styled from "@emotion/styled";

function Regist() {
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

        & .privateCheckBox{
            margin-left: 0px;
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

    let userId;
    useEffect(() => {
      userId = sessionStorage.getItem("userId");
    }, []);
    

    const [inputValue, setInputValue] = useState({
        "hostId": userId,
    });

    const [files, setFiles] = useState('');

    const [privateCheck, setprivateCheck] = useState(false);

    const privateCheckHandle = (event) => {
        setprivateCheck(event.target.checked);
    };

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

    function validateCheck() {
        let [check, msg] = [true, ""]
        if (typeof(inputValue.title)=='undefined')
            [check, msg] = [false, "미팅룸 이름을 입력해주세요."]
        else if (typeof(inputValue.size)=='undefined' || inputValue.size == 0)   
            [check, msg] = [false, "미팅룸 인원은 한 명 이상이여야 합니다."]
        else if (privateCheck && (typeof(inputValue.password)=='undefined' || inputValue.password==""))   
            [check, msg] = [false, "비밀번호를 입력해주세요."]
        else if (privateCheck && (typeof(inputValue.passwordConfirm)=='undefined' || inputValue.password!=inputValue.passwordConfirm))
            [check, msg] = [false, "입력된 비밀번호가 일치하지 않습니다."]

        if (!check)
            alert(msg)
        return check;
    }


    return(
        <Layout>
            <h1>Meeting Regist</h1>
            <CusPaper>   
                <ImgUploadBtn id="img_box" onClick={(event) => {
                    event.preventDefault();
                    uploadRef.current.click();
                }}>Image Upload</ImgUploadBtn>
                
                <input ref={uploadRef} type="file"
                    className="imgInput" id="studyImg"
                    accept="image/*" name="file" encType="multipart/form-data"
                    onChange={onImgChange}></input>

                <TextField fullWidth name="title" label="미팅룸 이름" onChange={(e) => changeHandle(e.target.value, "title")}
                    value={inputValue.title}/>
                
                <TextField fullWidth name="size" label="미팅룸 인원" 
                    onChange={(e) => changeHandle(e.target.value, "size")}
                    value={inputValue.size}/>

                <FormControlLabel control={
                    <Checkbox
                        checked={privateCheck}
                        onChange={privateCheckHandle}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                } 
                label="비밀방으로 생성하기" className="privateCheckBox"></FormControlLabel>
                
                {
                    privateCheck? 
                    <>
                    <TextField fullWidth name="password" label="비밀번호" 
                        onChange={(e) => changeHandle(e.target.value, "password")}
                        value={inputValue.password}/>
                    <TextField fullWidth name="passwordConfirm" label="비밀번호 확인" 
                        onChange={(e) => changeHandle(e.target.value, "passwordConfirm")}
                        value={inputValue.passwordConfirm}/>
                    </>
                    :
                    null
                }
                    
                <div className="registBtn">
                    <Button variant="outlined" onClick={() => {
                        if (validateCheck()) {
                            const formData = new FormData();

                            Object.keys(inputValue).map(key => {
                                let value = inputValue[key];
                                formData.append(key, JSON.stringify(value));
                            })

                            formData.append("file",files);

                            // for(var key of formData.entries())
                            // {
                            //     console.log(`${key}`);
                            // } 
                        }

                        // registAPI(formData).then((res) => {
                        //     if (res.statusCode == 200) {
                        //         alert("스터디가 등록되었습니다.")
                        //         Router.push("/study");
                        //     }
                        // });
                    }}>등록하기</Button>
                </div>
            </CusPaper>
        </Layout>
    )
}

export default Regist;