import StackTagListData from "../../data/StackTagListData.json"
import Stack from "../Common/Stack/item"
import styled from "@emotion/styled"

function StackTagList() {
    const TagWrapper = styled.div`
        width: 100%;
        margin: 10px 0px;
    `
    
    return (
        <TagWrapper>
            {
                StackTagListData.map(name => {
                    return (
                        <Stack key={name} title={name}></Stack>
                    )
                })
            }
        </TagWrapper>
    )
}

export default StackTagList
