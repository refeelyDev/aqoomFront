import React, {useState} from 'react';
import Axios from 'axios';
import "react-daypicker/lib/DayPicker.css";
import '../../style/css/PeoridPicker.min.css';
import DayPicker from "react-daypicker";

function PeoridPicker(props) {
    const [date_from, set_datefrom] = useState();
    const [isOpened_from, open_date_from] = useState(false)
    const [date_to, set_dateto] = useState();
    const [isOpened_to, open_date_to] = useState(false)

    function getFormattedDate_from() {
        if (date_from) {
            const yy = date_from.getFullYear();
            const mm = date_from.getMonth() + 1;
            const dd = date_from.getDate();
    
            return `${yy}-${mm}-${dd}`;
        } else {
            const today = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
            const yy = today.getFullYear();
            const mm = today.getMonth() + 1;
            const dd = today.getDate();
    
            return `${yy}-${mm}-${dd}`;
        }
    }

    function getFormattedDate_to() {
        if (date_to) {
            const yy = date_to.getFullYear();
            const mm = date_to.getMonth() + 1;
            const dd = date_to.getDate();
    
            return `${yy}-${mm}-${dd}`;
        } else {
            const today = new Date(Date.now());
            const yy = today.getFullYear();
            const mm = today.getMonth() + 1;
            const dd = today.getDate();
    
            return `${yy}-${mm}-${dd}`;
        }
    }

    function open_date_from_modal() {
        open_date_from(!isOpened_from);
        if(isOpened_to) {open_date_to(false)};

        document.querySelector(".dim").style.display = "block";
        document
        .querySelector(".dim")
        .addEventListener("click", background_listner.bind(this));
    
        function background_listner() {
            open_date_from(false);
            document.querySelector(".dim").style.display = "none";
            document
                .querySelector(".dim")
                .removeEventListener("click", background_listner.bind(this));
            }
    }

    function open_date_to_modal() {
        open_date_to(!isOpened_to);
        if(isOpened_from) {open_date_from(false)};

        document.querySelector(".dim").style.display = "block";
        document
        .querySelector(".dim")
        .addEventListener("click", background_listner.bind(this));
    
        function background_listner() {
            open_date_to(false);
            document.querySelector(".dim").style.display = "none";
            document
                .querySelector(".dim")
                .removeEventListener("click", background_listner.bind(this));
            }
    }

    return (
        <div className="changable_peorid_wrap">
            <span className="date_from" onClick={() => open_date_from_modal()}>
                {getFormattedDate_from()}
            </span>
            <div className={isOpened_from ? 'picker_datefrom open' : 'picker_datefrom'}>
                <DayPicker onDayClick={(day) => {set_datefrom(day); open_date_from(false);}}></DayPicker>
            </div>
            <span>
                to
            </span>
            <span className="date_to" onClick={() => open_date_to_modal()}>
                {getFormattedDate_to()}
            </span>
            <div className={isOpened_to ? 'picker_dateto open' : 'picker_dateto'}>
                <DayPicker onDayClick={(day) => {set_dateto(day); open_date_to(false)}}></DayPicker>
            </div>
            <a className="confirm_peorid" onClick={() => props.confirm_peorid(getFormattedDate_from(), getFormattedDate_to())}>
                GO
            </a>
        </div>
    )
}

export default PeoridPicker;