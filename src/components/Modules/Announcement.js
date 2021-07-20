import React, { useState } from "react";
import Axios from "axios";
import {Event} from '../Tracking';

import SelectboxDate from './SelectboxDate';
import SelectboxDay from './SelectboxDay';
import SelectboxHour from './SelectboxHour';
import SelectboxMin from './SelectboxMin';

function SettingTime(props) {
  const type = props.type;

  if (type === 0) {
    return (
      <div className="set_of_timeset">
        <SelectboxDate></SelectboxDate>
        <SelectboxHour></SelectboxHour>
        <SelectboxMin></SelectboxMin>
      </div>
    );
  } else if (type === 1) {
    return (
      <div className="set_of_timeset">
        <SelectboxHour></SelectboxHour>
        <SelectboxMin></SelectboxMin>
      </div>
    );
  } else if (type === 2) {
    return (
      <div className="set_of_timeset">
        <SelectboxDay></SelectboxDay>
        <SelectboxHour></SelectboxHour>
        <SelectboxMin></SelectboxMin>
      </div>
    );
  } else if (type === 3) {
    return (
      <div className="set_of_timeset">
        <SelectboxHour></SelectboxHour>
        <SelectboxMin></SelectboxMin>
      </div>
    );
  }
}

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_item: 0,
      opened_selectbox: false,
      message_type: 1,
      uploadImage: "",
      isOpen_btn_modal: false,
      message_btns: [],
      messages: [],
      origin_messages: [],
      onEditing: 0,
      editId: 0
    };
  }

  toggleSelectbox() {
    this.setState({
      opened_selectbox: !this.state.opened_selectbox
    });
    document.querySelector(".dim").style.display = "block";
    document
      .querySelector(".dim")
      .addEventListener("click", background_listner.bind(this));

    function background_listner() {
      this.setState({
        opened_selectbox: false
      });
      document.querySelector(".dim").style.display = "none";
      document
        .querySelector(".dim")
        .removeEventListener("click", background_listner.bind(this));
    }
  }

  toggleAddBtnModal() {
    this.setState({ isOpen_btn_modal: !this.state.isOpen_btn_modal });
  }

  toggleManipulationBtns(event) {
    event.currentTarget.nextSibling.classList.toggle("active");
    return false;
  }

  setInlineBtns() {
    const dataset = {
      text: document.forms[1].inline_text.value,
      url: document.forms[1].inline_url.value
    };

    this.setState({
      message_btns: [...this.state.message_btns, dataset],
      isOpen_btn_modal: false
    });
    document.forms[1].inline_text.value = "";
    document.forms[1].inline_url.value = "";
  }

  deleteInlineBtn(index) {
    const btns = this.state.message_btns;
    if (index === 0) {
      btns.shift();
      this.setState({ message_btns: btns });
    } else if (index === btns.length - 1) {
      btns.pop();
      this.setState({ message_btns: btns });
    } else {
      const merge_left = btns.slice(0, index);
      const merge_right = btns.slice(index + 1);

      this.setState({ message_btns: merge_left.concat(merge_right) });
    }
  }

  editInlineBtn(index) {
    this.deleteInlineBtn(index);
    this.setState({ isOpen_btn_modal: true });
  }

  getInlineBtns() {
    const btns = this.state.message_btns;
    if (btns) {
      return btns.map((btn, index) => {
        return (
          <div className="inline_btn" key={index}>
            <p>{btn.text}</p>
            <p className="whole_url">{btn.url}</p>
            <div
              className="icon elipse_icon"
              onClick={ev => this.toggleManipulationBtns(ev)}
            ></div>
            <div className="inline_btn_manipulate">
              <i
                className="icon edit_icon"
                onClick={() => this.editInlineBtn(index)}
              ></i>
              <i
                className="icon delete_icon"
                onClick={() => this.deleteInlineBtn(index)}
              ></i>
            </div>
          </div>
        );
      });
    }
  }

  change_item(num) {
    if (typeof num === "number") {
      this.setState({
        current_item: num,
        opened_selectbox: false
      });
    }
  }

  uploadedImage(event) {
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return false;
    }
    this.makePreview(file);
    this.setState({ uploadImage: file });
  }

  makePreview(file) {
    const fr = new FileReader();

    fr.onload = function(e) {
      const img_el = document.createElement("img");
      img_el.setAttribute("src", e.target.result);

      const target_el = document.querySelector(".img_preview");
      while (target_el.firstChild) {
        target_el.removeChild(target_el.firstChild);
      }

      document.querySelector(".img_preview").appendChild(img_el);
    };

    fr.readAsDataURL(file);
  }

  sendTestMsg() {}

  changeActiveAnnounce(index) {
    const pre_msg = this.state.origin_messages[index];

    const buttons = JSON.parse(pre_msg.buttons);
    if (buttons) {
      this.setState({
        current_item: parseInt(pre_msg.schedule_type),
        message_btns: [...this.state.message_btns, ...buttons]
      });
    }

    document.forms[0].announce_txt.value = pre_msg.content;
  }

  deleteAnnounce(index) {
    Axios.post("/delAnnounce", {
      chat_id: window.localStorage.getItem("chat_id"),
      ann_id: this.state.origin_messages[index].schedule_id
    }).then(res => {
      if (res.data) {
        this.getAnnouncement();
        Event('Interactions', 'delete interaction', 'Announcement');
      }
    });
  }

  registerAnnounceMsg() {
    const announce_type = document.forms[0].announceType.value;

    const selected_hour = document.forms[0].selectedHour.value;
    const selected_min = document.forms[0].selectedMin.value;
    let selected_date, selected_month, selected_monthofday;

    if (document.forms[0].selectedDate) {
      selected_date = document.forms[0].selectedDate.value.split("-");
      selected_month = selected_date[1];
      selected_monthofday = selected_date[2];
    }

    let selected_weekofday = "";
    if (document.forms[0].selected_weekofday) {
      selected_weekofday = JSON.parse(document.forms[0].selectedDay.value);
    }

    let content = "";
    if (this.state.message_type) {
      content = document.forms[0].announce_txt.value;
    }

    Axios.post("/setAnnounce", {
      chat_id: window.localStorage.getItem("chat_id"),
      type: announce_type,
      month: selected_month,
      monthofday: selected_monthofday,
      hour: selected_hour,
      min: selected_min,
      weekofday: selected_weekofday,
      content: content,
      content_type: this.state.message_type,
      content_img: this.state.uploadImage,
      buttons: JSON.stringify(this.state.message_btns),
      onEditing: this.state.onEditing,
      id: this.state.editId
    }).then(() => {
      this.getAnnouncement();
      document.forms[0].announce_txt.value = "";
      Event('Interactions', 'set interaction', 'Announcement');
    });
  }

  getAnnouncement() {
    Axios.post("/getAnnounce", {
      chat_id: window.localStorage.getItem("chat_id")
    }).then(res => {
      if (res.data) {
        this.setState({
          messages: res.data.map((msg, index) => {
            return (
              <div
                className="message_list"
                key={index}
                onClick={() => this.changeActiveAnnounce(index)}
              >
                <p className="savedMsg_content">{msg.content}</p>
                <p className="savedMsg_type">
                  {msg.schedule_type === "0"
                    ? "once"
                    : msg.schedule_type === "1"
                    ? "daily"
                    : msg.schedule_type === "2"
                    ? "weekly"
                    : msg.schedule_type === "3"
                    ? "montly"
                    : null}
                </p>
                {this.verifyExpire(msg)}
                <div className="savedMsg_manipulation_btns_wrap">
                  <a
                    className="savedMsg_del_btn"
                    onClick={() => this.deleteAnnounce(index)}
                  >
                    Delete
                  </a>
                </div>
              </div>
            );
          }),
          origin_messages: res.data
        });
      } else {
        this.setState({
          messages: [],
          origin_messages: []
        });
      }
    });
  }

  verifyExpire(msg) {
    const cur_time = new Date(Date.now());
    let comparison_time = new Date();
    comparison_time.setMonth(msg.schedule_month);
    comparison_time.setDate(msg.schedule_dayofmonth);
    comparison_time.setHours(msg.schedule_hour);
    comparison_time.setMinutes(msg.schedule_min);

    if (cur_time > comparison_time) {
      return <span className="expired_msg">expried</span>;
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.getAnnouncement();
  }

  render() {
    return (
      <div>
        <h2 className="seg_title">Create an announcement</h2>
        <form className="announcement_seg" method="post">
          <div className="announce_type announcement_row">
            <p className="announce_label">Repeat:</p>
            <div className="selectbox_wrap">
              <input
                type="hidden"
                name="announceType"
                value={this.state.current_item}
              ></input>
              <a
                className="announce_selectbox"
                onClick={() => this.toggleSelectbox()}
              >
                {this.state.current_item === 0
                  ? "once"
                  : this.state.current_item === 1
                  ? "everyday"
                  : this.state.current_item === 2
                  ? "everyweek"
                  : this.state.current_item === 3
                  ? "everymonth"
                  : ""}
              </a>
              <div
                className={
                  this.state.opened_selectbox ? "selectbox open" : "selectbox"
                }
              >
                <p onClick={() => this.change_item(0)}>once</p>
                <p onClick={() => this.change_item(1)}>everyday</p>
                <p onClick={() => this.change_item(2)}>everyweek</p>
                <p onClick={() => this.change_item(3)}>everymonth</p>
              </div>
            </div>
          </div>
          <div className="announce_type announcement_row">
            <p className="announce_label">Date & Time:</p>
            <div className="selectbox_wrap">
              <SettingTime type={this.state.current_item}></SettingTime>
            </div>
          </div>
          <div className="announce_type announcement_row">
            <p className="announce_label">Message:</p>
            <div className="editable_message">
              {this.state.message_type ? (
                <textarea name="announce_txt"></textarea>
              ) : (
                <div className="img_preview"></div>
              )}

              <div className="changeable_types">
                <i
                  className={
                    this.state.message_type
                      ? "icon text_icon active"
                      : "icon text_icon"
                  }
                  onClick={() => this.setState({ message_type: 1 })}
                ></i>
                <span> | </span>
                <label>
                  <input
                    type="file"
                    name="announce_img"
                    onChange={ev => this.uploadedImage(ev)}
                  ></input>
                  <i
                    className={
                      this.state.message_type
                        ? "icon picture_icon"
                        : "icon picture_icon active"
                    }
                    onClick={() => this.setState({ message_type: 0 })}
                  ></i>
                </label>
              </div>
            </div>
          </div>
          <div className="announce_type announcement_row">
            <p></p>
            <p className="announce_desc_add">
              {/* You can style your announcements using markdown or HTML. You can view detailed styling options here. */}
            </p>
          </div>
          <div className="announce_type announcement_row">
            <p className="announce_label">Buttons:</p>
            {this.state.message_btns && this.state.message_btns.length === 0 ? (
              <div
                className="icon add_btn"
                onClick={() => this.toggleAddBtnModal()}
              ></div>
            ) : (
              <div className="inline_btns_wrap">
                {this.getInlineBtns()}
                <div
                  className="icon add_btn"
                  onClick={() => this.toggleAddBtnModal()}
                ></div>
              </div>
            )}
          </div>
          <div className="announce_btn_wrap announcement_row">
            <div></div>
            <div>
              {/* <a className="testsend_btn" onClick={() => this.sendTestMsg()}>
                Test Send
              </a> */}
              <a
                className="send_btn"
                onClick={() => this.registerAnnounceMsg()}
              >
                Send
              </a>
            </div>
          </div>
        </form>

        {this.state.messages.length !== 0 ? (
          <div className="history_messages">
            <h2>Saved Announcements</h2>
            <div className="savedMsg_container">{this.state.messages}</div>
          </div>
        ) : null}

        <div
          className={
            this.state.isOpen_btn_modal
              ? "modal add_inlineBtn_modal open"
              : "modal add_inlineBtn_modal"
          }
        >
          <h2>Create a Button</h2>
          <form>
            <div className="inline_content_wrap">
              <span>Title:</span>
              <div className="inline_content">
                <input
                  type="text"
                  name="inline_text"
                  autoComplete="off"
                ></input>
              </div>
            </div>
            <div className="inline_content_wrap">
              <span>URL:</span>
              <div className="inline_content">
                <input type="text" name="inline_url" autoComplete="off"></input>
              </div>
            </div>

            <a className="add_confirm_btn" onClick={() => this.setInlineBtns()}>
              ADD
            </a>
            <a
              className="cancel_btn"
              onClick={() => this.setState({ isOpen_btn_modal: false })}
            >
              CANCEL
            </a>
          </form>
        </div>
      </div>
    );
  }
}

export default Announcement;
