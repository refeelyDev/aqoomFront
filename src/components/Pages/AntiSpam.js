import React from 'react';
import Axios from 'axios';
import {Event} from '../Tracking';

import '../../style/css/AntiSpam.min.css';

function FieldRow(props) {
    function getFieldName(name) {
        var fieldName = '';

        switch (name) {
            case 'anti_image' : {
                fieldName = 'Delete Images'
                break;
            }
            case 'anti_url' : {
                fieldName = 'Delete URLs'
                break;
            }
            case 'anti_forward' : {
                fieldName = 'Delete Forwarded Messages'
                break;
            }
            case 'anti_voice' : {
                fieldName = 'Delete Voice Messages'
                break;
            }
            case 'anti_gif' : {
                fieldName = 'Delete GIFs'
                break;
            }
            case 'anti_sticker' : {
                fieldName = 'Delete Stickers'
                break;
            }
            case 'anti_join_message' : {
                fieldName = 'Delete Join Messages'
                break;
            } 
            case 'anti_left_message' : {
                fieldName = 'Delete Leave Messages'
                break;
            } 
            case 'anti_longname' : {
                fieldName = 'Block Long Name Spammers'
                break;
            } 
            case 'anti_flood' : {
                fieldName = 'Anti-Flood'
                break;
            } 
        }

        return fieldName;
    }

    function updateAntiOption(field) {
        Axios.post('/updateAnti', {
            field: field,
            chat_id: window.localStorage.getItem('chat_id')
        }).then(res => {
            if (res.data) {
                Event('Antispam', 'set item', field + 'option')
                props.initOptions()
            }
        })
    }

    return (
        <div className="filter_row">
            <p className="filter_field">
                {getFieldName(props.name)}
            </p>
            <div className="filter_switch">
                <label htmlFor={props.name}>
                    <input type="checkbox" className="anti_filter" name={props.name} id={props.name} onChange={() => updateAntiOption(props.name)} checked={props.isActive}></input>
                    <div className="custom_chbox"></div>
                    <div className="custom_chbox_circle"></div>
                </label>
            </div>
        </div>
    )
}

class AntiSpam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anti_options: [],
            blacklist: [],
            disabledSlashCommand: false
        }
    }

    componentDidMount() {
       this.initOptions()
    }

    initOptions () {
        Axios.post('/getAnti', {
            chat_id: window.localStorage.getItem('chat_id')
        }).then((res) => {
            if (res.data) {
                this.setState({anti_options: res.data[0]})
            }
        })

        this.getWordData();
        this.getWhitelistURL();
        this.getWhitelistUser();
    }

    submit_blacklist () {
        const val = document.forms[1].blacklist.value;

        if (val.length !== 0) {
            const chat_id = window.localStorage.getItem('chat_id')

            if (chat_id.length !== 0) {
                Axios.post('pushWordData', {word: val, chat_id: chat_id})
                .then((res) => {
                    if (res.data) {
                        this.getWordData();
                        document.forms[1].blacklist.value = '';
                        Event('Antispam', 'set item', 'blacklist')
                    }
                })
            } else {
                alert('There is any valid key of chatting information')
                return false
            }
        
        }
    }

    submit_whitelisturl() {
        let val = document.forms[1].whitelisturl.value;

        if (val.length !== 0) {
            const chat_id = window.localStorage.getItem('chat_id')
            const isPattern = this.checkIfPattern(val);

            if (isPattern === false) {
                alert('It isn\'t a valid URL.');
                return false;
            }

            if (chat_id.length !== 0) {
                Axios.post('/pushWhitelist', {pattern: val, chat_id: chat_id})
                .then((res) => {
                    if (res.data) {
                        this.getWhitelistURL();
                        document.forms[1].whitelisturl.value = ''
                        Event('Antispam', 'set item', 'whitelist')
                    }
                })
            } else {
                alert('There is any valid key of chatting information')
                return false
            }
        
        }
    }

    submit_whitelistUser() {
        let val = document.forms[1].whitelistuser.value;

        if (val.length !== 0) {
            const chat_id = window.localStorage.getItem('chat_id')

            if (chat_id.length !== 0) {
                Axios.post('/setUserWhitelist', {chat_id: chat_id, username: val})
                .then((res) => {
                    if (res.data) {
                        this.getWhitelistUser();
                        document.forms[1].whitelistuser.value = ''
                        Event('Antispam', 'set item', 'whitelist user')
                    }
                })
            } else {
                alert('There is any valid key of chatting information')
                return false
            }
        
        }
    }

    /**
     * 
     * @param {string} val
     * @returns {boolean} True = pattern, False = common
     * 
     */
    checkIfPattern (val) {
        if (typeof val === 'string') {
            const regx_test = /^\/[\s\S]*\/$/
            const regx = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/
            if (!regx_test.test(val) && regx.test(val)) {
                return 'common';
            } else if (regx_test.test(val) && regx.test(val)) {
                return 'pattern';
            } else {
                return false;
            }
        }    
    }

    getWordData() {
        Axios.post('getWordData', {chat_id: window.localStorage.getItem('chat_id')})
        .then((res) => {
            if (res.data) {
                this.setState({blacklist: res.data.map((blacklist, index) => {
                    return (
                        <div className="blacklist_item" key={index}>
                            <p>
                                {blacklist.word_name.length > 5 ? blacklist.word_name.substr(0,3) + '...' : blacklist.word_name}
                            </p>
                            <span className="del_icon" onClick={() => this.deleteBlacklist(blacklist.id)}>&times;</span>
                        </div>
                    )
                })})
            } else {
                this.setState({blacklist: []})
            }
        })
    }

    getWhitelistURL() {
        Axios.post('/getWhitelist', {
            chat_id: window.localStorage.getItem('chat_id')
        }).then(res => {
            if (res.data) {
                this.setState({whitelistURL: res.data.map((whitelisturl, index) => {
                    return (
                        <div className="whitelisturl_item" key={index}>
                            <p>
                                {whitelisturl.url_pattern.length > 11 ? whitelisturl.url_pattern.substr(0, 8) + '...' : whitelisturl.url_pattern}
                            </p>
                            <span className="del_icon" onClick={() => this.deleteWhitelistURL(whitelisturl.id)}>&times;</span>
                        </div>
                    )
                })})
            } else {
                this.setState({whitelistURL: []})
            }
        })
    }

    getWhitelistUser() {
        Axios.post('/getUserWhitelist', {
            chat_id: window.localStorage.getItem('chat_id')
        }).then(res => {
            if (res.data) {
                this.setState({whitelistUser: res.data.map((whiltelist, index) => {
                    return (
                        <div className="whitelistuser_item" key={index}>
                            <p>
                                {whiltelist.username.length > 11 ? whiltelist.username_pattern.substr(0, 8) + '...' : whiltelist.username}
                            </p>
                            <span className="del_icon" onClick={() => this.deleteWhitelistUser(whiltelist.id)}>&times;</span>
                        </div>
                    )
                })})
            }
        })
    }

    deleteBlacklist(id) {
        Axios.post('/delWordData', {
            chat_id: window.localStorage.getItem('chat_id'),
            id: id
        }).then(res => {
            if (res.data) {
                this.getWordData();
                Event('Antispam', 'Delete item', 'blacklist')
            }
        })
    }

    deleteWhitelistURL(id) {
        Axios.post('/delWhitelist', {
            chat_id: window.localStorage.getItem('chat_id'),
            id: id
        }).then(res => {
            if (res.data) {
                this.getWhitelistURL();
                Event('Antispam', 'Delete item', 'whitelist')
            }
        })
    }

    deleteWhitelistUser(id) {
        Axios.post('/delWhiteUser', {
            chat_id: window.localStorage.getItem('chat_id'),
            id: id
        }).then(res => {
            if (res.data) {
                this.getWhitelistUser();
                Event('Antispam', 'Delete item', 'whitelist user')
            }
        })
    }

    toggle_slach_commands(status) {
        this.setState({disabledSlashCommand: !status});

        Axios.post('/updateStateSlashs', {
            chat_id: window.localStorage.getItem('chat_id'),
            status: !status
        })
    }

    render() {
        return (
            <div className="antispam_section">
                <h2 className="section_title">
                Anti-Spam
                </h2>
                <form className="anti_options">
                    <h5>Filters</h5>
                    <p>By using filters, the bot will automatically delete unwanted messages like photos, images, and documents.</p>
                    <div className="filters">
                        <FieldRow name="anti_image" isActive={this.state.anti_options.anti_image} initOptions={this.initOptions.bind(this)}></FieldRow>
                        <FieldRow name="anti_url" isActive={this.state.anti_options.anti_url} initOptions={this.initOptions.bind(this)}></FieldRow>
                        <FieldRow name="anti_forward" isActive={this.state.anti_options.anti_forward} initOptions={this.initOptions.bind(this)}></FieldRow>
                        <FieldRow name="anti_voice" isActive={this.state.anti_options.anti_voice} initOptions={this.initOptions.bind(this)}></FieldRow>
                        <FieldRow name="anti_gif" isActive={this.state.anti_options.anti_gif} initOptions={this.initOptions.bind(this)}></FieldRow>
                        <FieldRow name="anti_sticker" isActive={this.state.anti_options.anti_sticker} initOptions={this.initOptions.bind(this)}></FieldRow>
                        <FieldRow name="anti_join_message" isActive={this.state.anti_options.anti_join_message} initOptions={this.initOptions.bind(this)}></FieldRow>
                        <FieldRow name="anti_left_message" isActive={this.state.anti_options.anti_left_message} initOptions={this.initOptions.bind(this)}></FieldRow>
                        {/* <FieldRow name="anti_longname" isActive={this.state.anti_options.anti_longname} initOptions={this.initOptions.bind(this)}></FieldRow> */}
                        {/* <FieldRow name="anti_flood" isActive={this.state.anti_options.anti_flood} initOptions={this.initOptions.bind(this)}></FieldRow> */}
                    </div>
                </form>

                <form className="restriction_messages">
                    <h5>Restrictions</h5>
                    <p>You can restrict words, urls, and even in your chat group. These messages are automatically deleted.</p>
                    <div className="restriction_module">
                        <h6>Blacklisted Words</h6>
                        <p>These words will be automatically deleted by the bot and is case insensitive.</p>
                        <div className="restriction_content">
                            <div className="blacklist_words">
                                {this.state.blacklist}
                            </div>
                            <input type="text" name="blacklist"></input>
                            <a className="add_btn" onClick={() => this.submit_blacklist()}>Add</a>
                        </div>
                    </div>
                    <div className="restriction_module">
                        <h6>Whitelisted URL</h6>
                        <p>These are the ONLY URLs that are allowed in your group. Other links will be automatically deleted.</p>
                        <div className="restriction_content">
                            <div className="blacklist_words">
                                {this.state.whitelistURL}
                            </div>
                            <input type="text" name="whitelisturl"></input>
                            <a className="add_btn" onClick={() => this.submit_whitelisturl()}>Add</a>
                        </div>
                    </div>
                    <div className="restriction_module">
                        <h6>Whitelist bots and users</h6>
                        <p>Restrictions will not apply to whitelisted bots and users. You can enter their username with or without the @.</p>
                        <div className="restriction_content">
                            <div className="blacklist_words">
                                {this.state.whitelistUser}
                            </div>
                            <input type="text" name="whitelistuser"></input>
                            <a className="add_btn" onClick={() => this.submit_whitelistUser()}>Add</a>
                        </div>
                    </div>
                    {/* <div className="restriction_module disable_slash_module">
                        <div className="restriction_title_wrap">
                            <h6>Disable Slash commands</h6>
                            <p>Prevent users using slash commands in the chatroom. View slash commands here.</p>
                        </div>
                        
                        <div className="restriction_content">
                            <div className="filter_switch">
                                <label htmlFor="disable_slash">
                                    <input type="checkbox" className="anti_filter" name="disable_slash" id="disable_slash" onChange={() => this.toggle_slach_commands(this.state.disabledSlashCommand)} defaultChecked={this.state.anti_options.anti_slash}></input>
                                    <div className="custom_chbox"></div>
                                    <div className="custom_chbox_circle"></div>
                                </label>
                            </div>
                        </div>
                    </div> */}
                </form>
            </div>
        )
    }
}

export default AntiSpam;