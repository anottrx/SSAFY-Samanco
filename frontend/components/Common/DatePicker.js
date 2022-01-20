import {DesktopDatePicker, } from '@mui/lab';
import { useState } from "react";
import { TextField } from '@mui/material';

export let getDateValue;

export default function DatePicker(props){
    const [dateValue, setDateValue] = useState(new Date());

    getDateValue = () => dateValue;
    
    const dateHandleChange = (e, label) => {
        let result = e.toJSON().split("T")[0];
        setDateValue(result)
    };

    return (
        <Datepicker 
            label={props.label} 
            dateHandleChange={dateHandleChange} 
            value={dateValue}>
        </Datepicker>
    )

    function Datepicker(props){
        return (
         <DesktopDatePicker
             label={props.label}
            //  inputFormat="yyyy/MM/dd"
             inputFormat="dd/MM/yyyy"
             value={props.value}
             onChange={(e) => props.dateHandleChange(e, props.label)}
             renderInput={(params) => <TextField {...params} />}
             />
        )
    }
}