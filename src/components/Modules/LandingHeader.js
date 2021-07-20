import React from 'react';
import {Link} from 'react-router-dom';
import AQ_LOGO from '../../img/AQOOM_logo.png';
import AQ_LOGO_BETA from '../../img/aqoom_beta_logo.svg';

function LandingHeader (props) {
    return (
        <header className="App-header">
            <a className="aqoom_logo" href="/">
              <img src={AQ_LOGO_BETA} alt="aqoom logo"></img>
            </a>
            <div className="nav_menus">
              <a href="/#/features">
                Features
              </a>
              {
                props.onLogin 
                ? 
                <Link to="/members" className="signin_btn" onClick={() => {
                    var now = new Date();
                    var time = now.getTime();
                    var expireTime = time + 2 * 3600000;
                    now.setTime(expireTime);

                    document.cookie = "STAY_C=true; expires=" + now.toUTCString();
                    props.setValid(true)
                }}>
                  To Console
                </Link> 
                :
                <Link to="/signin" className="signin_btn">
                Sign in
                </Link>
              }
              
            </div>
          </header>
    )
}

export default LandingHeader;