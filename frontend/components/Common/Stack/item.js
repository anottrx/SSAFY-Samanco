import Chip from '@mui/material/Chip';
import styled from "@emotion/styled";
import StackColor from "../../../data/StackColor.json"

export default function item(props){
    let color = StackColor[props.title];

    const StackChip = styled(Chip)`
        margin-right: 10px;
        margin-bottom: 5px;
        background-Color: #${color};
        border: 1px solid white;
    `

    return (
        <StackChip label={props.title}/>
    )
}