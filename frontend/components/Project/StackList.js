
import StackItem from "../../components/Common/Stack/item"

export default function StackList(props) {
    return(
        <div>
        {
            Object.values(props.stackData).map((data, index) => {
                let stack = Object.keys(data)[0];
                return (
                    <StackItem title={stack} key={index}></StackItem>
                )
            })
        }
        </div>
    )
}