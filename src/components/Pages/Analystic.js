import React from 'react';

import TabMenu from '../Modules/TabMenu';
import AnalysticMemberActivity from '../Modules/AnalysticMemberActivity';
import AnalysticCommunity from '../Modules/AnalysticCommunity';
import AnalysticBots from '../Modules/AnalysticBots';
import Title from '../Section_title';

import '../../style/css/Analytics.min.css';

function Content_tab(props) {
    if (props.num === 1) {
        return <AnalysticMemberActivity></AnalysticMemberActivity>
    } else if (props.num === 2) {
        return <AnalysticCommunity botId={props.botId}></AnalysticCommunity>
    } else if (props.num === 3) {
        return <AnalysticBots></AnalysticBots>
    }
}

class Analystic extends React.Component {
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
            <div className="analystic_section">
                <Title title="Analytics"></Title>
                <TabMenu opt1={'Member Activity Report'} opt2={'Community Report'} opt3={'Bot Usage Report'} active_tab={this.set_activeTab.bind(this)}></TabMenu>
                <Content_tab num={this.state.active_tab} botId={this.props.botId}></Content_tab>
            </div>
        )
    }
}

export default Analystic;