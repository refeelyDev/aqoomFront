import React from 'react';
import Axios from 'axios';
import Title from '../Section_title';
import TabMenu from '../Modules/TabMenu';
import UserLists from '../Modules/UserManagerUserList';
import UserRestrictions from '../Modules/userManagerUserRestriction';

import '../../style/css/UserManager.min.css';

function Segment_Tabs(props) {
    switch (props.tab) {
      case 1: {
        return <UserLists botId={props.botId}></UserLists>
      }
      case 2: {
        return <UserRestrictions botId={props.botId}></UserRestrictions>
      }
    }
  }

class UserManager extends React.Component {
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
            <div className="section_usermanager">
                <Title title={"Members"}></Title>
                <TabMenu opt1={'Members List'} opt2={'Restrictions'} active_tab={this.set_activeTab.bind(this)}></TabMenu>
                <div className="content_wrap">
                    <Segment_Tabs tab={this.state.active_tab} botId={this.props.botId}></Segment_Tabs>
                </div>
            </div>
        )
    }
}

export default UserManager;