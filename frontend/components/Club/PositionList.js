
import styled from "@emotion/styled";
import Chip from '@mui/material/Chip';

export default function PositionList(props) {
    const StackChip = styled(Chip)`
        margin-left: 10px;
    `

    return (
        <div>
            {
            Object.values(props.positionData).map((data, index) => {
                let position = Object.keys(data)[0];
                let size = data[Object.keys(data)[0]]
                return (
                    <div key={index}>{position}
                    <StackChip label={size} size="small"></StackChip>
                    </div>
                )
            })
        }
        </div>
    )
}