import Layout from "../../components/layout"
import ApplyAccordion from "../../components/Club/ApplyAccordion"
import ApplyData from "../../data/applyData.json"

function ApplyList() {
    return (
        <Layout>
            <h2>지원자 목록 조회</h2>
            <ApplyAccordion applyData={ApplyData}></ApplyAccordion>
        </Layout>
    )
}

export default ApplyList