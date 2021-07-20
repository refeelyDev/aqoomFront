import React from 'react';
import '../../style/css/TabMenu.min.css';

function changeTab(event) {
    document.querySelector('div[class^=opt].active').classList.remove('active');
    event.currentTarget.classList.add('active');
    return false;
}

function TabMenu (props) {
return (
        <div className="tab_wrap">
            <div className="opt_1 active" onClick={(ev) => {changeTab(ev); props.active_tab(1)}}>
                <p>
                    {props.opt1}
                </p>
            </div>
            <div className="opt_2" onClick={(ev) => {changeTab(ev); props.active_tab(2)}}>
                <p>
                    {props.opt2}
                </p>
            </div>
            <div className="opt_3" onClick={(ev) => {changeTab(ev); props.active_tab(3)}}>
                <p>
                    {props.opt3}
                </p>
            </div>
            <div className="opt_4" onClick={(ev) => {changeTab(ev); props.active_tab(4)}}>
                <p>
                    {props.opt4}
                </p>
            </div>
        </div>
    )
}

export default TabMenu;