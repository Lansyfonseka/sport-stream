import { InstagramLogo } from "../../assets/instagram";
import { TelegramLogo } from "../../assets/telegram";
import { TwitterLogo } from "../../assets/twitter";
import { YoutubeLogo } from "../../assets/youtube";
import "./_preHeader.scss";

export default function PreHeader() {
  return (
    <div className="s-preHeader" role="contentinfo">
      <div className="s-preHeader__link">
        הכתובת העדכנית שלנו:
        <a href="https://princebet77.co/" target="_blank" rel="noopener">
          https://princebet77.co/
        </a>
      </div>
      <div className="s-preHeader__social">
        <a
          href="https://www.instagram.com/princebet7070"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          className="s-preHeader__social_icon"
        >
          {InstagramLogo}
        </a>
        {/* <a
          href="https://www.twitter.com/nextbet7"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          className="s-preHeader__social_icon"
        >
          {TwitterLogo}
        </a>
        <a
          href="https://www.youtube.com/@nextbet7"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          className="s-preHeader__social_icon"
        >
          {YoutubeLogo}
        </a> */}
        <a
          href="https://telegram.me/princebetttt"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          className="s-preHeader__social_icon"
        >
          {TelegramLogo}
        </a>
      </div>
    </div>
  );
}
