import {Autocomplete, TextField, Stack, Paper, ButtonGroup, Button } from "@mui/material"
import {useState, useEffect} from "react"
import styled from "@emotion/styled";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const position = [
    {name:"Front-end", count: 0},
    {name:"Back-end", count: 0},
    {name:"Embedded", count: 0},
    {name:"Mobile", count: 0}
]

function PositionSelect(props) {
    const [positions, setPositions] = useState([]);

    const handleChange = (event) => {
        const name = event.target.innerText;
        let isInclude = false;

        positions.map(row => {
            if (row.name === name) {
                // 중복된 key가 들어오지 않도록 처리
                isInclude = true;
            }
        })

        if (!isInclude){
            setPositions([
                ...positions, 
                {name: name, count: 1}
            ]);
        }
    };
    useEffect(() => {
        let positionArray = [];
        positions.map(pos => {
            positionArray.push({[pos.name]:pos.count})
        })
        props.changeHandle(positionArray, "positions")
    }, [positions])

    return (
        <>
         <Autocomplete
             id="free-solo-demo"
             freeSolo
             options={position.map((stack) => stack.name)}
             onChange={handleChange}
             renderInput={(params) => <TextField {...params} label="포지션" />}
         />
         <Stack>
             {
                 positions.length > 0? 
                 positions.map(stack => 
                     <CusPaper 
                        key={stack.name} 
                        name={stack.name} 
                        count={stack.count}
                        positions={positions}
                        setPositions={setPositions}
                         >
                     </CusPaper>)
                 : null
             }
         </Stack>
         </>
    )
}

function CusPaper(props){
    const Item = styled(Paper)`
        margin: 5px 0px;
        padding: 10px 20px;
        font-size: 13px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        & .deleteBtn{
            cursor: pointer;
        }
    `
    
    function DeletePosition(name){
        console.log("Delete")
        let newPos = props.positions.filter(pos => pos.name !== name);
        console.log("newPos",newPos)
        props.setPositions(newPos);
    }

    function plusCount(name){
        // 객체는 깊은 복사를 해야함!
        // 왜냐하면 리액트는 객체 변화를 레퍼런스 기준으로 감지해서 리렌더링하기 때문
        let newPos = JSON.parse(JSON.stringify(props.positions))
        newPos.map(pos => {
            if (pos.name === name) {
                pos.count++;
            }
            
        });
        props.setPositions(newPos);
    }

    function minusCount(name){
        let newPos = JSON.parse(JSON.stringify(props.positions))
        let count;
        newPos.map(pos => {
            if (pos.name === name) {
                pos.count--;
                count = pos.count;
            }
        });

        if (count <= 0) {
            newPos = props.positions.filter(pos => pos.name !== name);
         }
        props.setPositions(newPos);
    }
    
    return (
        <Item>
            <span>
                {props.name}
            </span>
            <ButtonGroup>
                <Button onClick={()=>{minusCount(props.name)}}><RemoveIcon /></Button>
                <Button>{props.count}</Button>
                <Button onClick={()=>{plusCount(props.name)}}><AddIcon /></Button>
                <Button onClick={() => {DeletePosition(props.name)}}><DeleteIcon /></Button>
            </ButtonGroup>
        </Item>
    )
}


export default PositionSelect;