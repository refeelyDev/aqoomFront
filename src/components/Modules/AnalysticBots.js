import React from 'react';
import Axios from 'axios';
import PeoridPicker from '../Modules/PeoridPicker';
import Chart from 'chart.js';
import { Event } from '../Tracking';

class AnalysticCommunity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total_member: 0
        }
    }

    getDateAMonthAgo() {
        const a_month_ago = new Date(Date.now());
        a_month_ago.setDate(a_month_ago.getDate() - 30);

        return `${a_month_ago.getFullYear()}-${a_month_ago.getMonth() + 1}-${a_month_ago.getDay()}`;
    }

    componentDidMount() {
        Axios.post('/getAnalysticBotActivities', {
            chat_id: window.localStorage.getItem('chat_id'),
            date_from: this.getDateAMonthAgo(),
            date_to: 'today'
        })
            .then(res => {
                if (res.data) {
                    this.makeChart(res.data, 30)
                }
            })

        Event('Analystic', 'load module', 'Bot Activities');
    }

    confirmPeorid(from, to) {
        Axios.post('/getAnalysticBotActivities', {
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
                Event('Analystic', 'Change duration', 'Change duration of bot activities');
            }
        })
    }

    makeChart(data, peorid) {
        const date_to_format = document.querySelector('.date_to').innerText;
        const today = new Date(date_to_format);
        let label_arr = [];
        let dataset_sent = [],
            dataset_deleted = [],
            dataset_kick = [],
            dataset_restrict = []
            
        for (var i=peorid; i >= 0; i--) {
            const target_date = today - (86400000 * i);
            const d = new Date(target_date);
            const result = d.toString("MMMM dd").slice(4, 10)
            let is_matched_sent = false,
                is_matched_deleted = false,
                is_matched_kick = false,
                is_matched_restrict = false

            label_arr.push(result);
            if (data && data.length !== 0) {
                for (var date_cnt of data.restrict) {
                    if (result == date_cnt['ym']) {
                        dataset_restrict.push(date_cnt['cnt']);
                        is_matched_restrict = true;
                    } 
                }
                for (var date_cnt of data.sent) {
                    if (result == date_cnt['ym']) {
                        dataset_sent.push(date_cnt['cnt']);
                        is_matched_sent = true;
                    } 
                }
                for (var date_cnt of data.deleted) {
                    if (result == date_cnt['ym']) {
                        dataset_deleted.push(date_cnt['cnt']);
                        is_matched_deleted = true;
                    } 
                }
                for (var date_cnt of data.kick) {
                    if (result == date_cnt['ym']) {
                        dataset_kick.push(date_cnt['cnt']);
                        is_matched_kick = true;
                    } 
                }
            }

            if (!is_matched_sent) {
                dataset_sent.push(0)
            }
            if (!is_matched_deleted) {
                dataset_deleted.push(0)
            }
            if (!is_matched_kick) {
                dataset_kick.push(0)
            }
            if (!is_matched_restrict) {
                dataset_restrict.push(0)
            }
        }

        const message_crt = document.getElementById('chart_bot_activities');
        const chart = new Chart(message_crt, {
            type: 'line',
            data: {
                labels: label_arr,
                datasets: [
                    {
                        data: dataset_sent,
                        borderColor: '#3CB450',
                        borderWidth: 2,
                        pointBackgroundColor: '#3CB450',
                        lineTension: 0,
                        fill: false,
                        label: 'Sent Messages',
                        pointBorderWidth: 0.5
                    },
                    {
                        data: dataset_deleted,
                        borderColor: '#1C62F9',
                        borderWidth: 2,
                        pointBackgroundColor: '#1C62F9',
                        lineTension: 0,
                        fill: false,
                        pointBorderWidth: 0.5,
                        label: 'Deleted Messages'
                    },
                    {
                        data: dataset_kick,
                        borderColor: '#634FC4',
                        borderWidth: 2,
                        pointBackgroundColor: '#634FC4',
                        lineTension: 0,
                        fill: false,
                        pointBorderWidth: 0.5,
                        label: 'Kicked Members'
                    },
                    {
                        data: dataset_restrict,
                        borderColor: '#F49D11',
                        borderWidth: 2,
                        pointBackgroundColor: '#F49D11',
                        lineTension: 0,
                        fill: false,
                        pointBorderWidth: 0.5,
                        label: 'Restricted members'
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
                <div className="chart_bot_activities_wrap">
                    <h5>
                    Bot Usage Activity
                    </h5>
                    <p></p>
                    <div className="chart_canvas_wrap">
                        <canvas id="chart_bot_activities" width="1186" height="200"></canvas>
                    </div>
                </div>
            </div>
        )
    }
}

export default AnalysticCommunity;