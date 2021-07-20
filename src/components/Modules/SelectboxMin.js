import React, { useState } from "react";

function SelectboxMin(props) {
    const [isOpen, setOpen] = useState(false);
    const [selected_hour, setHour] = useState(new Date(Date.now()).getMinutes());
    const minlist = [];
    for (var i = 0; i < 60; i++) {
      minlist.push(i);
    }
  
    function select_min(m) {
      setHour(m);
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
  
    const list = minlist.map((min, index) => {
      return (
        <div className="min_items" onClick={() => select_min(min)} key={index}>
          <p>{min}</p>
        </div>
      );
    });
    return (
      <div className="selectbox_min">
        <input type="hidden" name="selectedMin" value={selected_hour}></input>
        <a className="selected_min" onClick={() => open_selector()}>
          {selected_hour} min
        </a>
        <div className={isOpen ? "minpicker_pop open" : "minpicker_pop"}>
          {list}
        </div>
      </div>
    );
  }

  export default SelectboxMin;