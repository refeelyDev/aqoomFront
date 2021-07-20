import React, {useState} from 'react';
import Axios from 'axios';

import ContentContainer from '../Modules/MessageContentContainer';
import '../../style/css/MessageLogModal.min.css';

function MessageLogModal(props) {
    const [messageLog, setMessageLog] = useState([]);

    if (!props.message_log) {
        if (props.chat_id) {
            Axios.post('/getMessageByUser', {
                chat_id: window.localStorage.getItem('chat_id'),
                member_id: props.user_id,
                date: 30
            })
            .then((res) => {
                setMessageLog(res.data);
            })
        } else {
            return (
                <div className={props.message_log_open ? "modal message_log_modal open" : "modal message_log_modal"}>
                    <h2 className="message_modal_title">Message Logs</h2>
                    <span className="message_modal_close" onClick={() => props.closeModal()}>&times;</span>
                    <div className="empty_section">
                        <p>No messages</p>
                    </div>
                </div>
            );
        }
    }
    return (
        <div className={props.message_log_open ? "modal message_log_modal open" : "modal message_log_modal"}>
            <h2 className="message_modal_title">Message Logs</h2>
            <span className="message_modal_close" onClick={() => props.closeModal()}>&times;</span>
            <ContentContainer messages={props.message_log ? props.message_log : messageLog} botId={props.botId} is_allMessages={true}></ContentContainer>
        </div>
    )
}

export default MessageLogModal;