import React, { useState } from "react";
import Axios from "axios";
import {Event} from '../Tracking';

import '../../style/css/AutoResponse.min.css'

class AutoResponce extends React.Component {
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
      keyword_type: 0,
      onEditing: 0,
      editId: 0
    };
  }

  toggleSelectbox() {
    this.setState({
      opened_selectbox: !this.state.opened_selectbox
    });
  }

  toggleAddBtnModal() {
    this.setState({ isOpen_btn_modal: !this.state.isOpen_btn_modal });
  }

  toggleManipulationBtns(event) {
    event.currentTarget.nextSibling.classList.toggle('active');
    return false;
  }

  setInlineBtns() {
    const dataset = {
        text: document.forms[1].inline_text.value,
        url: document.forms[1].inline_url.value
      }
  
      this.setState({message_btns: [...this.state.message_btns, dataset], isOpen_btn_modal: false})
      document.forms[1].inline_text.value = '';
      document.forms[1].inline_url.value = '';
  }

  deleteInlineBtn(index) {
    const btns = this.state.message_btns;
    if (index === 0) {
        btns.shift();
        this.setState({message_btns: btns});
    } else if (index === btns.length - 1) {
        btns.pop();
        this.setState({message_btns: btns})
    } else {
      const merge_left = btns.slice(0, index);
      const merge_right = btns.slice(index + 1);
      
      this.setState({message_btns: merge_left.concat(merge_right)})
    }
  }

  editInlineBtn(index) {
    this.deleteInlineBtn(index);
    this.setState({isOpen_btn_modal: true});
  }

  getInlineBtns() {
    const btns = this.state.message_btns;
    if (btns) {
      return btns.map((btn, index) => {
        return (
          <div className="inline_btn" key={index}>
            <p>
              {btn.text}
            </p>
            <p className="whole_url">
                {btn.url}
            </p>
            <div className="icon elipse_icon" onClick={(ev) => this.toggleManipulationBtns(ev)}></div>
            <div className="inline_btn_manipulate">
              <i className="icon edit_icon" onClick={() => this.editInlineBtn(index)}></i>
              <i className="icon delete_icon" onClick={() => this.deleteInlineBtn(index)}></i>
            </div>
          </div>
        )
      })
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

  changeActiveFAQ(index) {
    const pre_msg = this.state.origin_messages[index];

    const buttons = JSON.parse(pre_msg.buttons);
    if (buttons) {
        this.setState({
            current_item: parseInt(pre_msg.schedule_type),
            message_btns: [...this.state.message_btns, ...buttons]
        })
    }
    
    document.forms[0].faq_txt.value = pre_msg.faq_response;
    document.forms[0].keywords.value = pre_msg.faq_content;
  }

  editSelectedFAQ(index) {
    this.changeActiveFAQ(index);
    this.setState({onEditing: 1, editId: this.state.origin_messages[index].id});
    return false;
  }

  deleteSelectedFAQ(index) {
      Axios.post('/delFaqlist', {
          id: this.state.origin_messages[index].id,
          chat_id: window.localStorage.getItem('chat_id')
      }).then((res) => {
        if (res.data) {
            this.getFaqList();
            Event('Interactions', 'delete interaction', 'Auto responce');
        }
      })
  }

  registerFAQMsg() {

    let content = "";
    if (this.state.message_type) {
      content = document.forms[0].faq_txt.value;
    }

    var form_data = new FormData();
        
    form_data.append('chat_id', window.localStorage.getItem('chat_id'))
    form_data.append('keyword', document.forms[0].keywords.value)
    form_data.append('response', content)
    form_data.append('response_img', this.state.uploadImage)
    form_data.append('response_type', this.state.message_type ? 'txt' : 'img')
    form_data.append('img_type', this.state.imageType)
    form_data.append('keyword_type', this.state.keyword_type)
    form_data.append('inline_btns', JSON.stringify(this.state.message_btns))
    form_data.append('onEditing', this.state.onEditing);
    if (this.state.onEditing) {
        form_data.append('id', this.state.editId);
    }

    if (form_data.get('chat_id')) {
        Axios.post('pushFaqlist', form_data)
            .then((res) => {
                if (res.data) {
                    this.getFaqList();
                    // this.clearTexts();
                    Event('Interactions', 'set interaction', 'Auto responce');
                }
            })
    } 
  }

  getFaqList() {
    const chat_id = window.localStorage.getItem('chat_id')

    if (chat_id.length !== 0) {
        Axios.post('getFaqlist', {chat_id: chat_id})
        .then((res) => {
            if (res.data) {
                this.setState({
                    messages: res.data.map((msg, index) => {
                        return (
                            <div className="message_list" key={index} onClick={() => this.changeActiveFAQ(index)}>
                                <p>
                                    Keywords
                                </p>
                                <p className="savedMsg_keywords">
                                    {msg.faq_content}
                                </p>
                                <p className="savedMsg_content">
                                    {msg.faq_response}
                                </p>
                                <div className="savedMsg_manipulation_btns_wrap">
                                    <a className="savedMsg_edit_btn" onClick={() => this.editSelectedFAQ(index)}>Edit</a>
                                    <a className="savedMsg_del_btn" onClick={() => this.deleteSelectedFAQ(index)}>Delete</a>
                                </div>
                            </div>
                        )
                    }),
                    origin_messages: res.data
                })
            }
        })
    }
  }

  componentDidMount() {
    this.getFaqList()
  }

  render() {
    return (
      <div>
        <h2 className="seg_title">Create Auto-Response</h2>
        <form className="autores_tb" method="post">
        
          <div className="tb_row">
            <p className="tb_label">Keywords:</p>
            <div className="tb_keyword">
                <input type="text" name="keywords" placeholder="Keyword 1, Keyword 2, Keyword 3"></input>
                <p className="autores_desc_add">
                    Separate keywords with comma(,). Keywords are not case sensitive.
                </p>
            </div>
          </div>
          <div className="tb_row">
              <div className="tb_cell"></div>
              <div className="tb_cell">
                <input type="radio" className="keyword_type" name="keyword_type" value="0" onChange={() => this.setState({keyword_type: 0})} defaultChecked></input>
                <label>Must contain one of these words</label>

                <input type="radio" className="keyword_type" name="keyword_type" value="1" onChange={() => this.setState({keyword_type: 1})}></input>
                <label>Must contain two or more of the keywords</label>
              </div>
          </div>
          <div className="tb_row">
            <p className="tb_label">Message:</p>
            <div className="editable_message">
              {this.state.message_type ? (
                <textarea
                  name="faq_txt"
                ></textarea>
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
          <div className="tb_row">
            <p>
               
            </p>
            <p className="autores_desc_add">
            {/* You can style your announcements using markdown or HTML. You can view detailed styling options here. */}
            </p>
          </div>
          <div className="tb_row">
            <p className="tb_label">Buttons:</p>
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
          <div className="autores_btn_wrap tb_row">
            <div></div>
            <div>
              {/* <a className="testsend_btn" onClick={() => this.sendTestMsg()}>
                Test Send
              </a> */}
              <a
                className="send_btn"
                onClick={() => this.registerFAQMsg()}
              >
                Save
              </a>
            </div>
          </div>
        </form>

        {this.state.messages.length !== 0 ?
          <div className="history_messages">
            <h2>Responses</h2>
            <div className="savedMsg_container">
              {this.state.messages}
            </div>
          </div>
          :
          null}
        
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

export default AutoResponce;
