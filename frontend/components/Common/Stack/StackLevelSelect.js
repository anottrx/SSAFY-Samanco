import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const stacks = [
  { name: 'HTML', level: 0 },
  { name: 'CSS', level: 0 },
  { name: 'JavaScript', level: 0 },
  { name: 'VueJS', level: 0 },
  { name: 'React', level: 0 },
  { name: 'Angular', level: 0 },
  { name: 'Python', level: 0 },
  { name: 'Java', level: 0 },
  { name: 'C', level: 0 },
  { name: 'Spring boot', level: 0 },
  { name: 'MySQL', level: 0 },
  { name: 'Git', level: 0 },
  { name: 'AWS', level: 0 },
  { name: 'Docker', level: 0 },
  { name: 'Linux', level: 0 },
  { name: 'Jira', level: 0 },
  { name: 'Django', level: 0 },
  { name: 'Redis', level: 0 },
];

function StackLevelSelect() {
  const [stackName, setStackName] = useState([]);
  const handleAutocompleteChange = (event) => {
    const name = event.target.innerText;
    setStackName([{ name: name, level: 1 }, ...stackName]);
    console.log(stackName);
  };

  return (
    <>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={stacks.map((stack) => stack.name)}
        onChange={handleAutocompleteChange}
        renderInput={(params) => (
          <TextField {...params} label="프로젝트 스택" />
        )}
      />
      <Stack>
        {stackName.length > 0
          ? stackName.map((stack) => (
              <CusPaper key={stack.name} name={stack.name}></CusPaper>
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
  `;

  return (
    <Item>
      <span>{props.name}</span>
      <Rating name="size-medium" defaultValue={1} size="large" max={3} />
    </Item>
  );
}

export default StackLevelSelect;
