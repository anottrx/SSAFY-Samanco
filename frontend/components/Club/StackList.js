
import StackItem from "../Common/Stack/item"

export default function StackList(props) {
    return(
        <div>
        {  
            Object.values(props.stackData).map((data, index) => {
                let stack = data.name;
                return (
                    <StackItem title={stack} key={index}></StackItem>
                )
            })
        }
        </div>
    )
}