import Layout from "../../components/layout"
import { Paper, TextField, Autocomplete, Box, Button, FormControl, OutlinedInput, InputLabel, MenuItem, Select, Chip } from "@mui/material";
import styled from "@emotion/styled";
import { useTheme } from '@mui/material/styles';
import { useState } from "react";
import {LocalizationProvider, DesktopDatePicker, } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, stackName, theme) {
    return {
      fontWeight:
        stackName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
}  

function ProjectRegist() {
    const CusPaper = styled(Paper)`
        width: 100%;
        padding: 10px;

        & > div {
            margin: 10px 0px;
        }
    `
    const stacks = [
        {name:"HTML", level: 0},
        {name:"CSS", level: 0},
        {name:"JavaScript", level: 0},
        {name:"VueJS", level: 0},
        {name:"React", level: 0},
        {name:"Angular", level: 0},
        {name:"Python", level: 0},
        {name:"Java", level: 0},
        {name:"C/C++/C#", level: 0},
        {name:"Spring boot", level: 0},
        {name:"MySQL", level: 0},
        {name:"Git", level: 0},
        {name:"AWS", level: 0},
        {name:"Docker", level: 0},
        {name:"Linux", level: 0},
        {name:"Jira", level: 0},
        {name:"Django", level: 0},
        {name:"Redis", level: 0}
    ]

    const theme = useTheme();
    const [stackName, setStackName] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setStackName(
        typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [dateValue, setDateValue] = useState({
        startDate: new Date(),
        endDate: new Date()
    })

    const dateHandleChange = (e) => {
        console.log(e)
        // const {value, name} = e.target;
        // setDateValue({...dateValue, [name]: value});
    };

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
                

                {/* Todo: 스택 선택 어떤 걸로 할 지 이야기 해봐야함! */}
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={stacks.map((stack) => stack.name)}
                    renderInput={(params) => <TextField {...params} label="프로젝트 스택" />}
                />

                <div>
                    <FormControl fullWidth>
                        <InputLabel id="demo-multiple-chip-label">프로젝트 스택</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={stackName}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                                </Box>
                            )}
                            MenuProps={MenuProps} >
                            {stacks.map((stack) => (
                                <MenuItem
                                key={stack.name}
                                value={stack.name}
                                style={getStyles(stack.name, stackName, theme)}
                                >
                                {stack.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                    <Datepicker label="시작 날짜" dateHandleChange={dateHandleChange} value={dateValue.startDate}></Datepicker>
                    <Datepicker label="종료 날짜" dateHandleChange={dateHandleChange} value={dateValue.endDate}></Datepicker>
            </CusPaper>
        </Layout>
        </LocalizationProvider>

    )
    
   function Datepicker(props){
       return (
        <DesktopDatePicker
            label={props.label}
            inputFormat="yyyy/MM/dd"
            value={props.value}
            onChange={props.dateHandleChange}
            renderInput={(params) => <TextField {...params} />}
            />
       )
   }
}

export default ProjectRegist;