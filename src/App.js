import React, { useState } from "react";
import { Route, Switch, HashRouter as Router } from "react-router-dom";
import ReactGA from 'react-ga';
import {createBrowserHistory} from 'history';
import "./App.css";

import RegisterChat from "./components/Pages/Register_chat";
import Signin from './components/Pages/Signin';
import Features from './components/Pages/Features';
import LeftNav from "./components/Modules/LeftNav";
import RightDrawer_m from './components/Modules/RightDrawer_m';
import Header from './components/Modules/Header_main';
import LandingFooter from './components/Modules/LandingFooter';
import LandingHeader from './components/Modules/LandingHeader';

import Messages from './components/Pages/Messages';
import MessageLog from './components/Pages/MessageLog';
import Users from "./components/Pages/UserManager";
import User from './components/Pages/User';
import Intereactions from './components/Pages/Interactions';
import AntiSpam from './components/Pages/AntiSpam';
import Settings from './components/Pages/Settings';
import Analystic from './components/Pages/Analystic';

import Axios from "axios";
// Axios.defaults.baseURL = "https://chatbot-258301.appspot.com/api/";
// Axios.defaults.baseURL = "http://localhost:4000/api/";
Axios.defaults.baseURL = "https://hysoop.com/api/"

ReactGA.initialize("UA-125314475-4", {
  debug: true
});

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.hash }); // Update the user's current page
  ReactGA.pageview(location.hash); // Record a pageview for the given page
});

function App() {
  const [isValid, setIsValid] = useState(false);
  const [statusNav, setStatusNav] = useState("word");
  const [chatInfo, setChatInfo] = useState([]);
  const [botId, setBotId] = useState('1945387060:AAFhtD9o3tJVaj_x8f3v8Ztc9iZZZGEjJds');
  const [botName, setBotName] = useState('aqoom_bot')
  // const [botId, setBotId] = useState('822428347:AAGXao7qTxCL5MoqQyeSqPc7opK607fA51I');
  // const [botName, setBotName] = useState('aqoom_test_bot')
  
  const isLiving = getCookie("living") == 'true';
  const inConsole = getCookie('STAY_C') == 'true';

  function getCookie(id) {
    const cookies = document.cookie.split(";");
    
    for (var cookie of cookies) {
      var parse = cookie.split("=");
      if (parse[0].trim() === id) {
        return parse[1];
      }
    }
  }

  if (isValid || inConsole) {
    return (
      <Router basename="/chatmanager" history={history}>
        <Header botId={botId}></Header>
        <RightDrawer_m setStatus={setStatusNav} statusNav={statusNav} setChatInfo={setChatInfo} botId={botId}></RightDrawer_m>
        <div className="main_container">
          <LeftNav setStatus={setStatusNav} statusNav={statusNav} setChatInfo={setChatInfo} botId={botId}></LeftNav>
          <section className="section_content">
            <Switch>
              <Route path="/" exact render={() => <Users botId={botId}></Users>}></Route>

              <Route path="/analytics" render={() => <Analystic botId={botId}></Analystic>}></Route>
              <Route path="/members" render={() => <Users botId={botId}></Users>}></Route>
              <Route path="/messages" render={() => <Messages botId={botId}></Messages>}></Route>
              <Route path="/user" render={() => <User botId={botId}></User>}></Route>
              <Route path="/logs" render={() => <MessageLog botId={botId}></MessageLog>}></Route>
              <Route path="/interactions" render={() => <Intereactions botId={botId}></Intereactions>}></Route>
              <Route path="/antispam" render={() => <AntiSpam botId={botId}></AntiSpam>}></Route>
              <Route path="/settings" render={() => <Settings botId={botId}></Settings>}></Route>
            </Switch>
          </section>
          <div className="dim"></div>
        </div>
      </Router>
    );
  } else {
    return (
      <Router history={history}>
        <div className="App">
          <LandingHeader onLogin={isLiving} setValid={setIsValid}></LandingHeader>
          <Switch>
            <Route path="/" exact render={() => <RegisterChat></RegisterChat>}></Route>
            <Route path="/features" render={() => <Features></Features>}></Route>
            <Route path="/signin" render={() => <Signin botName={botName}></Signin>}></Route>
          </Switch>
          <LandingFooter></LandingFooter>
        </div>
      </Router>
    )
  }
}

export default App;
