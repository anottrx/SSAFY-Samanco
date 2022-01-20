import Layout from "../../components/layout"
import { Paper, TextField, Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import DatePicker from "../../components/Common/DatePicker";
import {LocalizationProvider } from '@mui/lab';
import StackLevelSelect from "../../components/Common/Stack/StackLevelSelect";
import StackSelect from "../../components/Common/Stack/StackSelect";
import DateAdapter from '@mui/lab/AdapterDateFns';


function ProjectRegist() {
    const CusPaper = styled(Paper)`
        width: 100%;
        padding: 10px;

        & > div {
            margin: 10px 0px;
        }
    `
    const DatePickerWrapper = styled.div`
        display: flex;
        & > div{
            flex: 1;
            margin: 10px 5px;
        }

    `

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
        <Layout>
            <h1>Project Regist</h1>
            <CusPaper>   
                <Box component="span" style={{ padding: 2, border: '1px dashed grey', height: 100, width: 100}}>
                    <Button>Image Upload</Button>
                </Box>

                <TextField fullWidth id="filled-basic" label="프로젝트 이름"/>
                <TextField
                    id="outlined-textarea"
                    label="프로젝트 설명"
                    placeholder="프로젝트 설명"
                    fullWidth
                    rows={4}
                    multiline
                />
                <TextField fullWidth id="filled-basic" label="스케쥴"/>
                
                <StackLevelSelect></StackLevelSelect>
                <StackSelect></StackSelect>
                
                <DatePickerWrapper>
                    <DatePicker label="시작 날짜"/>
                    <DatePicker label="종료 날짜"/>
                </DatePickerWrapper>
            </CusPaper>
        </Layout>
        </LocalizationProvider>

    )
}

export default ProjectRegist;