import Chip from '@mui/material/Chip';
import styled from "@emotion/styled";

export default function item(props){
    const StackChip = styled(Chip)`
        margin-right: 10px;
        margin-bottom: 5px;
    `

    return (
        <StackChip label={props.title} />
    )
}