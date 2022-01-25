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

  if (props.initData) {
    props.initData.map((data) => {
      if (data.stack.includes("current") && data.size > 0) {
        let name = data.stack.split("current")[1];
        initArray.push({ name: name, level: data.size });
      }
    });
  }

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
    // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    stacks.map((stack) => {
      switch (stack.name) {
        case "HTML":
          props.changeHandle(stack.level, "HTML");
          //   setStackStack([...stackStack, { HTML:  }]);
          HTML = stack.level;
          break;
        case "CSS":
          props.changeHandle(stack.level, "CSS");
          //   setStackStack([...stackStack, { CSS: stack.level }]);
          CSS = stack.level;
          break;
        case "JavaScript":
          props.changeHandle(stack.level, "JavaScript");
          //   setStackStack([...stackStack, { JavaScript: stack.level }]);
          JavaScript = stack.level;
          break;
        case "VueJS":
          props.changeHandle(stack.level, "VueJS");
          //   setStackStack([...stackStack, { VueJS: stack.level }]);
          VueJS = stack.level;
          break;
        default:
          break;
      }
    });

    console.log();
    // if (!HTML) props.changeHandle(0, "HTMLLevel");
    // if (!CSS) props.changeHandle(0, "CSSLevel");
    // if (!JavaScript) props.changeHandle(0, "JavaScriptLevel");
    // if (!VueJS) props.changeHandle(0, "VueJSLevel");
    // props.changeHandle(stackStack, stackStack);
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
    // console.log("스택 메소드 안에서 " + stack);
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
