import React from 'react';
import Title from '../Section_title';
import Content_Tabs from '../Modules/TabMenu';
import Announcements from '../Modules/Announcement';
import WelcomeMessage from '../Modules/StartMenu';
import AutoResponce from '../Modules/AutoResponce';
import Polls from '../Modules/Polls';

import '../../style/css/Interactions.min.css';

function Segment_Tabs(props) {
    switch (props.tab) {
      case 1: {
        return <Announcements botId={props.botId}></Announcements>
      }
      case 2: {
          return <WelcomeMessage botId={props.botId}></WelcomeMessage>
      }
      case 3: {
          return <AutoResponce botId={props.botId}></AutoResponce>
      }
      case 4: {
          return <Polls botId={props.botId}></Polls>
      }
    }
  }

class Interactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_tab: 1
        }
    }
    
    set_activeTab(num) {
        return this.setState({ active_tab: num });
    }

    render() {
        return (
            <div className="section_interaction">
                <Title title="Interaction"></Title>
                <Content_Tabs opt1={'Announcements'} opt2={'Welcome Message'} opt3={'Auto-Responder'} opt4={'Poll'} active_tab={this.set_activeTab.bind(this)}></Content_Tabs>
                <div className="content_tab">
                    <Segment_Tabs tab={this.state.active_tab} botId={this.props.botId}></Segment_Tabs>
                </div>
            </div>
        )
    }
}

export default Interactions;