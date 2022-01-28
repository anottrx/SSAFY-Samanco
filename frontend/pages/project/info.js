import Layout from "../../components/layout";
import { useSelector } from 'react-redux';

function ProjectInfo(){
    let clubData = useSelector(({ project }) => project.myProject);
    return (
        <Layout>
            <h1>My Project</h1>
            {
                Object.keys(clubData).map((key, index) => {
                    let value = JSON.stringify(clubData[key]);
                    return (
                        <div key={index}>{key} : {value}</div>
                    )
                })
            }
        </Layout>
    )
}

export default ProjectInfo