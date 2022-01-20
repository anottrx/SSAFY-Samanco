import { Box, FormControl, OutlinedInput, InputLabel, MenuItem, Select, Chip } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from "react";
import styled from "@emotion/styled";

const stacks = [
    {name:"HTML", level: 0},
    {name:"CSS", level: 0},
    {name:"JavaScript", level: 0},
    {name:"VueJS", level: 0},
    {name:"React", level: 0},
    {name:"Angular", level: 0},
    {name:"Python", level: 0},
    {name:"Java", level: 0},
    {name:"C", level: 0},
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

function StackSelect(props){
    
    let initArray = [];
    props.initData.map(data=>{
        initArray.push(Object.keys(data)[0])
    })

    const [stackName, setStackName] = useState(
        props.initData? initArray: []);
    const theme = useTheme();

    const handleChange = (event) => {
        const {target: { value },} = event;
        setStackName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const CusChip = styled(Chip)`
        & :hover {
            font-weight: bolder;
            cursor: pointer;
        }
    `
    useEffect(() => {
        let stackArray = [];
        stackName.map(stack => {
            stackArray.push({[stack]:1});
        })
        props.changeHandle(stackArray,"stack");
    }, [stackName])

    return(
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
                            <CusChip key={value} label={value} 
                            onClick={(e) => {
                                e.stopPropagation();
                                setStackName(stackName.filter(name => name !== value))
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            />
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
    )
}

export default StackSelect;