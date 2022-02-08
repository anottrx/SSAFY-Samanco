import Layout from '../../components/Layout';
import ApplyAccordion from '../../components/Club/ApplyAccordion';
import * as applyActions from '../../store/module/apply';

import { useSelector, useDispatch } from 'react-redux';
import { useLayoutEffect } from 'react';
import { getProjectUserByjoin, approveProject } from '../../pages/api/project';

function ApplyList() {
  const detail = useSelector(({ project }) => project.projectDetail);
  const applyData = useSelector(({ apply }) => apply.applyList);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    getProjectUserByjoin({
      projectId: detail.id,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        dispatch(applyActions.setApplyList({ list: res.users }));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <h2>지원자 목록 조회</h2>
      <ApplyAccordion
        applyData={applyData}
        approveAPI={approveProject}
        clubId={detail.id}
        from="project"
      ></ApplyAccordion>
    </Layout>
  );
}

export default ApplyList;
