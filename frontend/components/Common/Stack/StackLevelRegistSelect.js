import {
  Autocomplete,
  TextField,
  Stack,
  Paper,
  Rating,
  Modal,
  Box,
  Checkbox,
  Chip,
  CheckBoxOutlineBlankIcon,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";

const stacks = [
  { name: "HTML", level: 1 },
  { name: "CSS", level: 1 },
  { name: "JavaScript", level: 1 },
  { name: "VueJS", level: 1 },
  { name: "React", level: 1 },
  { name: "Angular", level: 1 },
  { name: "Python", level: 1 },
  { name: "Java", level: 1 },
  { name: "C", level: 1 },
  { name: "SpringBoot", level: 1 },
  { name: "MySQL", level: 1 },
  { name: "Git", level: 1 },
  { name: "AWS", level: 1 },
  { name: "Docker", level: 1 },
  { name: "Linux", level: 1 },
  { name: "Jira", level: 1 },
  { name: "Django", level: 1 },
  { name: "Redis", level: 1 },
];

const levels = [
  { name: "", level: 0 },
  { name: "하", level: 1 },
  { name: "중", level: 2 },
  { name: "상", level: 3 },
];

const handleDelete = () => {
    // console.info('You clicked the delete icon.');
  };

function StackLevelSelect() {
  const [stackName, setStackName] = useState([]);
  const handleAutocompleteChange = (event) => {
    const name = event.target.innerText;
    setStackName([...stackName, { name: name, level: 1 }]);
    console.log(stackName);
  };

  const handleLevelClick = (event, label) => {
    // event.preventDefault();
    console.log(label)
    if (event.target.innerText.includes(" ")) {
      let value = event.target.innerText.split(" ");
      const levelNames = ["(하)", "(중)", "(상)"];
      let curNth = 0;
      if (value[1] == levelNames[0]) {
        curNth = 0;
      } else if (value[1] == levelNames[1]) {
        curNth = 1;
      } else {
        curNth = 2;
      }
      curNth = (curNth + 1) % 3;
    //   console.log(value[0] + levelNames[curNth]);
      value = value[0] + " " + levelNames[curNth];
      event.target.innerText = value;
      
      console.log(stacks.indexOf(value[0]).level)
      
      label = value;
    }
  };

  return (
    <>
      <Autocomplete
        id="free-solo-demo"
        // freeSolo
        multiple
        filterSelectedOptions
        disablePortal
        autoHighlight={true}
        // options={stacks.map((stack) => (stack.name))}
        options={stacks.map(
          (stack) => stack.name + " (" + levels[stack.level].name + ")"
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              onClick={(event) => handleLevelClick(event, option)}
              variant="outlined"
              label={option}
              onDelete={handleDelete}
              {...getTagProps({ index })}
            />
          ))
        }
        onChange={handleAutocompleteChange}
        sx={{ width: 370, fontSize: 14 }}
        renderInput={(params) => <TextField {...params}></TextField>}
      ></Autocomplete>

      {/* <Stack>
                {
                    stackName.length > 0? 
                    stackName.map(stack => 
                        <CusPaper key={stack.name} name={stack.name}></CusPaper>)
                    : null
                }
            </Stack> */}
    </>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function CusPaper(props) {
  const Item = styled(Paper)`
    margin: 5px 0px;
    padding: 10px 20px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `;

  return (
    <Item>
      <span>{props.name}</span>
      <Rating
        // name="size-medium"
        defaultValue={1}
        size="large"
        max={3}
      />
    </Item>
  );
}

export default StackLevelSelect;
