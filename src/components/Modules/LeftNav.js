import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import "../../style/css/LeftNav.min.css";
import { Event } from '../Tracking';

class LeftNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      default_info: [],
      group_list: [],
      current_group: [],
      current_group_members_cnt: 0
    };
  }
  async getChatGroupInfos(chat_id_list) {
    const loop = async function(botId) {
      let result_arr = [];

      for (var chat_id of chat_id_list) {
        try {
          const signin_id = window.sessionStorage.getItem('tel_id');
          const is_valid = await Axios.post(`https://api.telegram.org/bot${botId}/getChatAdministrators`, {chat_id: chat_id});
          let is_deverved = false;

          if (is_valid.data.ok) {
            for (var member of is_valid.data.result) {
              if (member.user['id'] == signin_id && !member.user['is_bot']) {
                is_deverved = true;
              }
            }
          }

          if (!is_deverved) {
            continue;
          } else {
            const res = await Axios.post(`https://api.telegram.org/bot${botId}/getChat`, {
              chat_id: chat_id
            })
            if (res.data.result.permissions.can_send_messages) {
              if (res.data.result.photo) {
                const res_photo = await Axios.get(`https://api.telegram.org/bot${botId}/getFile?file_id=` + res.data.result.photo.small_file_id)
                  const dataset = {
                    id: res.data.result.id,
                    photo: res_photo.data.result.file_path,
                    title: res.data.result.title
                  };
                  
                  result_arr.push(dataset)
                
              } else {
                const dataset = {
                  id: res.data.result.id,
                  photo: '',
                  title: res.data.result.title
                };
  
                result_arr.push(dataset)
              }
            }
          }
        } catch (err) {
          continue;
        }
        
      }
      return result_arr;
    }
  
    
    const result = await loop(this.props.botId)
  
    this.setState({
      group_list: result.map((item, index) => {
        return (
          <div
            className="group_list"
            key={index}
            data-chatid={item.id}
            onClick={ev => this.change_group(ev)}
          >
            <div className="group_img">
              {item.photo ?
            <img src={`https://api.telegram.org/file/bot${this.props.botId}/${item.photo}`} alt="group profile image"></img>
            :
            null  
            }
              
            </div>
            <div className="group_title">
              <p>{item.title}</p>
            </div>
          </div>
        );
      })
    });
  }

  getChatInfos(chat_id) {
    if (chat_id) {
      return Axios.post(`https://api.telegram.org/bot${this.props.botId}/getChat`, {
        chat_id: chat_id
      }).then(res => {
        if (res.data.result.photo) {
          Axios.get(
            `https://api.telegram.org/bot${this.props.botId}/getFile?file_id=` +
              res.data.result.photo.small_file_id
          ).then(res_photo => {
            const dataset = {
              id: res.data.result.id,
              photo: res_photo.data.result.file_path,
              title: res.data.result.title
            };
           
            this.setState({current_group: dataset});
           
          });
        } else {
          const dataset = {
            id: res.data.result.id,
            photo: "",
            title: res.data.result.title
          };

          this.setState({current_group: dataset});          
        }
      });
    }
  }
  getChatMemCount(chat_id) {
    return Axios.post(`https://api.telegram.org/bot${this.props.botId}/getChatMembersCount`, {
      chat_id: chat_id
    }).then((res) => {
      this.setState({current_group_members_cnt: res.data.result})
    })
  }
  componentWillMount() {
    const chat_list = JSON.parse(window.localStorage.getItem("chat_id_list"));
    const current_chat_id = window.localStorage.getItem("chat_id");

    if (current_chat_id) {
      this.getChatInfos(current_chat_id);
      this.getChatMemCount(current_chat_id);
    }

    this.getChatGroupInfos(chat_list);
  
  }

  change_group(event) {
    window.localStorage.setItem("chat_id", event.currentTarget.dataset.chatid);
    window.location.reload();
    Event('navigation', 'Change group', 'change group');
  }

  activeNav(num) {
    const isExist = document.querySelector(".nav_contents > a.active");
    if (isExist) {
      isExist.classList.remove("active");
    }
    document
      .querySelector(`.nav_contents > a:nth-child(${num})`)
      .classList.add("active");
    
    this.setGAEvent(num);

    return false;
  }

  setGAEvent(navNum) {
    switch (navNum) {
      case 1 : {
        Event('navigation', 'change category', 'Analystic');
        break;
      }
      case 2 : {
        Event('navigation', 'change category', 'Members');
        break;
      }
      case 3 : {
        Event('navigation', 'change category', 'Messages');
        break;
      }
      case 4 : {
        Event('navigation', 'change category', 'Interactions');
        break;
      }
      case 5 : {
        Event('navigation', 'change category', 'Anti-spam');
        break;
      }
      case 6 : {
        Event('navigation', 'change category', 'Setting');
        break;
      }
    }
  }

  dragoutGrouplist () {
    document.querySelector('.nav_groups').classList.add('active');
    document.querySelector('.dim').style.display = 'block';
    document.querySelector('.dim').addEventListener('click', this.draginGrouplist)
  }

  draginGrouplist () {
    document.querySelector('.nav_groups').classList.remove('active');
    document.querySelector('.dim').style.display = 'none';
  }

  render() {
    return (
      <section className="left_nav">
        <div className="current_group" onClick={() => this.dragoutGrouplist()}>
          <div className="group_img">
            {
              this.state.current_group.photo
              ?
              <img src={`https://api.telegram.org/file/bot${this.props.botId}/${this.state.current_group.photo}`} alt="group profile image"></img>
              :
              null
            }
            
          </div>
          <div className="group_title">
            <p>{this.state.current_group.title}</p>
            <p>
              {this.state.current_group_members_cnt} members
            </p>
          </div>
          <div className="arrow_down_icon"></div>
        </div>
        <div className="nav_groups">{this.state.group_list}</div>
        <div className="nav_contents">
          <Link to="/analytics" onClick={ev => this.activeNav(1)}>
            <i className="icon icon-analytics">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8.727" viewBox="0 0 16 8.727">
                <path id="ic_timeline_24px" d="M17,7.455a1.459,1.459,0,0,1-1.455,1.455,1.236,1.236,0,0,1-.371-.051L12.585,11.44a1.285,1.285,0,0,1,.051.378,1.455,1.455,0,1,1-2.909,0,1.285,1.285,0,0,1,.051-.378L7.924,9.585a1.43,1.43,0,0,1-.756,0L3.858,12.9a1.236,1.236,0,0,1,.051.371,1.455,1.455,0,1,1-1.455-1.455,1.236,1.236,0,0,1,.371.051L6.142,8.56a1.285,1.285,0,0,1-.051-.378A1.455,1.455,0,0,1,9,8.182a1.285,1.285,0,0,1-.051.378L10.8,10.415a1.43,1.43,0,0,1,.756,0l2.582-2.589a1.236,1.236,0,0,1-.051-.371,1.455,1.455,0,1,1,2.909,0Z" transform="translate(-1 -6)" fill="currentColor"/>
              </svg>
            </i> Analytics
          </Link>
          <Link to="/members" onClick={ev => this.activeNav(2)}>
            <i className="icon icon-members">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-friends" className="svg-inline--fa fa-user-friends fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path></svg>  
            </i> Members
          </Link>
          <Link to="/messages" onClick={ev => this.activeNav(3)}>
            <i className="icon icon-messages">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path id="ic_question_answer_24px" d="M17.2,5.2H15.6v7.2H5.2V14a.8.8,0,0,0,.8.8h8.8L18,18V6A.8.8,0,0,0,17.2,5.2ZM14,10V2.8a.8.8,0,0,0-.8-.8H2.8a.8.8,0,0,0-.8.8V14l3.2-3.2h8A.8.8,0,0,0,14,10Z" transform="translate(-2 -2)" fill="currentColor"/>
            </svg>
            </i> Messages
          </Link>
          <Link to="/interactions" onClick={ev => this.activeNav(4)}>
            <i className="icon icon-messages">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13.819" viewBox="0 0 16 13.819">
              <g id="ic_record_voice_over_24px" transform="translate(-1 -2)">
                <circle id="Ellipse_3" data-name="Ellipse 3" cx="3" cy="3" r="3" transform="translate(3.996 4)" fill="currentColor"/>
                <path id="Path_3" data-name="Path 3" d="M6.819,11.455C4.877,11.455,1,12.43,1,14.364v1.455H12.637V14.364C12.637,12.43,8.76,11.455,6.819,11.455Zm5.644-7.011L11.241,5.673a2.413,2.413,0,0,1,0,2.829l1.222,1.229a3.722,3.722,0,0,0,0-5.288ZM14.87,2,13.684,3.186a5.8,5.8,0,0,1,0,7.811l1.186,1.186A7.149,7.149,0,0,0,14.87,2Z" fill="currentColor"/>
              </g>
            </svg>
            </i> Interactions
          </Link>
          <Link to="/antispam" onClick={ev => this.activeNav(5)}>
            <i className="icon icon-messages">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path id="ic_feedback_24px" d="M16.4,2H3.6A1.6,1.6,0,0,0,2.008,3.6L2,18l3.2-3.2H16.4A1.6,1.6,0,0,0,18,13.2V3.6A1.6,1.6,0,0,0,16.4,2Zm-5.6,9.6H9.2V10h1.6Zm0-3.2H9.2V5.2h1.6Z" transform="translate(-2 -2)" fill="currentColor"/>
            </svg>
            </i> Anti-Spam
          </Link>
          <Link to="/settings" onClick={ev => this.activeNav(6)}>
            <i className="icon icon-messages">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.449" viewBox="0 0 16 16.449">
              <path id="ic_settings_24px" d="M16.383,11.03a6.409,6.409,0,0,0,.058-.806,6.41,6.41,0,0,0-.058-.806l1.735-1.357a.415.415,0,0,0,.1-.526L16.572,4.689a.413.413,0,0,0-.5-.181l-2.048.822a6.009,6.009,0,0,0-1.39-.806L12.32,2.345a.4.4,0,0,0-.4-.345H8.628a.4.4,0,0,0-.4.345L7.912,4.525a6.319,6.319,0,0,0-1.39.806L4.474,4.508a.4.4,0,0,0-.5.181L2.328,7.535a.405.405,0,0,0,.1.526L4.162,9.418a6.522,6.522,0,0,0-.058.806,6.522,6.522,0,0,0,.058.806L2.426,12.387a.415.415,0,0,0-.1.526l1.645,2.846a.413.413,0,0,0,.5.181l2.048-.822a6.009,6.009,0,0,0,1.39.806L8.225,18.1a.4.4,0,0,0,.4.345h3.29a.4.4,0,0,0,.4-.345l.313-2.179a6.319,6.319,0,0,0,1.39-.806l2.048.822a.4.4,0,0,0,.5-.181l1.645-2.846a.415.415,0,0,0-.1-.526ZM10.272,13.1a2.879,2.879,0,1,1,2.879-2.879A2.882,2.882,0,0,1,10.272,13.1Z" transform="translate(-2.271 -2)" fill="currentColor"/>
            </svg>
            </i> Settings
          </Link>
        </div>
      </section>
    );
  }
}

export default LeftNav;
