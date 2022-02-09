import Layout from '../../components/Layout';
import ApplyAccordion from '../../components/Club/ApplyAccordion';
import * as applyActions from '../../store/module/apply';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useLayoutEffect, useState } from 'react';
import { getProjectUserByjoin, approveProject } from '../../pages/api/project';

function ApplyList() {
  const detail = useSelector(({ project }) => project.projectDetail);
  const applyData = useSelector(({ apply }) => apply.applyList);
  const [reloadCondition, setReloadCondition] = useState(false);
  const dispatch = useDispatch();

  function fetchData() {
    getProjectUserByjoin({
      projectId: detail.id,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        dispatch(applyActions.setApplyList({ list: res.users }));
      })
      .catch((err) => console.log(err));
  }

  useLayoutEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (reloadCondition) {
      fetchData();
      setReloadCondition(false);
    }
  }, [reloadCondition]);

  return (
    <Layout>
      <h2>지원자 목록 조회</h2>
      <ApplyAccordion
        applyData={applyData}
        approveAPI={approveProject}
        clubId={detail.id}
        from="project"
        setReloadCondition={setReloadCondition}
      ></ApplyAccordion>
    </Layout>
  );
}

export default ApplyList;
