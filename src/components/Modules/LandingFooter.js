import React from 'react';
import AQ_LOGO_W from '../../img/AQOOM_whitelogo.svg';

function LandingFooter (props) {
    return (
        <div className="footer">
            <div className="footer_container">
              <div className="footer_left">
                <div className="aqoom_logo">
                  <img src={AQ_LOGO_W} alt="aqoom logo"></img>
                </div>
                <div className="aqoom_right">
                  All rights reserved 2020 © AQOOM
                </div>
              </div>
              <div className="footer_right">
                <a href="https://www.termsofusegenerator.net/live.php?token=bfjrGrvymG981xJEZe0FNhD9m93wfkm6" target="_blank">
                  Terms Of Use
                </a>
                <a href="http://aqoom.info/" target="_blank">
                  ABOUT US
                </a>
                <a href="mailto:contact@aqoom.com">
                  CONTACT US
                </a>
              </div>
            </div>
          </div>
    )
}

export default LandingFooter;