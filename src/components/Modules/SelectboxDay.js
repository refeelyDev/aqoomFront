import React, { useState } from "react";

function SelectboxDay(props) {
    const [day, setDay] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
  
    function decide_inout(el) {
      if (el) {
        if (day.findIndex(element => element === el) !== -1) {
          const idx = day.findIndex(element => element === el);
          if (idx === 0 || idx === day.length - 1) {
            if (idx === 0) {
              day.shift();
              setDay(day);
            } else if (idx === day.length - 1) {
              day.pop();
              setDay(day);
            }
          } else {
            const sep_left = day.slice(0, idx);
            const sep_right = day.slice(idx + 1);
            const result = sep_left.concat(sep_right);
            setDay(result);
          }
        } else {
          setDay([...day, el]);
        }
      }
    }
  
    const list = days.map(item => {
      return (
        <div className="day_item">
          <label className="day_name">{item}</label>
          <input
            type="checkbox"
            className="day_check"
            multiple
            onChange={() => decide_inout(item.substr(0, 3))}
          ></input>
        </div>
      );
    });
    return (
      <div className="selectbox_day">
        <input
          type="hidden"
          name="selectedDay"
          value={JSON.stringify(day)}
        ></input>
        <a className="selected_date" onClick={() => setIsOpen(!isOpen)}>
          {day.toString()}
        </a>
        <div className={isOpen ? "daypicker_pop open" : "daypicker_pop"}>
          {list}
        </div>
      </div>
    );
  }

  export default SelectboxDay;