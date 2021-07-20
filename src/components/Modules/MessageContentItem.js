import React from 'react';
import Axios from 'axios';
import {Event} from '../Tracking';

import TELEGRAM_ICON from '../../img/Icons/opentelegram_normal.svg';
import BEN_ICON from '../../img/Icons/ban_normal.svg';
import KICK_ICON from '../../img/Icons/kick_normal.svg';
import REPLY_ICON from '../../img/Icons/reply_normal.svg';
import DELETE_ICON from '../../img/Icons/delete_normal.svg';

import '../../style/css/MessageContentItem.min.css';

class MessageContentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img_path: '',
            isExpanded: false,
            open_modal: false,
            modal_content: '',
            origin_msg: null,
            user_profile_photo: []
        }
    }
    componentDidMount() {
        const user_id = this.props.data.user_id;
        
        Axios.post(`https://api.telegram.org/bot${this.props.botId}/getUserProfilePhotos`, {
            user_id: user_id,
            limit: 1
        })
        .then((res) => {
            const profile_file_id = res.data.result.photos[0][0].file_id;
            Axios.get(`https://api.telegram.org/bot${this.props.botId}/getFile?file_id=${profile_file_id}`)
            .then((res) => {
                const img_path = res.data.result.file_path
                this.setState({user_profile_photo: img_path})
            })
            
        })

        if (this.props.content === 'file') {
            Axios.get(`https://api.telegram.org/bot${this.props.botId}/getFile?file_id=${this.props.file_id}`)
            .then((res) => {
                const img_path = res.data.result.file_path
                this.setState({img_path: img_path})
            })
        }

        if (this.props.data.reply_to_message) {
            Axios.post('/getMessageById', {
                chat_id: window.localStorage.getItem('chat_id'),
                message_id: this.props.data.reply_to_message
            })
            .then((res) => {
                this.setState({origin_msg: res.data[0]})
            })
        }

        if (this.isMobileDevice()) {
            
        }
    }
    
    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    expand_minipulation(event) {
        document.querySelectorAll('.message_manipulation.active').forEach((v) => v.classList.remove('active'));
        this.setState({
            isExpanded: !this.state.isExpanded
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
                Event('Message', 'adjust member status', 'ban member');
            } else {
                Event('Message', 'adjust member status', 'kick member');
            }

            Axios.post(`https://api.telegram.org/bot${this.props.botId}/kickChatMember`, dataset)
                .then((res) => {
                    setTimeout(() => {
                        Axios.post('deleteUser', dataset);
                        Axios.post('/pushEventBotActivity', {
                            chat_id: dataset.chat_id,
                            event: 'kick'
                        })
                        window.location.reload();
                    }, 2000);
                })
        }
    }
    
    restrictMember(userid) {
        const result = window.confirm('Are you sure to ban this user?')
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
                    Event('Message', 'adjust member status', 'restrict member');
                }).catch((err) => {
                    alert(err);
                    return false;
                })
        }
    }

    send_reply_message(event) {
        const dataset = {
            chat_id: window.localStorage.getItem('chat_id'),
            reply_to_message_id: event.currentTarget.dataset.mid,
            text: this.state.modal_content
        }

        Axios.post(`https://api.telegram.org/bot${this.props.botId}/sendMessage`, dataset).then(() => {
            alert('the reply sent to chat successfully')
            this.close_modal();
            Axios.post('/setStateReplied', dataset);
            Axios.post('/pushEventBotActivity', {
                chat_id: dataset.chat_id,
                event: 'reply'
            })
            Event('Message', 'adjust message', 'reply message');
        })
    }

    delete_this_message(message_id) {
        const result = window.confirm('Are you sure to delete this message?')
        if (result) {
            const dataset = {
                chat_id: window.localStorage.getItem('chat_id'),
                message_id: message_id
            }
            Axios.post(`https://api.telegram.org/bot${this.props.botId}/deleteMessage`, dataset).then((res) => {
                if (res.data.ok === true) {
                    Axios.post('/removeMessage', dataset);
                    Event('Message', 'adjust message', 'delete');
                    window.location.reload();
                }
            })
            .catch((err) => {
                if (!err.response.data.ok) {
                    alert('You can only delete messages that were sent within 48 hours.');
                    return false;
                }
            })
        }
    }

    updateContent(event) {
        this.setState({
            modal_content: event.target.value
        })
    }

    open_reply_modal() {
        this.setState({
            open_modal: true
        })
        document.querySelector('.dim').style.display = 'block';
        document.querySelector('.dim').addEventListener('click', this.close_modal.bind(this))
    }

    close_modal() {
        this.setState({
            open_modal: false
        })
        document.querySelector('.dim').style.display = 'none';
    }

    telegram_actions(action) {
        switch (action) {
            case 'open' : {
                const user_name = this.props.data.username;
                window.location.href = `https://t.me/${user_name}`
                break;
            }
            case 'ban' : {
                const user_id = this.props.data.user_id;
                this.kickMember(user_id, true)
                break;
            }
            case 'kick' : {
                const user_id = this.props.data.user_id;
                this.kickMember(user_id, false)
                break;
            }
            case 'reply' : {
                this.open_reply_modal();
                break;
            }
            case 'delete': {
                const msg_id = this.props.data.id;
                this.delete_this_message(msg_id);
                break;
            }
        }
    }

    validateURL() {
        if (this.props.data.entities) {
            const entities = JSON.parse(this.props.data.entities);
            if (entities[0].type === 'url') {
                return true;
            } else {
                return false;
            }
        }
    }

    movetoMemberProfile(user_id) {
        if (user_id) {
            window.location.href = `/#/user?user_id=${user_id}`
        }
    }

    render() {
        const msg_date = new Date(this.props.data.date);

        return (
            <div className="content_message_wrap">
                <div className="message_owner">
                    <img src={`https://api.telegram.org/file/bot${this.props.botId}/${this.state.user_profile_photo}`} alt="profile"></img>
                </div>
                <div className="message_contents">
                    <div className="message_header">
                        <p className="message_user" onClick={() => this.movetoMemberProfile(this.props.data.user_id)}>
                            {this.props.data.first_name} {this.props.data.last_name}
                        </p>
                        <p className="message_time">
                            {msg_date.getMonth() + 1} / {msg_date.getDate()} , {msg_date.getHours()}:{msg_date.getMinutes()}
                        </p>
                        {
                            this.props.data.replied_date
                            ?
                            <p>
                                <span className="replied_icon"></span>
                                <span className="replied_mark">Replied</span>
                            </p>
                            :
                            null
                        }
                    </div>
                    <div className="message_body">
                        {this.state.origin_msg !== null ?
                        <div className="reply_target_message">
                            <p className="origin_message_user">
                                {this.state.origin_msg.first_name} {this.state.origin_msg.last_name}
                            </p>
                            
                            {
                                this.state.origin_msg.text ? 
                                <p className="origin_message_content">
                                    {this.state.origin_msg.text}
                                </p>
                                :
                                this.state.origin_msg.image ?
                                <p>
                                    IMAGE
                                </p> :
                                this.state.origin_msg.sticker ?
                                <p>
                                    STICKER
                                </p> :
                                <p>
                                    MEDIA
                                </p>
                            }
                        </div>
                        :
                        null} 
                        {this.props.content === 'file' ? 
                        <img src={`https://api.telegram.org/file/bot${this.props.botId}/${this.state.img_path}`} alt="file"></img>
                        :
                        this.props.content === 'sticker' ? 
                        <p>
                            Sticker preview unavailable
                        </p>
                        :
                        this.validateURL() ?
                        <div>
                            <p>
                                {this.props.content}
                            </p>
                            <div className="alert_icon">
                                <p className="tooltip">This message could be a spam. harmful link, or sent by a fake user.</p>
                                <p>!</p>
                            </div>
                            
                        </div>
                        :
                        <p>
                            {this.props.content}
                        </p>
                        }
                    </div>
                </div>
                <div className={this.state.isExpanded ? 'message_manipulation active' : 'message_manipulation'} onClick={(ev) => this.expand_minipulation(ev)}>
                    <div className="expand_icon"></div>
                </div>
                
                <div className="message_manipulation_expand">
                    <div className="manipulation_item" onClick={() => this.telegram_actions('open')}>
                        <img src={TELEGRAM_ICON} title="Open in Telegram" alt="open telegram"></img>
                    </div>
                    <div className="manipulation_item">
                        <img src={BEN_ICON} title="Ban" onClick={() => this.telegram_actions('ban')} alt="ben user"></img>
                    </div>
                    <div className="manipulation_item">
                        <img src={KICK_ICON} title="Kick" onClick={() => this.telegram_actions('kick')} alt="kick user"></img>
                    </div>
                    <div className="manipulation_item">
                        <img src={REPLY_ICON} title="Reply" onClick={() => this.telegram_actions('reply')} alt="reply"></img>
                    </div>
                    <div className="manipulation_item">
                        <img src={DELETE_ICON} title="Delete" onClick={() => this.telegram_actions('delete')} alt="delete"></img>
                    </div>
                </div>
                    
                <div className={this.state.open_modal ? 'modal reply_modal open' : 'modal reply_modal'}>
                    <div className="modal_title">
                        <p>Write a reply</p>
                    </div>
                    <textarea className="reply_content" onChange={(ev) => this.updateContent(ev)} placeholder="reply to.."></textarea>
                    <div className="modal_btn_wrap">
                        <a className="submit_btn" data-mid={this.props.data.id} onClick={(ev) => this.send_reply_message(ev)}>
                            SUBMIT
                        </a>
                        <a className="cancle_btn" onClick={() => this.close_modal()}>
                            CANCEL
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessageContentItem