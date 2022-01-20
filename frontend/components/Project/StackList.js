
import StackItem from "../../components/Common/Stack/item"

export default function StackList(props) {
    return(
        <div>
        {
            props.stackData.map((data, index) => {
                return (
                    <StackItem title={data} key={index}></StackItem>
                )
            })
        }
        </div>
    )
}