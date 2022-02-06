import Layout from "../../components/Layout"
import ApplyAccordion from "../../components/Club/ApplyAccordion"
import * as applyActions from '../../store/module/apply';

import { useSelector, useDispatch } from 'react-redux';
import { useLayoutEffect } from "react"
import { getStudyUserByjoin, approveStudy } from "../../pages/api/study"

function ApplyList() {
    const detail = useSelector(({ study }) => study.studyDetail);
    const applyData = useSelector(({ apply }) => apply.applyList);
    const dispatch = useDispatch();
    
    useLayoutEffect(() => {
        getStudyUserByjoin({
        studyId: detail.id,
        userId: sessionStorage.getItem("userId")
        })
        .then(res => { 
            dispatch(applyActions.setApplyList({list: res.users}))
        })
        .catch(err => console.log(err))
    }, []);

    return (
        <Layout>
            <h2>지원자 목록 조회</h2>
            <ApplyAccordion 
                applyData={applyData}
                approveAPI={approveStudy}
                clubId={detail.id}
                from="study"
            ></ApplyAccordion>
        </Layout>
    )
}

export default ApplyList