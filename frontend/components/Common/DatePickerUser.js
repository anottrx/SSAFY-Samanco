import { DesktopDatePicker } from '@mui/lab';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import dateFormat from 'dateformat';

export let getDateValue;

export default function DatePickerUser(props) {
  // console.log(props.value.initDate);
  const [dateValue, setDateValue] = useState(
    props.value.initDate
      ? props.value.initDate
      : new Date().toJSON().split('T')[0]
  );

  getDateValue = () => dateValue;

  const handleDateChange = (e, label) => {
    let result = e.toJSON().split('T')[0];
    setDateValue(result);
  };

  useEffect(() => {
    if (props.label.includes('시작')) {
      props.changeHandle(dateValue, 'startDate');
    } else if (props.label.includes('종료')) {
      props.changeHandle(dateValue, 'endDate');
    } else if (props.label.length == 0) {
      let birthday;
      // console.log(dateValue);
      if (dateValue.length != 10) {
        setDateValue(new Date().toJSON().split('T')[0]);
        birthday =
          dateValue.slice(2, 4) +
          dateValue.slice(5, 7) +
          dateValue.slice(8, 11);
      } else {
        birthday = dateFormat(dateValue, 'yymmdd');
      }

      props.changeHandle(birthday, 'birthday');
      props.changeHandle(birthday, 'value');
    }
  }, [dateValue]);

  return (
    <Datepicker
      label={props.label}
      handleDateChange={handleDateChange}
      value={dateValue}
    ></Datepicker>
  );

  function Datepicker(props) {
    return (
      <DesktopDatePicker
        //  label={props.label}
        inputFormat="yyyy/MM/dd"
        value={props.value}
        mask="____/__/__"
        onChange={(e) => props.handleDateChange(e, props.label)}
        renderInput={(params) => <TextField {...params} />}
        inputProps={{
          style: {
            height: 35,
            padding: '0 14px',
          },
        }}
      />
    );
  }
}
