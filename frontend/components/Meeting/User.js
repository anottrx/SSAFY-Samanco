import { Skeleton, Grid, Card, Fab, Box } from "@mui/material"
import styled from "@emotion/styled";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MicIcon from '@mui/icons-material/Mic';

function User() {

    const VideoWrapper = styled(Skeleton)`
        min-height: 300px;
        max-width: 380px;
        min-width: 300px;
    `

    const CusGrid = styled(Grid)`
        width: 100%;
        justify-content: center;

        & .MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-10.MuiGrid-grid-md-6.css-745qxe-MuiGrid-root{
            height: 250px;
            transform: translate(0px, -70px);
        }
    `

    let userList = [0, 0, 0]

    return (
        <Grid>
            <CusGrid container>
                {
                    userList.map((user, index) => {
                        return (
                            <Grid item xs={12} sm={10} md={6} key={index}>
                                <VideoWrapper height={350}></VideoWrapper>
                                <UserName></UserName>
                            </Grid>
                        )
                    })
                }
            </CusGrid>
            <Operation></Operation>
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

function Operation(){
    const OperWrapper = styled.div`
        float: left;
    `
    
    return(
        <OperWrapper>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab variant="extended" aria-label="add">
                <CameraAltIcon fontSize="large" />
            </Fab>
            <Fab variant="extended" aria-label="edit">
                <MicIcon fontSize="large" />
            </Fab>
            </Box>
        </OperWrapper>
    )
}

export default User;