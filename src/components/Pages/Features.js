import React from "react";
import "../../style/css/Features.min.css";
import { Helmet } from 'react-helmet';
import GRAY_LINE from "../../img/grayline.svg";
import INTERACTION_LINE from "../../img/interaction_line.svg";
import INTERACTION_BUBBLE from "../../img/interaction_bubble.svg";
import MODERATION_LINE from "../../img/moderation_line.svg";
import MODERATION_BUBBLE from "../../img/moderation_bubble.svg";
import ANALYTICS_LINE from "../../img/analytics_line.svg";

class Features extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list_interaction: [
        "Collected Questions",
        "Messages Directed to Admins",
        "Scheduled Announcemnets",
        "Welcome Messages"
      ],
      list_moderation: [
        "Anti-Spam",
        "Filters",
        "Warning Points System",
        "Activity Notification"
      ],
      list_analytics: [
        "Scheduled Reports",
        "User data insights",
        "Community Reports",
        "Bot performance"
      ]
    };
  }

  render() {
    return (
      <div className="features_container">
        <Helmet>
          <title>AQOOM telegram CRM service features</title>
          <meta name="description" content="introduce for Telegram customer relationship management service. let you see all wonderful features as a free!" />
          <meta name="twitter:card" content="summary"></meta>
          <meta name="twitter:title" content="AQOOM CRM bot service" />
          <meta name="twitter:description" content="Telegram CRM bot service. easy to manage your supergroup community and grow it up more effectively." />
          <meta name="twitter:image" content="https://aqoom.chat/AQOOM_logo_whiteBG.jpg" />
          <meta name="twitter:site" content="https://aqoom.chat/" />
        </Helmet>
        <section className="features_intro">
          <h2 className="session_title">just the right features.</h2>
          <p className="session_desc">
            We collected all the features that you need for your growing
            Telegram community. These features can help you have the right tools
            managing and moderating your groups.
          </p>
          <a href="#/signin">Try AQOOM</a>
        </section>

        <section className="features_interaction">
          <img src={GRAY_LINE} alt="aqoom can insteract with all user of your communities"></img>
          <img src={INTERACTION_LINE} alt="user interaction is a key to improve your communities."></img>
          <h2 className="session_title">interaction</h2>
          <ul>
            {this.state.list_interaction.map((val, idx) => {
              return (
                <li key={idx}>
                  <div className="check_icon"></div>
                  <p>{val}</p>
                </li>
              );
            })}
          </ul>
          <p className="session_desc">
            Interacting with your users has never been this easy. With an
            all-in-one interface where you can directly reply to questions,
            answer queries, or just reply to different kind of messages, you’ll
            never miss an opportunity to indulge in to a conversation. You can
            also directly ban, kick, or delete a message in the same message
            log. You can also set different announcements for different times.
          </p>
          <img src={INTERACTION_BUBBLE} alt="telegram CRM feature, available kick, ban, delete message and so on"></img>
        </section>
        <section className="features_moderation">
          <img src={GRAY_LINE} alt="AQOOM gray line"></img>
          <img src={MODERATION_LINE} alt="moderate chat group. available anti spam, message fileter"></img>
          <h2 className="session_title">moderation</h2>
          <ul>
            {this.state.list_moderation.map((val, idx) => {
              return (
                <li key={idx}>
                  <div className="check_icon"></div>
                  <p>{val}</p>
                </li>
              );
            })}
          </ul>
          <p className="session_desc">
            From basic to advanced filters, you know that there’s no message
            that is going to be out of control. You have full control over on
            what are allowed and restricted in your chat group. And with the
            Warning Points System, you have an option to send warnings, ban, or
            kick a member who accumulated a certain amount of points. And even
            if you have not turned on a filter, you’ll be notified on what is on
            and what you could be changed.
          </p>
          <img src={MODERATION_BUBBLE} alt="Telegram chat group moderation feature"></img>
        </section>
        <section className="features_analytics">
          <img src={GRAY_LINE} alt="aqoom gray line"></img>
          <img src={ANALYTICS_LINE} alt="you are able to see an analytics chart of your group. it will make you be inspired."></img>
          <h2 className="session_title">data & analytics</h2>
          <ul>
            {this.state.list_analytics.map((val, idx) => {
              return (
                <li key={idx}>
                  <div className="check_icon"></div>
                  <p>{val}</p>
                </li>
              );
            })}
          </ul>
          <p className="session_desc">
            We provide the right data for your Community Managers to gain
            insights about your users to strategize and formulate your new next
            event or promotion! You can also receive reports whenever you want
            it, no reminders needed! In addition to that you’ll know how much is
            your bot performing in your Telegram groups. So you’ll know if you
            need to be more lenient or if you just have just the right
            restrictions.
          </p>
        </section>
        <img src={GRAY_LINE} alt="aqoom gray line"></img>
        <h4 className="foot_desc">
        Just the right amount of features that fits your needs.
        </h4>
        <a href="#/signin">Try AQOOM</a>
      </div>
    );
  }
}

export default Features;
