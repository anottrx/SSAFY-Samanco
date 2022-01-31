import StackTagListData from "../../data/StackTagListData.json"
import Stack from "../Common/Stack/item"
import styled from "@emotion/styled"
import { useEffect, useState } from "react";
import { projectStackList } from "../../pages/api/project"
import { studyStackList } from "../../pages/api/study"

function StackTagList(props) {
    const TagWrapper = styled.div`
        width: 100%;
        margin: 10px 0px;
    `

    let [stackTag, setStackTag] = useState([]);

    useEffect(() => {
        switch (props.from) {
            case "project":
                projectStackList().then(res => setStackTag(res.stacks))
                break;
            case "study":
                studyStackList().then(res => setStackTag(res.stacks))
                break;
            default:
                break;
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
