import React from 'react';
import Axios from 'axios';

function Switch (props) {
    return (
        <div className="filter_switch">
            <label htmlFor={props.name}>
                <input type="checkbox" className="filter_sw" name={props.name} id={props.name} onChange={() => props.changePermission()} defaultChecked={props.is_active}></input>
                <div className="custom_chbox"></div>
                <div className="custom_chbox_circle"></div>
            </label>
        </div>
    )
}

class UserManagerUserRestriction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restrictions: []
        }
    }

    componentDidMount() {
        this.getRestrictions();
    }

    getRestrictions() {
        Axios.post('/getRestriction', {
            chat_id: window.localStorage.getItem('chat_id')
        }).then((res) => {
            if (res.data) {
                this.setState({
                    restrictions: res.data[0]
                })
            }
        })
    }

    restrict_bot () {
        const status = document.forms[0].restrict_adding_bot.checked;

        Axios.post('/setRestriction', {
            chat_id: window.localStorage.getItem('chat_id'),
            restrictions: {
                bot: status ? 1 : 0
            }
        })
    }

    restrict_invite_user() {
        const status = document.forms[0].restrict_adding_user.checked;

        Axios.post(`https://api.telegram.org/bot${this.props.botId}/setChatPermissions`, {
            chat_id: window.localStorage.getItem('chat_id'),
            permissions: {
                can_invite_users: status
            }
        }).then(res => {
            if (res.data.ok) {
                Axios.post('/setRestriction', {
                    chat_id: window.localStorage.getItem('chat_id'),
                    restrictions: {
                        invite: status ? 1 : 0
                    }
                })
            }
        })
    }

    restrict_capcha() {

    }

    restrict_mute() {
        const status = document.forms[0].restrict_mute.checked;

        Axios.post('/setRestriction', {
            chat_id: window.localStorage.getItem('chat_id'),
            restrictions: {
                new_member: status ? 1 : 0
            }
        })
    }

    render() {
        return (
            <div className="user_restriction_section">
                <h4>New Members</h4>
                <p>Set restrictions to new members that joined the chat group. Usually, spams are coming from new members who joins the room and then leave right away.</p>
                <form>
                    <div className="restriction_common">
                        <div className="restriction_module">
                            <p>Restrict non-admins adding bots to the group</p>
                            <Switch name="restrict_adding_bot" changePermission={this.restrict_bot.bind(this)} is_active={this.state.restrictions.is_block_bot}></Switch>
                        </div>
                        <div className="restriction_module">
                            <p>Restrict members to invite new members in to the group</p>
                            <Switch name="restrict_adding_user" changePermission={this.restrict_invite_user.bind(this)} is_active={this.state.restrictions.is_block_invite}></Switch>
                        </div>
                        <div className="restriction_module">
                            <p>Require Captcha for New Members (preparing)</p>
                            <Switch name="restrict_capcha" changePermission={this.restrict_capcha} is_active={false}></Switch>
                        </div>
                    </div>
                    <div className="restriction_new_member">
                        <div className="restriction_module">
                            <p>Restrict New Members’ activity after joining the room</p>
                            <Switch name="restrict_mute" changePermission={this.restrict_mute} is_active={this.state.restrictions.is_restrict_new_member}></Switch>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default UserManagerUserRestriction;