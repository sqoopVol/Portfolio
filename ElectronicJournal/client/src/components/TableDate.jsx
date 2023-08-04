import React from 'react'

const TableDate = ({date, dateCallback}) => {
  return (
    <div>
        {new Date(date.date).getDate().toString().length > 1 ?
        <span onClick={() => dateCallback(date)}>{new Date(date.date).getDate()}</span> : 
        <span onClick={() => dateCallback(date)}>{`0${new Date(date.date).getDate()}`}</span>}
    </div>
  )
}

export default TableDate;