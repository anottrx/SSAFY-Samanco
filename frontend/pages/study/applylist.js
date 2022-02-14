import Layout from '../../components/Layout';
import ApplyAccordion from '../../components/Club/ApplyAccordion';
import * as applyActions from '../../store/module/apply';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect } from 'react';
import { getStudyUserByjoin, approveStudy } from '../../pages/api/study';

import Head from 'next/head';

function ApplyList() {
  const detail = useSelector(({ study }) => study.studyDetail);
  const applyData = useSelector(({ apply }) => apply.applyList);
  const [reloadCondition, setReloadCondition] = useState(false);
  const dispatch = useDispatch();

  function fetchData() {
    getStudyUserByjoin({
      studyId: detail.id,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        console.log(res);
        dispatch(applyActions.setApplyList({ list: res.users }));
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
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
      <Head>
        <title>스터디 지원자 목록 | 싸피사만코</title>
      </Head>
      <h2>지원자 목록 조회</h2>
      <ApplyAccordion
        applyData={applyData}
        approveAPI={approveStudy}
        clubId={detail.id}
        from="study"
        setReloadCondition={setReloadCondition}
      ></ApplyAccordion>
    </Layout>
  );
}

export default ApplyList;
