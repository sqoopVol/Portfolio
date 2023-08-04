import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import '../style.css';

const TableCell = ({grade, date, disableEdit, isSave, Callback}) => {

    const [value, setValue] = useState("");
    const [isIncorrect, setIsIncorrect] = useState(false);

    useEffect(() => {
        if (grade.grade !== "")
            setValue(grade.grade);
    }, [grade]);

    useEffect(() => {
        if (disableEdit)
            setIsIncorrect(false);
    }, [disableEdit])

    useEffect(() => {
        if ((value !== grade.grade) || (isIncorrect)) {
            grade.grade = value;
            Callback(grade, new Date(date).toISOString());
        }
    }, [value]);

    useEffect(() => {
            if (value !== "" && value !== "2" && value !== "3" && value !== "4" && value !== "5" && value !== "н/б" && value !== "о")
                setIsIncorrect(true);
            else
                setIsIncorrect(false);
    }, [isSave]);

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return (
      <div className={isIncorrect ? "table_cell incorrect" : 'table_cell'}>
          <input type="text" disabled={disableEdit} value={value} onChange={handleChange}/>
      </div>
  )
}

export default TableCell;