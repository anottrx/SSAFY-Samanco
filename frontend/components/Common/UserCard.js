import StackItem from "../Common/Stack/item"
import StackLevelList from "../Common/Stack/StackLevelList"
import { Card, Avatar, Link, IconButton, Tooltip } from "@mui/material"
import styled from "@emotion/styled"
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';

import { quitProject } from "../../pages/api/project"

export default function UserCard({user, projectId, hostId}) {
    const CusCard = styled(Card)`
        width: fit-content;
        padding: 10px;

        & .card-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        & .user-name {
            font-size: 14px;
            margin: 0px 10px;
        }

        & .linkWrapper a, .linkWrapper a:visited{
          font-size: 12px;
          color: #1976d2;
        }
  
        & .linkWrapper a:hover{
          color: #0342A2;
        }

        & .row{
            display: flex;
            flex-direction: row;
        }

        & .user-position {
            font-size: 14px;
            border: 1px solid gray;
            border-radius: 5px;
            padding: 3px;
            text-align: center;
        }
    `

    return (
        <CusCard>
            <div className="card-header">
                <div className="row">
                    <Avatar sx={{ width: 24, height: 24 }} variant="square">{user.nickname[0]}</Avatar>
                    <span className="user-name">{user.nickname}</span>
                </div>
                {
                    sessionStorage.getItem("userId") == hostId? 
                    <Tooltip title="내보내기" placement="top">
                    <IconButton onClick={() => {
                        // 유저 탈퇴시키기
                        quitProject({
                            userId: user.id, 
                            projectId: projectId})
                    }}>
                        <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                    :null
                }
            </div>
            <div className="card-content">
                {
                    user.link? 
                    <div className="linkWrapper">
                        <Link underline="none" href={user.link} target="_blank">
                        <LinkIcon />{user.link}</Link>
                    </div>
                    : null
                }
                {
                    user.stacks?
                    <StackLevelList items={user.stacks}></StackLevelList>
                    :null
                }
                {/* <StackItem title={user.projectPosition}></StackItem> */}
                <div className="user-position">{user.projectPosition}</div>
            </div>

        </CusCard>
    )
}