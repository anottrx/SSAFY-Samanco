import {
  Autocomplete,
  TextField,
  Stack,
  Paper,
  ButtonGroup,
  Rating,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const stack = [
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

function StackLevelSelectRegister(props) {
  let initArray = [];
    if (props.initData){
        props.initData.map(data=>{
            // initArray.push(data.name)
            initArray.push({ name: name, level: data.size });
        })
    }

  // if (props.initData) {
  //   props.initData.map((data) => {
  //     if (data.stack.includes("current") && data.size > 0) {
  //       let name = data.stack.split("current")[1];
  //       initArray.push({ name: name, level: data.size });
  //     }
  //   });
  // }

  const [stacks, setStacks] = useState(props.initData ? initArray : []);

  const handleAutocompleteChange = (event) => {
    const name = event.target.innerText;

    if (!name) return false;
    let isInclude = false;

    stacks.map((row) => {
      if (row.name === name) {
        // 중복된 key가 들어오지 않도록 처리
        isInclude = true;
      }
    });

    if (!isInclude) {
      setStacks([...stacks, { name: name, level: 1 }]);
    }
  };

  const [stackStack, setStackStack] = useState([]);
  useEffect(() => {
    // 상위 컴포넌트에게 바뀐 포지션 전달
    let [
      HTML,
      CSS,
      JavaScript,
      VueJS,
      React,
      Angular,
      Python,
      Java,
      C,
      SpringBoot,
      MySQL,
      Git,
      AWS,
      Docker,
      Linux,
      Jira,
      Django,
      Redis,
    ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    stacks.map((stack) => {
      switch (stack.name) {
        case "HTML":
          props.changeHandle(stack.level, "HTML");
          // setStackStack([...stackStack, { HTML:stack.level  }]);
          HTML = stack.level;
          break;
        case "CSS":
          props.changeHandle(stack.level, "CSS");
          CSS = stack.level;
          break;
        case "JavaScript":
          props.changeHandle(stack.level, "JavaScript");
          JavaScript = stack.level;
          break;
        case "VueJS":
          props.changeHandle(stack.level, "VueJS");
          VueJS = stack.level;
          break;
        case "React":
          props.changeHandle(stack.level, "React");
          React = stack.level;
          break;
        case "Angular":
          props.changeHandle(stack.level, "Angular");
          Angular = stack.level;
          break;
        case "Python":
          props.changeHandle(stack.level, "Python");
          Python = stack.level;
          break;
        case "Java":
          props.changeHandle(stack.level, "Java");
          Java = stack.level;
          break;
        case "C":
          props.changeHandle(stack.level, "C");
          C = stack.level;
          break;
        case "SpringBoot":
          props.changeHandle(stack.level, "SpringBoot");
          SpringBoot = stack.level;
          break;
        case "MySQL":
          props.changeHandle(stack.level, "MySQL");
          MySQL = stack.level;
          break;
        case "Git":
          props.changeHandle(stack.level, "Git");
          Git = stack.level;
          break;
        case "AWS":
          props.changeHandle(stack.level, "AWS");
          AWS = stack.level;
          break;
        case "Docker":
          props.changeHandle(stack.level, "Docker");
          Docker = stack.level;
          break;
        case "Linux":
          props.changeHandle(stack.level, "Linux");
          Linux = stack.level;
          break;
        case "Jira":
          props.changeHandle(stack.level, "Jira");
          Jira = stack.level;
          break;
        case "Django":
          props.changeHandle(stack.level, "Django");
          Django = stack.level;
          break;
        case "Redis":
          props.changeHandle(stack.level, "Redis");
          Redis = stack.level;
          break;
        default:
          break;
      }
    });

    if (HTML == 0) props.changeHandle(0, "HTML");
    if (CSS == 0) props.changeHandle(0, "CSS");
    if (JavaScript == 0) props.changeHandle(0, "JavaScript");
    if (VueJS == 0) props.changeHandle(0, "VueJS");
    if (React == 0) props.changeHandle(0, "React");
    if (Python == 0) props.changeHandle(0, "Python");
    if (C == 0) props.changeHandle(0, "C");
    if (SpringBoot == 0) props.changeHandle(0, "SpringBoot");
    if (MySQL == 0) props.changeHandle(0, "MySQL");
    if (Git == 0) props.changeHandle(0, "Git");
    if (AWS == 0) props.changeHandle(0, "AWS");
    if (Docker == 0) props.changeHandle(0, "Docker");
    if (Linux == 0) props.changeHandle(0, "Linux");
    if (Jira == 0) props.changeHandle(0, "Jira");
    if (Django == 0) props.changeHandle(0, "Django");
    if (Redis == 0) props.changeHandle(0, "Redis");

    // if (!CSS) props.changeHandle(0, "CSSLevel");
    // if (!JavaScript) props.changeHandle(0, "JavaScriptLevel");
    // if (!VueJS) props.changeHandle(0, "VueJSLevel");
    // props.changeHandle(stackStack, "stacks");
  }, [stacks]);

  return (
    <>
      <Box>
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={stack.map((stack) => stack.name)}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
      <Stack>
        {stacks.length > 0
          ? stacks.map((stack) => (
              <CusPaper
                key={stack.name}
                name={stack.name}
                level={stack.level}
                stacks={stacks}
                setStacks={setStacks}
              ></CusPaper>
            ))
          : null}
      </Stack>
    </>
  );
}

function CusPaper(props) {
  const Item = styled(Paper)`
    margin: 5px 0px;
    padding: 10px 20px;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & .deleteBtn {
      cursor: pointer;
    }
  `;

  function DeleteStack(name) {
    let newStack = props.stacks.filter((stack) => stack.name !== name);
    props.setStacks(newStack);
  }

  function handleLevelChange(event, name) {
    let newStack = JSON.parse(JSON.stringify(props.stacks));
    let level;
    newStack.map((stack) => {
      if (stack.name === name) {
        stack.level = event.target.value;
        level = stack.level;
      }
    });
    if (level <= 0) {
      newStack = props.stacks.filter((stack) => stack.name !== name);
    }
    props.setStacks(newStack);
  }

  return (
    <Item>
      <span>{props.name}</span>
      <ButtonGroup>
        <Rating
          name={props.name}
          value={Number(props.level)}
          size="large"
          max={3}
          onChange={(event) => handleLevelChange(event, props.name)}
        ></Rating>
        <DeleteIcon
          onClick={() => {
            DeleteStack(props.name);
          }}
        />
      </ButtonGroup>
    </Item>
  );
}

export default StackLevelSelectRegister;
