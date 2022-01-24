import { Skeleton, Grid } from "@mui/material"
import styled from "@emotion/styled";

function User() {

    const VideoWrapper = styled(Skeleton)`
        min-height: 300px;
        max-width: 380px;
        min-width: 300px;
    `

    let userList = [0, 0]

    return (
        <Grid container>
            {
                userList.map((user, index) => {
                    return (
                        <Grid item xs={12} sm={6} key={index}>
                            <VideoWrapper height={350}></VideoWrapper>
                            <UserName></UserName>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}

function UserName() {
    const NameWrapper = styled.div`
        transform: translate(10px, -90px);
    `

    return (
        <NameWrapper>닉네임</NameWrapper>
    )
}

export default User;