import React from "react";
import Axios from "axios";
import '../../style/css/Header_main.min.css';

class Header_main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      default_info: [],
      chat_photo: [],
      isOpen: false,
      state_loading: false
    };
  }

  componentDidMount() {
    const chat_id = window.localStorage.getItem("chat_id");
    const user_id = window.sessionStorage.getItem("tel_id");
  
    Axios.post(
        `https://api.telegram.org/bot${this.props.botId}/getChatMember`,
        { chat_id: chat_id, user_id: user_id }
      )
        .then(res => {
          this.setState({ default_info: res.data.result.user });
          if (res.data.result.photo) {
            Axios.get(
              `https://api.telegram.org/bot${this.props.botId}/getFile?file_id=` +
                res.data.result.photo.small_file_id
            ).then(res_photo => {
              this.setState({ chat_photo: res_photo.data.result });
            });
          }
        })
        .catch(err => {
          console.log(err);
          return false;
        });

      Axios.post("/getTimezone", {
        chat_id: chat_id
      }).then(res => {
        if (res.data) {
          window.localStorage.setItem("tz_set", res.data.timezone);
        }
      });
  }

  getHeaderPhoto() {
    if (this.state.chat_photo.file_path !== undefined) {
      return (
        <img
          src={
            `https://api.telegram.org/file/bot${this.props.botId}/` +
            this.state.chat_photo.file_path
          }
          alt="user profile image"
        ></img>
      );
    } else {
      return "";
    }
  }

  toggleDropbox() {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    } else {
      this.setState({ isOpen: true });
    }
  }

  logout() {
    // 스토리지 chat_id, cookie living delete
    window.localStorage.removeItem("chat_id");
    document.cookie = "living=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "STAY_C=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  }

  render() {
    return (
      <div className="section_header">
        <a href="/#/chatmanager/members" className="header_logo"></a>
        <a className="mobile_logout" onClick={() => this.logout()}>LOG OUT</a>
        <div className="header_infos">
          <div className="header_name" onClick={() => this.toggleDropbox()}>
            <span>{this.state.default_info.username}</span>
            <span className="icon icon-down"></span>
          </div>
          <ul
            className={this.state.isOpen ? "header_drop open" : "header_drop"}
          >
            <li>{this.state.default_info.username}</li>
            <li
              style={{ color: "#2F2F2F", cursor: "pointer" }}
              onClick={() => this.logout()}
            >
              LOG OUT
            </li>
          </ul>
          <div className="header_photo">{this.getHeaderPhoto()}</div>
        </div>
      </div>
    );
  }
}

export default Header_main;
