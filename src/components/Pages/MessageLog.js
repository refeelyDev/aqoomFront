import React from 'react';
import Axios from 'axios';
import {Event} from '../Tracking';

import Content_Tabs from '../Modules/MessageContentContainer';

class MessageLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }
    
    back() {
        window.history.go(-1);
    }

    extract_query(key) {
        const query_str = window.location.href.split('?')[1];
        return query_str.split('=')[1];
    }

    componentDidMount() {
        Axios.post('/getMessageByUser', {
            chat_id: window.localStorage.getItem('chat_id'),
            member_id: this.extract_query('id'),
            date: 30
        }).then((res) => {
            if (res.data) {
                this.setState({messages: res.data})   
                Event('UserManager', 'show message log', 'message log');
            }
        })
    }

    render() {
        return (
          <div className="section_messages">
            <div className="section_title" onClick={() => this.back()}>
                <h2 className="title">
                    Message Logs
                </h2>
            </div>
            <Content_Tabs messages={this.state.messages} botId={this.props.botId} is_allMessages={true}></Content_Tabs>
          </div>
        );
      }
}

export default MessageLog;