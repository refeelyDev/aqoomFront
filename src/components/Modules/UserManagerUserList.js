import React from 'react';
import Axios from 'axios';
import SearchBox from './SearchBox';
import { Link } from 'react-router-dom';
import { Event } from '../Tracking';

class UserManagerUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: []
        }
    }

    searchMember(event) {
        const search_query = event.currentTarget.value;
        
        Axios.post('/searchMember', {
            chat_id: window.localStorage.getItem('chat_id'),
            query: search_query
        })
        .then((res) => {
            if (res.data) {
                this.updateMemberList(res.data);
                Event('UserManager', 'Search Member', 'member searching');
            }
        })
    }

    kickMember(userid, isBan) {
        const result = window.confirm('Are you sure to kick this user?')
        if (result) {
            const dataset = {
                chat_id: window.localStorage.getItem('chat_id'),
                user_id: userid
            }
    
            if (isBan) {
                dataset['until_date'] = Date.now() + 1000;
                Event('UserManager', 'adjust member status', 'ban member');
            } else {
                Event('UserManager', 'adjust member status', 'kick member');
            }
    
            Axios.post(`https://api.telegram.org/bot${this.props.botId}/kickChatMember`, dataset)
                .then((res) => {
                    Axios.post('/deleteUser', dataset)
                        .then(() => {
                            this.getMemberList()
                        })
                    Axios.post('/pushEventBotActivity', {
                        chat_id: dataset.chat_id,
                        event: 'kick'
                    })
                })
        }
    }
    
    restrictMember(userid) {
        const result = window.confirm('Are you sure to restrict this user?')
        if (result) {
            const dataset = {
                chat_id: window.localStorage.getItem('chat_id'),
                user_id: userid,
                permissions: {
                    can_send_messages: false,
                    can_send_media_messages : false,
                    can_send_polls: false,
                    can_send_other_messages: false,
                    can_pin_messages: false,
                    can_change_info: false
                },
                until_date: 300000
            }

            Axios.post(`https://api.telegram.org/bot${this.props.botId}/restrictChatMember`, dataset)
                .then((res) => {
                    Axios.post('/pushEventBotActivity', {
                        chat_id: dataset.chat_id,
                        event: 'restrict'
                    })
                    Event('UserManager', 'adjust member status', 'restrict member');
                }).catch((err) => {
                    if (err.data.ok) {
                        alert('this feature should be available into Supergroup only.')
                    }
                })
        }
    }

    getMemberList() {
        Axios.post('/getMemberStatus', {chat_id: window.localStorage.getItem('chat_id')})
        .then((res) => {
            let dataset = [];

            for (var data of res.data) {
                if (!data.is_bot) {
                    dataset.push(data);
                }
            }

            this.updateMemberList(dataset);

        }).catch(function(err) {
            console.log(err);
        })
    }

    updateMemberList(dataset) {
        this.setState({members: dataset.map((data, index) => 
            <tr key={index}>
                <td>
                    <div className="member_name">
                        {data.is_interested ?
                        <div className="interesting_icon"></div> : null}
                        <Link to={{
                            pathname: "/user",
                            search: "?user_id=" + data.id
                        }}>
                            {data.first_name} {data.last_name ? data.last_name : ''}
                        </Link>
                    </div>
                </td>
                <td>
                    {'Active'}
                </td>
                <td>
                    @{data.username}
                </td>
                <td>
                    {data.warning_pt}
                </td>
                <td>
                    {data.act_txt_cnt + data.act_photo_cnt + data.act_url_cnt}
                </td>
                <td>
                    {data.updated_at}
                </td>
                <td>
                    <Link to={{
                        pathname: "/logs",
                        search: "?user_id=" + data.id
                    }}>
                        <div className="icon message_log_icon">
                            <span className="tooltip">Message Logs</span>
                        </div>
                    </Link>
                </td>
                <td>
                    <div className="icon restrict_icon" onClick={() => this.restrictMember(data.id)}>
                        <span className="tooltip">Restrict</span>
                    </div>
                </td>
                <td>
                    <div className="icon ban_icon" onClick={() => this.kickMember(data.id, true)}>
                        <span className="tooltip">Ban</span>   
                    </div>
                </td>
                <td>
                    <div className="icon kick_icon" onClick={() => this.kickMember(data.id, false)}>
                        <span className="tooltip">Kick</span>
                    </div>
                </td>
            </tr> 
        )})
    }

    componentDidMount() {
        this.getMemberList()
    }

    render() {
        return (
            <div className="memberlist_wrap">
                    <h4>List of Members</h4>
                    <SearchBox target={'member'} searchMember={this.searchMember.bind(this)}></SearchBox>
                    <table className="usermanager_tb">
                        <thead>
                            <tr>
                                <th width="15%">Name</th>
                                <th width="10%">Status</th>
                                <th width="13%">Username</th>
                                <th width="10%">Warn. Points</th>
                                <th width="11%">Messages</th>
                                <th>Last Active</th>
                                <th width="5%"></th>
                                <th width="5%"></th>
                                <th width="5%"></th>
                                <th width="5%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.members.length === 0 ? 
                                <tr><td colSpan="10" className="empty_item">No Items</td></tr>
                                : this.state.members}
                        </tbody>
                    </table>
                </div>
        )
    }
}

export default UserManagerUserList;