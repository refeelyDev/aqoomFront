import React from 'react';
import Axios from 'axios';
import {Event} from '../Tracking';

import PeoridPicker from '../Modules/PeoridPicker';
import Chart from 'chart.js';

class AnalysticMemberActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            analystic_data: []
        }
    }

    makeInactiveUserChart(data) {
        const today = new Date(Date.now());
        let label_arr = [];
        let dataset = [];
            
        for (var i=12; i >= 0; i--) {
            const target_date = today - (86400000 * i);
            const d = new Date(target_date);
            const result = d.toString("MMMM dd").slice(4, 10)
            let is_matched = false

            label_arr.push(result);
            if (data) {
                for (var date_cnt of data) {
                    if (result == date_cnt['ym']) {
                        dataset.push(date_cnt['cnt']);
                        is_matched = true;
                    } 
                }
            }

            if (!is_matched) {
                dataset.push(0)
            }
        }

        const message_crt = document.getElementById('chart_inactive_user');
        const chart = new Chart(message_crt, {
            type: 'bar',
            data: {
                labels: label_arr,
                datasets: [
                    {
                        data: dataset,
                        borderColor: '#3CB650',
                        borderWidth: 2,
                        barThickness: 23,
                        label: 'New Members'
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
        });

        chart.update();
        chart.resize();
    }

    makeTotalMsgChart(data, date_len) {
        const date_to_format = document.querySelector('.date_to').innerText;
        const today = new Date(date_to_format);
        let label_arr = [];
        let dataset = [],
            dataset_text = [],
            dataset_question = [],
            dataset_media = [],
            dataset_forward = [];

        for (var i=date_len; i >= 0; i--) {
            const target_date = today - (86400000 * i);
            const d = new Date(target_date);
            const result = d.toString("MMMM dd").slice(4, 10)
            let is_matched = false,
                is_matched_text = false,
                is_matched_question = false,
                is_matched_media = false,
                is_matched_forward = false;

            label_arr.push(result);
            if (data && data.length !== 0) {
                for (var date_cnt of data.total) {
                    if (result == date_cnt['ym']) {
                        dataset.push(date_cnt['cnt']);
                        is_matched = true;
                    } 
                }
                for (var date_cnt of data.text) {
                    if (result == date_cnt['ym']) {
                        dataset_text.push(date_cnt['cnt']);
                        is_matched_text = true;
                    } 
                }
                for (var date_cnt of data.question) {
                    if (result == date_cnt['ym']) {
                        dataset_question.push(date_cnt['cnt']);
                        is_matched_question = true;
                    } 
                }
                for (var date_cnt of data.media) {
                    if (result == date_cnt['ym']) {
                        dataset_media.push(date_cnt['cnt']);
                        is_matched_media = true;
                    } 
                }
                for (var date_cnt of data.forward) {
                    if (result == date_cnt['ym']) {
                        dataset_forward.push(date_cnt['cnt']);
                        is_matched_forward = true;
                    } 
                }
            }

            if (!is_matched) {
                dataset.push(0)
            }
            if (!is_matched_text) {
                dataset_text.push(0)
            }
            if (!is_matched_question) {
                dataset_question.push(0)
            }
            if (!is_matched_media) {
                dataset_media.push(0)
            }
            if (!is_matched_forward) {
                dataset_forward.push(0)
            }
        }

        const message_crt = document.getElementById('chart_total_messege');
        const chart = new Chart(message_crt, {
            type: 'line',
            data: {
                labels: label_arr,
                datasets: [
                    {
                        data: dataset,
                        borderColor: '#F4D30F',
                        borderWidth: 2,
                        pointBackgroundColor: '#F4D30F',
                        lineTension: 0,
                        fill: false,
                        label: 'total',
                        pointBorderWidth: 0.5
                    },
                    {
                        data: dataset_text,
                        borderColor: '#2C55F9',
                        borderWidth: 2,
                        pointBackgroundColor: '#2C55F9',
                        lineTension: 0,
                        fill: false,
                        label: 'text',
                        pointBorderWidth: 0.5
                    },
                    {
                        data: dataset_question,
                        borderColor: '#3CB450',
                        borderWidth: 2,
                        pointBackgroundColor: '#3CB450',
                        lineTension: 0,
                        fill: false,
                        label: 'question',
                        pointBorderWidth: 0.5
                    },
                    {
                        data: dataset_media,
                        borderColor: '#189BEE',
                        borderWidth: 2,
                        pointBackgroundColor: '#189BEE',
                        lineTension: 0,
                        fill: false,
                        label: 'media',
                        pointBorderWidth: 0.5
                    },
                    {
                        data: dataset_forward,
                        borderColor: '#644AC4',
                        borderWidth: 2,
                        pointBackgroundColor: '#644AC4',
                        lineTension: 0,
                        fill: false,
                        label: 'forward',
                        pointBorderWidth: 0.5
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
                            suggestedMin: 20,
                            suggestedMax: 100,
                            beginAtZero: true,
                            fontSize: 10,
                            fontFamily: 'muli-ragular'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 10,
                            fontFamily: 'muli-ragular'
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }
        });
        chart.update();
        chart.resize();
    }

    getDateAMonthAgo() {
        const a_month_ago = new Date(Date.now());
        a_month_ago.setDate(a_month_ago.getDate() - 30);

        return `${a_month_ago.getFullYear()}-${a_month_ago.getMonth() + 1}-${a_month_ago.getDay()}`;
    }

    confirmPeorid(from, to) {
        Axios.post('/getAnalysticData', {
            chat_id: window.localStorage.getItem('chat_id'),
            date_from: from,
            date_to: to
        }).then(res => {
            if (res.data) {
                const date_past = new Date(from),
                    date_present = new Date(to);
                
                const diff = date_present - date_past;
                const diff_result = diff / (1000*60*60*24);

                let total_cnt = 0;
                if (res.data.length !== 0) {
                    for (var data_total of res.data.total) {
                        total_cnt += data_total.cnt;
                    }    
                } 
                
                this.setState({analystic_data: total_cnt})
                this.makeTotalMsgChart(res.data, diff_result)
                Event('Analystic', 'Change duration', 'Change duration of member activities');
            }
        })
    }

    componentDidMount() {
        Axios.post('/getAnalysticData', {
            chat_id: window.localStorage.getItem('chat_id'),
            date_from: this.getDateAMonthAgo(),
            date_to: 'today'
        })
            .then((res) => {
                if (res.data) {
                    let total_cnt = 0;
                    if (res.data.length !== 0) {
                        for (var data_total of res.data.total) {
                            total_cnt += data_total.cnt;
                        }
                    } 

                    this.setState({analystic_data: total_cnt})
                    this.makeTotalMsgChart(res.data, 30)
                }
            })

        Axios.post('/getInactiveUsers', {
            chat_id: window.localStorage.getItem('chat_id')
        })
            .then((res) => {
                if (res.data) {
                    this.makeInactiveUserChart(res.data);
                }
            })
        
        Event('Analystic', 'load module', 'Member Activities');
    }

    render() {
        return (
            <div className="content_wrap">
                <PeoridPicker confirm_peorid={this.confirmPeorid.bind(this)}></PeoridPicker>
                <div className="chart_total_message_wrap">
                    <h5>Total Messages</h5>
                    <p>{this.state.analystic_data} messages</p>
                    <div className="chart_canvas_wrap">
                        <canvas id="chart_total_messege" width="1186" height="200"></canvas>
                    </div>
                </div>

                <div className="chart_inactive_user_wrap">
                    <h5>Inactive Users</h5>
                    <div className="chart_canvas_wrap">
                        <canvas id="chart_inactive_user" width="1186" height="200"></canvas>
                    </div>
                </div>
            </div>
        )
    }
}

export default AnalysticMemberActivity;