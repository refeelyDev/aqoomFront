import React from 'react';
import Axios from 'axios';
import timezone from '../../timezone';
import '../../style/css/Settings.min.css';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tz_cur: timezone[0],
            isOpenModal: false,
            tz_lists: [],
            cur_pos: 0,
            isSuccess: false
        }
    }

    handle_tz(index) {
        this.setState({tz_cur: timezone[index], isOpenModal: false, cur_pos: index})
    }

    toggleTZPicker() {
        this.setState({isOpenModal: !this.state.isOpenModal})
        document.querySelector(".dim").style.display = "block";
        document
          .querySelector(".dim")
          .addEventListener("click", () => background_listner.call(this))
    
        function background_listner() {
            this.setState({isOpenModal: false})
          document.querySelector(".dim").style.display = "none";
          document
            .querySelector(".dim")
            .removeEventListener("click", () => background_listner.call(this));
        }
    }

    releaseSuccessMsg() {
        this.setState({isSuccess: false})
    }

    componentDidMount() {
        this.setState({
            tz_lists: timezone.map((tz, index) => {
                return (
                    <p className="tz_item" data-tzid={index} onClick={() => this.handle_tz(index)}>
                        {tz.text}
                    </p>
                )
            })
        })   
        Axios.post('/getTimezone', {
            chat_id: window.localStorage.getItem('chat_id')
        }).then(res => {
            if (res.data) {
                this.setState({tz_cur: timezone[res.data[0].tz_pos]});
            }
        }) 
    }

    setTimezone() {
        Axios.post('/setTimezone', {
            chat_id: window.localStorage.getItem('chat_id'),
            offset: this.state.tz_cur.offset,
            timezone: JSON.stringify(this.state.tz_cur.utc),
            position: this.state.cur_pos
        }).then(res => {
            if (res.data) {
                window.localStorage.setItem('tz_set', res.data);
                this.setState({isSuccess: true})

                setTimeout(() => {
                    this.setState({isSuccess: false})
                }, 2000);
            }
        })
    }

    render() {
        return (
            <div className="setting_section">
                <div className={this.state.isSuccess ? 'msg_success is_success' : 'msg_success'}>
                    <p>
                    Settings have been saved
                    </p>
                </div>
                <h2 className="seg_title">
                    Settings
                </h2>
                <div className="tz_setting">
                    <h4>
                    Time Zone
                    </h4>
                    <div className="tz_selection">
                        <span>
                        Select Timezone:
                        </span>
                        <div className="tz_picker">
                            <a onClick={() => this.toggleTZPicker()}>
                                {this.state.tz_cur.text}
                            </a>
                            <div className={this.state.isOpenModal ? 'tz_lists open' : 'tz_lists'}>
                                {this.state.tz_lists}
                            </div>
                        </div>
                        <a className="tz_set_btn" onClick={() => this.setTimezone()}>
                            Set
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings;