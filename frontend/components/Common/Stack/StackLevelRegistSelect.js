import {
  Autocomplete,
  TextField,
  Stack,
  Paper,
  IconButton,
  Rating,
  Modal,
  Box,
  Checkbox,
  Chip,
  CheckBoxOutlineBlankIcon,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import StackLevelList from "./StackLevelList";

const stacks = [
  { name: "HTML", level: 1, disabled: false },
  { name: "CSS", level: 1, disabled: false },
  { name: "JavaScript", level: 1, disabled: false },
  { name: "VueJS", level: 1, disabled: false },
  { name: "React", level: 1, disabled: false },
  { name: "Angular", level: 1, disabled: false },
  { name: "Python", level: 1, disabled: false },
  { name: "Java", level: 1, disabled: false },
  { name: "C", level: 1, disabled: false },
  { name: "SpringBoot", level: 1, disabled: false },
  { name: "MySQL", level: 1, disabled: false },
  { name: "Git", level: 1, disabled: false },
  { name: "AWS", level: 1, disabled: false },
  { name: "Docker", level: 1, disabled: false },
  { name: "Linux", level: 1, disabled: false },
  { name: "Jira", level: 1, disabled: false },
  { name: "Django", level: 1, disabled: false },
  { name: "Redis", level: 1, disabled: false },
];

const stacks2 = [
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

function StackLevelSelect() {
  const [stackName, setStackName] = useState([]);
  // const [stacks, setStacks] = useState([])

  // const handleAutocompleteChange = useCallback(
  //   (event) => {
  //     const name = event.target.innerText;
  //     setStackName([...stackName, { name: name, level: 1 }]);
  //     console.log(stackName);
  //   },
  //   [stackName]
  // );

  //  const handleAutocompleteChange = (event) => {
  //     const name = event.target.innerText;
  //     setStackName([...stackName, { name: name, level: 1 }]);
  //     console.log(stackName);
  //   }
  
async  function handleAutocompleteChange(event) {
    const name = event.target.innerText;
    setStackName([...stackName, { name: name, level: 1 }]);
    console.log({ name: name, level: 1 });
    console.log(stackName);
  }

    function handleDeleteClick(event) {
    setStackName(stackName.filter(stack => stack.name!=event.target.name))
    console.log(stackName);
  }


  // const handleDeleteClick = (event) => {
    // setStackName(stackName.filter(stack => stack.name==event.target.name))
    // console.log(stackName);
    // let nth = 0;
    // stackName.forEach((stack) => {
    //   nth++;
    //   if (stack.name == event.target.name) {
    //     console.log(stack.name);
    //     setStackName(stackName.filter(stack => s))
    //   }
    // });
  // };

  const handleLevelChange = (event) => {
    console.log(event.target);
    const name = event.target.name;
    const level = event.target.value;

    // setStackName();
  };

  const handleLevelClick = (event, label) => {
    // event.preventDefault();
    console.log(label);
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

      console.log(stacks.indexOf(value[0]).level);

      label = value;
    }
  };

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
          name={props.name}
          // name="size-medium"
          defaultValue={1}
          size="large"
          max={3}
          onChange={(event)=>handleLevelChange(event)}
        ></Rating>
        <IconButton
          name={props.name}
          aria-label="delete"
          size="small"
          onClick={handleDeleteClick}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Item>
    );
  }

  return (
    <>
      {/* <StackLevelList value={stacks}></StackLevelList> */}
      <Autocomplete
        id="free-solo-demo"
        multiple
        disableClearable
        filterSelectedOptions
        disablePortal
        options={stacks.map((stack) => stack.name)}
        renderTags={() => null}
        // options={stacks}
        // getOptionLabel={(option) => option.name}
        // options={stacks.map(
        //   (stack) => stack.name + " (" + levels[stack.level].name + ")"
        // )}
        onChange={handleAutocompleteChange}
        sx={{ width: 370, fontSize: 14 }}
        renderInput={(params) => <TextField {...params}></TextField>}
      ></Autocomplete>

      <Stack>
        {stackName.length > 0
          ? stackName.map((stack) => (
              <CusPaper
                key={stack.name}
                name={stack.name}
                level={stack.level}
              ></CusPaper>
            ))
          : null}
      </Stack>
    </>
  );
}

export default StackLevelSelect;
