import StackItem from "../../components/Common/Stack/item"
import StackLevelList from "../../components/Common/Stack/StackLevelList"

import { Accordion, AccordionSummary, AccordionDetails, Typography, Skeleton, Stack, Link, ButtonGroup, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';

function ApplyAccordion(props) {
    const SummaryWrapper = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;

      & > p {
        font-weight: bolder;
        margin-right: 10px;
      }
    `
    const ProfileWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;

      & :first-of-type {
        margin-right: 10px;
      }

      & .linkWrapper a, .linkWrapper a:visited{
        font-size: 12px;
        color: #1976d2;
      }

      & .linkWrapper a:hover{
        color: #0342A2;
      }
    `

    const ButtonWrapper = styled(ButtonGroup)`
      display: flex;
      justify-content: flex-end;
    `

    return (
        <div>
          {
            props.applyData.map(data => {
              return(
                <Accordion key={data.no}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <SummaryWrapper>
                      <Typography>{data.nickname}</Typography>
                      <StackItem title={data.position}></StackItem>
                    </SummaryWrapper>
                  </AccordionSummary>

                  <AccordionDetails>
                    <ProfileWrapper>
                      <Skeleton variant="circular" width={100} height={100} />
                      <Stack>
                        <Typography>{data.description}</Typography>
                        {
                          data.links.map(link => {
                            return (
                              <div className="linkWrapper">
                                <Link underline="none" href={link.url} target="_blank">
                                <LinkIcon />{link.url}</Link>
                              </div>
                            )
                          })
                        }
                      </Stack>
                      

                    </ProfileWrapper>
                    <StackLevelList items={data.stacks}></StackLevelList>

                    <ButtonWrapper className="btnGroup" variant="outlined" aria-label="outlined button group">
                      <Button><CheckIcon/></Button>
                      <Button><CloseIcon/></Button>
                    </ButtonWrapper>

                  </AccordionDetails>
                </Accordion>
              )
            })
          }
    </div>
    )
}

export default ApplyAccordion;