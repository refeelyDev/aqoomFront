import React from 'react';
import Axios from 'axios';
import PeoridPicker from '../Modules/PeoridPicker';
import Chart from 'chart.js';
import Rechart from 'rechart';

import { Event } from '../Tracking';

class AnalysticCommunity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total_member: 0
        }
    }

    componentDidMount() {
        Axios.post(`https://api.telegram.org/bot${this.props.botId}/getChatMembersCount`, {chat_id: window.localStorage.getItem('chat_id')})
            .then(res => {
                if (res.data.result) {
                    this.setState({total_member: res.data.result});
                }
            })

        Axios.post('/getAnalysticCommunityMember', {
            chat_id: window.localStorage.getItem('chat_id')
        })
            .then(res => {
                if (res.data) {
                    this.makeChart(res.data, 30)
                }
            })
        
        Event('Analystic', 'load module', 'Community');
    }

    confirmPeorid(from, to) {
        Axios.post('/getAnalysticCommunityMember', {
            chat_id: window.localStorage.getItem('chat_id'),
            date_from: from,
            date_to: to
        }).then(res => {
            if (res.data) {
                const date_past = new Date(from),
                    date_present = new Date(to);
                
                const diff = date_present - date_past;
                const diff_result = diff / (1000*60*60*24);

                this.makeChart(res.data, diff_result);
                Event('Analystic', 'Change duration', 'Change duration of community');
            }
        })
    }

    makeChart(data, peorid) {
        const date_to_format = document.querySelector('.date_to').innerText;
        const today = new Date(date_to_format);
        let label_arr = [];
        let dataset_new = [],
            dataset_left = []
            
        for (var i=peorid; i >= 0; i--) {
            const target_date = today - (86400000 * i);
            const d = new Date(target_date);
            const result = d.toString("MMMM dd").slice(4, 10)
            let is_matched_new = false,
                is_matched_left = false

            label_arr.push(result);
            if (data && data.length !== 0) {
                for (var date_cnt of data.new) {
                    if (result == date_cnt['ym']) {
                        dataset_new.push(date_cnt['cnt']);
                        is_matched_new = true;
                    } 
                }
                for (var date_cnt of data.left) {
                    if (result == date_cnt['ym']) {
                        dataset_left.push(date_cnt['cnt']);
                        is_matched_left = true;
                    } 
                }
            }

            if (!is_matched_new) {
                dataset_new.push(0)
            }
            if (!is_matched_left) {
                dataset_left.push(0)
            }
        }

        const message_crt = document.getElementById('chart_community_member');
        const chart = new Chart(message_crt, {
            type: 'line',
            data: {
                labels: label_arr,
                datasets: [
                    {
                        data: dataset_new,
                        borderColor: '#255CF9',
                        borderWidth: 2,
                        pointBackgroundColor: '#255CF9',
                        lineTension: 0,
                        fill: false,
                        label: 'New Members',
                        pointBorderWidth: 0.5
                    },
                    {
                        data: dataset_left,
                        borderColor: '#CC0A04',
                        borderWidth: 2,
                        pointBackgroundColor: '#CC0A04',
                        lineTension: 0,
                        fill: false,
                        pointBorderWidth: 0.5,
                        label: 'Left Members'
                    }
                ]
            },
            options: {
                legend: {
                    position: 'bottom',

                },
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            stepSize: 5,
                            beginAtZero: true,
                            fontSize: 10,
                            fontFamily: 'muli-ragular'
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }
        })

        chart.update();
        chart.resize();
    }

    render() {
        return (
            <div className="content_wrap">
                <PeoridPicker confirm_peorid={this.confirmPeorid.bind(this)}></PeoridPicker>
                <div className="chart_community_member_wrap">
                    <h5>
                    Members
                    </h5>
                    <p>
                        {this.state.total_member}
                    </p>
                    <div className="chart_canvas_wrap">
                        <canvas id="chart_community_member" width="1186" height="200"></canvas>
                    </div>
                </div>
            </div>
        )
    }
}

export default AnalysticCommunity;