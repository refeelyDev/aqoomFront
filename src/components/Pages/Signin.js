import React from "react";
import Axios from "axios";
import AQ_LOGO from "../../img/AQOOM_logo.png";
import TelegramLoginButton from "react-telegram-login";
import "../../style/css/Signin.min.css";

class Signin extends React.Component {
  constructor(props) {
    super(props);
  }

  checkValidation(t) {
    Axios.post(
      "checkValidation",
      {
        id: t
      },
      {
        withCredentials: true
      }
    ).then(response => {
      if (response.status === 200) {
        if (response.data !== false) {
          window.localStorage.setItem(
            "chat_id_list",
            JSON.stringify(response.data.id)
          );
          window.localStorage.setItem("chat_id", response.data.id[0]);
          const expire_time = this.getUTCExpiredTime();
          document.cookie = "living=true; expires=" + expire_time;
          window.location.href = '/';
        } else {
          alert(
            "it's not valid input. check again if chat Room's name or activation code is valid."
          );
        }
      }
    });
  }

  getUTCExpiredTime() {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 2 * 3600000;
    now.setTime(expireTime);

    return now.toUTCString();
  }

  onTelegramAuth(user) {
    this.checkValidation(user.id);
    window.sessionStorage.setItem('tel_id', user.id);
  }

  render() {
    return (
      <div className="signin_container">
        <div className="aqoom_logo">
          <img src={AQ_LOGO} alt="aqoom logo"></img>
        </div>
        <div className="login_box">
          <p className="login_info">
            Please login with your Telegram <br />
            to proceed to your dashboard.
          </p>
          <TelegramLoginButton
            dataOnauth={user => this.onTelegramAuth(user)}
            botName={this.props.botName}
          />
          <p className="login_help">
            AQOOM uses Telegram Secure ID to provide seamless automation of
            group management services. To learn more about Telegram Login works
            for websites, click <a href="https://telegram.org/blog/login">here</a>. <br/><br/> Having trouble logging in? Contact us at 
            <a href="mailto:info@aqoom.com"> info@aqoom.com</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Signin;
