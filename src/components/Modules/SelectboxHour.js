import React, { useState } from "react";

function SelectboxHour(props) {
    const [isOpen, setOpen] = useState(false);
    const [selected_hour, setHour] = useState(new Date(Date.now()).getHours());
    const hourlist = [];
    for (var i = 0; i < 24; i++) {
      hourlist.push(i);
    }
  
    function select_hour(h) {
      setHour(h);
      setOpen(false);
    }
  
    function open_selector() {
      setOpen(!isOpen);
      document.querySelector(".dim").style.display = "block";
      document
        .querySelector(".dim")
        .addEventListener("click", background_listner);
  
      function background_listner() {
        setOpen(false);
        document.querySelector(".dim").style.display = "none";
        document
          .querySelector(".dim")
          .removeEventListener("click", background_listner);
      }
    }
  
    const list = hourlist.map((hour, index) => {
      return (
        <div className="hour_items" key={index} onClick={() => select_hour(hour)}>
          <p>{hour}</p>
        </div>
      );
    });
    return (
      <div className="selectbox_hour">
        <input type="hidden" name="selectedHour" value={selected_hour}></input>
        <a className="selected_hour" onClick={() => open_selector()}>
          {selected_hour} hr
        </a>
        <div className={isOpen ? "hourpicker_pop open" : "hourpicker_pop"}>
          {list}
        </div>
      </div>
    );
  }

  export default SelectboxHour;