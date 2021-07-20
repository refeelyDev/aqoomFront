import React from "react";
import Axios from "axios";
import {Event} from '../Tracking';

import "../../style/css/StartMenu_reg.min.css";

class FAQ_register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message_type: 1,
      uploadImage: '',
      imageType: '',
      messages: [],
      origin_msg: [],
      message_btns: [],
      isOpen: false,
      crr_message: [],
      onEditing: 0,
      editId: 0
    };
  }

  uploadedImage(event) {
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return false;
    }
    this.makePreview(file);
    this.setState({imageType: file.type.split('/')[1], uploadImage: file });
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

  removeImagePreview() {
    const target_el = document.querySelector(".img_preview");
    while (target_el.firstChild) {
      target_el.removeChild(target_el.firstChild);
    }
  }

  clearTexts() {
    if (this.state.message_type) {
      document.querySelector("textarea[name=welcome_txt]").value = "";
    } else {
      this.removeImagePreview();
    }

    return true;
  }

  submit_startmenu(event) {
    var form_data = new FormData();

    form_data.append("chat_id", window.localStorage.getItem("chat_id"));
    form_data.append("content_text", document.forms[0].welcome_txt.value);
    form_data.append("content_img", this.state.uploadImage);
    form_data.append("content_type", this.state.message_type ? "txt" : "img");
    form_data.append("img_type", this.state.imageType);
    form_data.append('inline_btns', JSON.stringify(this.state.message_btns));
    if (this.state.onEditing) {
      form_data.append('id', this.state.editId);
    }

    if (form_data.get("chat_id")) {
      Axios.post("pushStartMenu", form_data).then(res => {
        if (res.data) {
          this.getStartMenu();
          this.clearTexts();
          Event('Interactions', 'set interaction', 'Welcome message');
        }
      });
    }
  }

  convertToBase64(img, type, targetid) {
    if (img !== null) {
      var blob = new Blob([img], { type: "image/" + type });
      var reader = new FileReader();

      reader.onload = function(file) {
        var img_tag = document.querySelector("#" + targetid);
        img_tag.src = file.target.result;
      };
      reader.readAsDataURL(blob);
    }
  }

  getStartMenu() {
    Axios.post("/getStartMenu", {
      chat_id: window.localStorage.getItem("chat_id")
    })

    Axios.post("/getStartMenuAll", {
      chat_id: window.localStorage.getItem("chat_id")
    }).then(res => {
      if (res.data) {
        this.setState({messages: res.data.map((msg, index) => {
          return (
            <div className="message_list" key={index}>
              <p className="savedMsg_content">
                {msg.response_type === 'txt' ?
                  msg.content_txt
                  :msg.content_img}
              </p>
              <div className="savedMsg_manipulation_btns_wrap">
                <a className="savedMsg_edit_btn" onClick={() => this.editSelectedWelcome(index)}>Edit</a>
                <a className="savedMsg_del_btn" onClick={() => this.deleteSelectdWelcome(index)}>Delete</a>
              </div>
            </div>
          )
        }), origin_msg: res.data})
      }
    });
  }

  editSelectedWelcome(index) {
    const welcome_msg = this.state.origin_msg[index];
    
    document.forms[0].welcome_txt.value = welcome_msg.content_txt;
    this.setState({onEditing: 1, editId: this.state.origin_msg[index].id, message_btns: JSON.parse(welcome_msg.buttons)});
  }

  deleteSelectdWelcome(index) {
    Axios.post('/delStartMenu', {
      chat_id: window.localStorage.getItem('chat_id'),
      id: this.state.origin_msg[index].id
    }).then((res) => {
      if (res.data) {
        this.getStartMenu();
        Event('Interactions', 'delete interaction', 'Welcome message');
      }
    })
  }

  toggleAddBtnModal() {
    this.setState({isOpen: !this.state.isOpen})
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

    this.setState({message_btns: [...this.state.message_btns, dataset], isOpen: false})
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
    this.setState({isOpen: true});
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

  componentDidMount() {
    this.getStartMenu();
  }

  render() {
    return (
      <div className="startmenu_section">
        <h2 className="seg_title">
          Welcome Message for New Members
        </h2>
        <form method="post" className="startmenu_tb">
          <div className="tb_row">
            <p className="tb_label">
                Message:
            </p>
            <div className="editable_message">
                {
                    this.state.message_type ?
                    <textarea name="welcome_txt" value={this.state.crr_message ? this.state.crr_message.content_txt : ''}>
                      
                    </textarea>
                    :
                    <div className="img_preview">
                      {this.state.crr_message ? 
                      <img src={this.state.crr_message.content_img} alt="img preview"></img>
                      : 
                      ''}
                    </div>
                }
                
                <div className="changeable_types">
                    <i className={this.state.message_type ? "icon text_icon active" : "icon text_icon"} onClick={() => this.setState({message_type: 1})}></i>
                    <span> | </span>
                    <label>
                        <input type="file" name="announce_img" onChange={(ev) => this.uploadedImage(ev)}></input>
                        <i className={this.state.message_type ? "icon picture_icon" : "icon picture_icon active"} onClick={() => this.setState({message_type: 0})}></i>
                    </label>
                </div>
            </div>
          </div>
          <div className="tb_row">
            <p>
               
            </p>
            <p className="welcome_desc_add">
            {/* You can style your welcome message using markdown or HTML. Type [user] to mention a member’s name. You can view detailed styling options here. */}
            </p>
          </div>
          <div className="tb_row">
            <p className="tb_label">
                Buttons:
            </p>
            {
              this.state.message_btns && this.state.message_btns.length === 0 ?
              <div className="icon add_btn" onClick={() => this.toggleAddBtnModal()}>

              </div>
              :
              <div className="inline_btns_wrap">
                {this.getInlineBtns()}
                <div className="icon add_btn" onClick={() => this.toggleAddBtnModal()}></div>
              </div>
              
            }
          </div>
          <div className="tb_row startmenu_btn_wrap">
              <div></div>
              <div>
                  {/* <a className="testsend_btn" onClick={() => this.sendTestMsg()}>Test Send</a> */}
                  <a className="send_btn" onClick={(ev) => this.submit_startmenu(ev)}>Save</a>
              </div>
          </div>
        </form>
        {this.state.messages.length !== 0 ?
          <div className="history_messages">
            <h2>Saved Welcome Messages</h2>
            <p>If you have saved more than one, welcome messages will be selected randomly.</p>
            <div className="savedMsg_container">
              {this.state.messages}
            </div>
          </div>
          :
          null}
        <div className={this.state.isOpen ? 'modal add_inlineBtn_modal open' : 'modal add_inlineBtn_modal'}>
          <h2>Create a Button</h2>
          <form>
            <div className="inline_content_wrap">
              <span>Title:</span>
              <div className="inline_content">
                <input type="text" name="inline_text" autoComplete="off"></input>
              </div>
 
            </div>
            <div className="inline_content_wrap">
              <span>URL:</span>
              <div className="inline_content">
                <input type="text" name="inline_url" autoComplete="off"></input>
              </div>
            </div>

            <a className="add_confirm_btn" onClick={() => this.setInlineBtns()}>ADD</a>
            <a className="cancel_btn" onClick={() => this.setState({isOpen: false})}>CANCEL</a>
          </form>
        </div>
      </div>
    );
  }
}

export default FAQ_register;
