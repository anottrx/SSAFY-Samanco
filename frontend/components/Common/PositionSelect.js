import {Autocomplete, TextField, Stack, Paper, ButtonGroup, Button, Tooltip, Box } from "@mui/material"
import {useState, useEffect} from "react"
import styled from "@emotion/styled";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const position = [
    {name:"Frontend", count: 0},
    {name:"Backend", count: 0},
    {name:"Embedded", count: 0},
    {name:"Mobile", count: 0}
]

function PositionSelect(props) {
    let initArray = [];

    if (props.initData) {
        props.initData.map(data=>{
            if (data.position.includes("current") && data.size > 0) {
                let name = data.position.split("current")[1];
                initArray.push({name: name, count: data.size})
            }
        })
    }

    const [positions, setPositions] = useState(props.initData? initArray:[]);

    // 선택된 포지션이 바뀔 때마다 처리
    const handleAutocompleteChange = (event) => {
        const name = event.target.innerText;

        if (!name) return false;
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
        // 상위 컴포넌트에게 바뀐 포지션 전달
        let [FE, BE, EBD, MB] = [false, false, false, false];
        positions.map(pos => {
            switch (pos.name) {
                case "Frontend":
                    props.changeHandle(pos.count, "totalFrontendSize")
                    FE = true;
                    break;
                case "Backend":
                    props.changeHandle(pos.count, "totalBackendSize")
                    BE = true;
                    break;
                case "Embedded":
                    props.changeHandle(pos.count, "totalEmbeddedSize")
                    EBD = true;
                    break;
                case "Mobile":
                    props.changeHandle(pos.count, "totalMobileSize")
                    MB = true;
                    break;
                default:
                    break;
            }
        })

        if (!FE) props.changeHandle(0, "totalFrontendSize")
        if (!BE) props.changeHandle(0, "totalBackendSize")
        if (!EBD) props.changeHandle(0, "totalEmbeddedSize")
        if (!MB) props.changeHandle(0, "totalMobileSize")

    }, [positions])

    return (
        <>
        <Tooltip title="본인의 포지션을 포함해 인원 수를 선택해주세요. " placement="top-end">
        <Box>
         <Autocomplete
             id="free-solo-demo"
             freeSolo
             options={position.map((stack) => stack.name)}
             onChange={handleAutocompleteChange}
             renderInput={(params) => <TextField {...params} label="포지션 *" />}
         />
         </Box>
         </Tooltip>
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
    
    function DeletePosition(name){ // 포지션 삭제
        let newPos = props.positions.filter(pos => pos.name !== name);
        props.setPositions(newPos);
    }

    function plusCount(name){ // 포지션 수 증가
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

    function minusCount(name){ // 포지션 수 감소
        let newPos = JSON.parse(JSON.stringify(props.positions))
        let count;
        newPos.map(pos => {
            if (pos.name === name) {
                pos.count--;
                count = pos.count;
            }
        });

        if (count <= 0) {   // 수 감소시키다가 0개가 되면 삭제
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