import React from 'react';
import Content_Item from './MessageContentItem';

class MessageContentContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img_path: '',
            contents: []
        }
    }
    render() {
        const contents = this.props.messages.map((data) => {
            let msg = data.text ? data.text : data.sticker ? 'sticker' : 'file';

            if (msg === 'file') {
                const message = data.photo ? data.photo : data.video ? data.video : data.audio ? data.audio : undefined;
                if (message) {
                    let message_json = JSON.parse(message);
                    if (message_json.length > 1) {
                        message_json = message_json[0];
                    }
                    const file_id = message_json.file_id;
                    return (
                        <Content_Item content={msg} data={data} key={data.id} botId={this.props.botId} file_id={file_id} is_allMessages={this.props.is_allMessages}></Content_Item>
                    )
                }
            } else if (msg === 'sticker') {
                return (
                    <Content_Item content={msg} data={data} key={data.id} botId={this.props.botId} is_allMessages={this.props.is_allMessages}></Content_Item>
                )
            } else {
                return (
                    <Content_Item content={msg} data={data} key={data.id} botId={this.props.botId} is_allMessages={this.props.is_allMessages}></Content_Item>
                )
            }
        })

        return (
            <div className="content_tab">
                {contents.length !== 0 ?
                contents
                :
                <div className="emtpy_section">
                    <p>No messages yet</p>    
                </div>}
            </div>
        )
    }
}

export default MessageContentContainer;