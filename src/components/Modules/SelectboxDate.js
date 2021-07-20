import React, { useState } from "react";
import "react-daypicker/lib/DayPicker.css";
import DayPicker from "react-daypicker";

function SelectboxDate(props) {
    const [date, setDate] = useState("");
    const [isOpen, setIsOpen] = useState(false);
  
    function getFormattedDate() {
      if (date) {
        const yy = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
  
        return `${yy}-${mm}-${dd}`;
      } else {
        const today = new Date(Date.now());
        const yy = today.getFullYear();
        const mm = today.getMonth() + 1;
        const dd = today.getDate();
  
        return `${yy}-${mm}-${dd}`;
      }
    }
  
    function toggleDatePicker(day) {
      setDate(day);
      setIsOpen(false);
    }
  
    return (
      <div className="selectbox_date">
        <input
          type="hidden"
          name="selectedDate"
          value={getFormattedDate()}
        ></input>
        <a className="selected_date" onClick={() => setIsOpen(!isOpen)}>
          {getFormattedDate()}
        </a>
        <div className={isOpen ? "datepicker_pop open" : "datepicker_pop"}>
          <DayPicker onDayClick={day => toggleDatePicker(day)} />
        </div>
      </div>
    );
  }

  export default SelectboxDate;