import StackItem from '../Common/Stack/item';
import StackLevelList from '../Common/Stack/StackLevelList';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2';

import styled from '@emotion/styled';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';

import { quitProject } from '../../pages/api/project';
import { quitStudy } from '../../pages/api/study';

export default function UserCard({
  user,
  clubId,
  hostId,
  from,
  setReloadCondition,
}) {
  const CusCard = styled(Card)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: fit-content;
    min-width: 200px;
    min-height: 150px;
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 10px;

    & .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    & .user-name {
      font-size: 14px;
      margin: 0px 10px;
    }

    & .linkWrapper a,
    .linkWrapper a:visited {
      font-size: 12px;
      color: #1976d2;
    }

    & .linkWrapper a:hover {
      color: #0342a2;
    }

    & .row {
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
    & .user-content {
      font-size: 12px;
    }
  `;

  return (
    <CusCard>
      <div className="card-header">
        <div className="row">
          <Avatar sx={{ width: 24, height: 24 }} variant="square">
            {user.nickname[0]}
          </Avatar>
          <span className="user-name">{user.nickname}</span>
        </div>
        {sessionStorage.getItem('userId') == hostId ? (
          <Tooltip title="내보내기" placement="top">
            <IconButton
              onClick={() => {
                // 유저 탈퇴시키기
                Swal.fire({
                  title: '유저 탈퇴 진행 중입니다',
                  showConfirmButton: false,
                  didOpen: () => {
                    Swal.showLoading();
                    switch (from) {
                      case 'project':
                        quitProject({
                          userId: user.id,
                          // clubId: clubId,
                          projectId: clubId
                        }).then((res) => {
                          if (res.statusCode == 200) {
                            // alert('해당 유저를 내보냈습니다.');
                            Swal.fire({
                              title: '해당 유저를 내보냈습니다.',
                              icon: 'success',
                              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                            }).then(() => {
                              setReloadCondition(true);
                            });
                          } else {
                            // alert(`${res.data.message}`);
                            Swal.fire({
                              icon: 'error',
                              title: res.data.message,
                              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                            });
                          }
                        });
                        break;
                      case 'study':
                        quitStudy({
                          userId: user.id,
                          studyId: clubId,
                        }).then((res) => {
                          if (res.statusCode == 200) {
                            // alert('해당 유저를 내보냈습니다.');
                            Swal.fire({
                              title: '해당 유저를 내보냈습니다.',
                              icon: 'success',
                              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                            }).then(() => {
                              setReloadCondition(true);
                            });
                            // setReloadCondition(true);
                          } else {
                            // alert(`${res.data.message}`);
                            Swal.fire({
                              icon: 'error',
                              title: res.data.message,
                              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                            });
                          }
                        });
                        break;
                      default:
                        break;
                    }
                  },
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <div className="card-content">
        {user.description ? (
          <div>{user.description}</div>
        ) : (
          <div className="user-content">작성된 자기소개가 없어요.</div>
        )}
        {user.link ? (
          <div className="linkWrapper">
            <Link underline="none" href={user.link} target="_blank">
              <LinkIcon />
              {user.link}
            </Link>
          </div>
        ) : (
          <div className="user-content">
            <LinkIcon />
            등록된 링크가 없습니다.
          </div>
        )}
        {user.stacks ? (
          <StackLevelList items={user.stacks}></StackLevelList>
        ) : (
          <div className="user-content">등록된 스택이 없습니다.</div>
        )}
        {from == 'project' ? (
          <div className="user-position">{user.projectPosition}</div>
        ) : null}
      </div>
    </CusCard>
  );
}
