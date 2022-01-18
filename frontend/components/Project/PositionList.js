
import styled from "@emotion/styled";
import Chip from '@mui/material/Chip';

export default function PositionList(props) {
    const StackChip = styled(Chip)`
        margin-right: 10px;
    `

    return (
        <div>
            {
                Object.keys(props.positionData).map(key => {
                    return (
                        props.positionData[key] > 0 ?
                            <div>{key} <StackChip label={props.positionData[key]} size="small"></StackChip></div>
                            :
                            null
                        )
                })
            }
        </div>
    )
}