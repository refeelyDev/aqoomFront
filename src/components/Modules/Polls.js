import React, {useState} from 'react';
import Axios from 'axios';
import SelectboxDate from './SelectboxDate';
import SelectboxHour from './SelectboxHour';
import SelectboxMin from './SelectboxMin';

function Poll_Table_Row_Input (props) {
    return (
        <div className="poll_tb_row">
            <p className="poll_label">
                {props.title}:
            </p>
            <input className="poll_input" name={props.name} placeholder="What is the best company?"></input>
        </div>
    )
}

function Poll_Table_Row_Select (props) {
    var [cur_item, set_cur_item] = useState('Multiple Choice');
    var [is_open, set_is_open] = useState(false);

    return (
        <div className="poll_tb_row">
            <input type="hidden" name="poll_type" value={cur_item}></input>
            <p className="poll_label">
                {props.title}:
            </p>
            <div className="poll_selector" onClick={() => set_is_open(!is_open)}>
                {cur_item}
            </div>
            <div className={is_open ? 'poll_select_list active' : 'poll_select_list'}>
                <p onClick={() => {set_cur_item('Multiple Choice'); set_is_open(false)}}>
                Multiple Choice
                </p>
                <p onClick={() => {set_cur_item('Single Choice'); set_is_open(false)}}>
                Single Choice
                </p>
            </div>
        </div>
    )
}

function Poll_Table_Row_Dates (props) {
    return (
        <div className="poll_tb_row">
            <p className="poll_label">
                {props.title}:
            </p>
            <div className="selectbox_wrap">
                <div className="set_of_timeset">
                    <SelectboxDate></SelectboxDate>
                    <SelectboxHour></SelectboxHour>
                    <SelectboxMin></SelectboxMin>
                </div>            
            </div>
        </div>
    )
}

function Poll_Table_Row_Response (props) {
    const [option_cnt, set_option_cnt] = useState(3);

    function append_row_option() {
        const el_input = document.createElement('input');
        el_input.setAttribute('name', `poll_opt${option_cnt}`);
        el_input.setAttribute('placeholder', `option ${option_cnt}`);

        const el_response_wrap = document.querySelector('.poll_response_wrap')
        el_response_wrap.appendChild(el_input);
        set_option_cnt(option_cnt + 1);
    }

    return (
        <div className="poll_tb_row">
            <p className="poll_label">
                {props.title}:
            </p>
            <div className="poll_response_wrap">
                <input name="poll_opt1" placeholder="option 1"></input>
                <input name="poll_opt2" placeholder="option 2"></input>
            </div>
            <div className="add_option_wrap">
                <span className="icon_add_btn" onClick={() => append_row_option()}></span>
                <span>Add another option</span>
            </div>
        </div>
    )
}

class Polls extends React.Component {
    constructor(props) {
        super(props);
    }

    registerPoll() {
        const options = document.querySelectorAll('input[name^=poll_opt]');
        let response = [];

        for (var res of options) {
            response.push(res.value);    
        }
        
        const dataset = {
            question: document.forms[0].poll_question.value,
            type: document.forms[0].poll_type.value,
            close: {
                date: document.forms[0].selectedDate.value,
                hour: document.forms[0].selectedHour.value,
                min: document.forms[0].selectedMin.value,
            },
            response: JSON.stringify(response)
        }

        // Axios.post('/setPoll', dataset)
        //     .then((res) => {

        //     })
    }

    render() {
        return (
            <div className="poll_section">
                <h4>Create a Poll</h4>
                <form className="poll_tb">
                    <Poll_Table_Row_Input name={'poll_question'} title={'Question'}></Poll_Table_Row_Input>
                    <Poll_Table_Row_Select name={'poll_question'} title={'Type of Response'}></Poll_Table_Row_Select>
                    <Poll_Table_Row_Dates name={'poll_question'} title={'Closing Time'}></Poll_Table_Row_Dates>
                    <Poll_Table_Row_Response name={'poll_question'} title={'Response'}></Poll_Table_Row_Response>
                    <div className="poll_tb_row poll_buttons_wrap">
                        <div></div>
                        <div>
                            <a
                                className="send_btn"
                                onClick={() => this.registerPoll()}
                            >
                                Save
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Polls;