import React from "react";
import Axios from "axios";
import Title from "../Section_title";
import TabMenu from "../Modules/TabMenu";
import Content_Tabs from '../Modules/MessageContentContainer';

import "../../style/css/Messages.min.css";


function Segment_Tabs(props) {
  switch (props.tab) {
    case 1: {
      return <Content_Tabs messages={props.messages} botId={props.botId} is_allMessages={true}></Content_Tabs>;
    }
    case 2: {
      return <Content_Tabs messages={props.questions} botId={props.botId} is_allMessages={false}></Content_Tabs>;
    }
    case 3: {
      return <Content_Tabs messages={props.mentions} botId={props.botId} is_allMessages={false}></Content_Tabs>;
    }
  }
}

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active_tab: 1,
      messages: [],
      questions: [],
      mentions: [],
      current_pg_question: 0,
      current_pg_mention: 0,
      current_pg: 0,
      isbusy: false
    };
    this.onScroll = this.append_messages.bind(this);
  }

  componentDidMount() {
    this.get_messages(this.state.current_pg);
    this.get_questions(this.state.current_pg_question);
    this.get_mentions(this.state.current_pg_mention);

    window.addEventListener('scroll', this.onScroll)
  }
  
  componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll)
  }

  get_mentions(page) {
    Axios.post('getAdminMentions', {
        chat_id: window.localStorage.getItem('chat_id'),
        page: page
    })
    .then((res) => {
        if (res.data) {
            const result = this.state.mentions.concat(res.data)

            this.setState({
                mentions: result,
                current_pg_question: this.state.current_pg_mention + 1,
                isbusy: false
            })
        }
    })
  }

  get_questions(page) {
    Axios.post('getQuestions', {
        chat_id: window.localStorage.getItem('chat_id'),
        page: page
    })
    .then((res) => {
        if (res.data) {
            const result = this.state.questions.concat(res.data);

            this.setState({
                questions: result,
                current_pg_question: this.state.current_pg_question + 1,
                isbusy: false
            })
        }
    })
  }

  get_messages(page) {
    Axios.post('/getMessages', {
        page: page,
        chat_id: window.localStorage.getItem('chat_id')
    })
    .then((res) => {
        if (res.data) {
            const result = this.state.messages.concat(res.data);
            this.setState({
                messages: result,
                current_pg: this.state.current_pg + 1,
                isbusy: false
            })
        }
    })
  }

  set_activeTab(num) {
    return this.setState({ active_tab: num });
  }

  getCurrentScrollPercentage(){
    return (window.scrollY + window.innerHeight) / document.body.clientHeight * 100
    }

  append_messages(event) {
    if (this.state.messages.length >= 20) {
        const scroll_position = this.getCurrentScrollPercentage()
        if (scroll_position > 90 && !this.state.isbusy) {
            this.setState({isbusy: true})
            this.get_messages(this.state.current_pg)
        }
    }
  }

  render() {
    return (
      <div className="section_messages">
        <Title title={"Messages"}></Title>
        <TabMenu
          opt1={"Message Log"}
          opt2={"Collected Questions"}
          opt3={"Messages to Admin"}
          active_tab={this.set_activeTab.bind(this)}
        ></TabMenu>
        <Segment_Tabs tab={this.state.active_tab} messages={this.state.messages} questions={this.state.questions} mentions={this.state.mentions} botId={this.props.botId}></Segment_Tabs>
      </div>
    );
  }
}

export default Messages;
