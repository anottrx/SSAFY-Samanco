import StackTagListData from "../../data/StackTagListData.json"
import Stack from "../Common/Stack/item"
import styled from "@emotion/styled"
import { useEffect, useState } from "react";
import { projectStackList } from "../../pages/api/project"

function StackTagList(props) {
    const TagWrapper = styled.div`
        width: 100%;
        margin: 10px 0px;
    `

    let [stackTag, setStackTag] = useState([]);

    useEffect(() => {
        if (props.from === 'project') {
            projectStackList().then(res => setStackTag(res.stacks))
        }
    }, [])
    
    return (
        <TagWrapper>
            {
                stackTag.map(name => {
                    return (
                        <Stack key={name} title={name}></Stack>
                    )
                })
            }
        </TagWrapper>
    )
}

export default StackTagList
