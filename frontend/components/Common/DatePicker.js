import {DesktopDatePicker, } from '@mui/lab';
import { useState, useEffect } from "react";
import { TextField } from '@mui/material';
import dateFormat, { masks } from "dateformat";

export let getDateValue;

export default function DatePicker(props){
    
    const [dateValue, setDateValue] = useState(
        props.initDate?
        props.initDate
        :
        new Date().toJSON().split("T")[0]
    );

    getDateValue = () => dateValue;
    
    const handleDateChange = (e, label) => {
        let result = e.toJSON().split("T")[0];
        setDateValue(result)
    };

    useEffect(() => {
        if (props.label.includes("시작")) {
            props.changeHandle(dateValue,"startDate")
        } else if (props.label.includes("종료")) {
            props.changeHandle(dateValue,"endDate")
        } else if(props.label.length == 0) {
            const birthday = dateFormat(dateValue, "yymmdd")
            props.changeHandle(birthday, "birthday")
        }
    }, [dateValue])

    return (
        <Datepicker 
            label={props.label} 
            handleDateChange={handleDateChange} 
            value={dateValue}>
        </Datepicker>
    )

    function Datepicker(props){
        return (
         <DesktopDatePicker
             label={props.label}
             inputFormat="yyyy/MM/dd"
             value={props.value}
             mask="____/__/__"
             onChange={(e) => props.handleDateChange(e, props.label)}
             renderInput={(params) => <TextField {...params} />}
             />
        )
    }
}