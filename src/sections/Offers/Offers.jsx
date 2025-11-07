import OfferImg1 from "../../assets/1.png";
import OfferImg2 from "../../assets/2.png";
import OfferImg3 from "../../assets/3.png";
import OfferImg4 from "../../assets/4.png";
import OfferImg5 from "../../assets/5.png";
import OfferImg6 from "../../assets/6.png";
import OfferImg7 from "../../assets/7.png";
import OfferImg8 from "../../assets/8.png";

import "./_offers.scss";

export default function Offers() {
  return (
    <div className="s-offers">
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link"
      >
        <img src={OfferImg1} alt="Kampanya 1" className="s-offers__link_img" />
      </a>
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link"
      >
        <img src={OfferImg2} alt="Kampanya 1" className="s-offers__link_img" />
      </a>
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link"
      >
        <img src={OfferImg3} alt="Kampanya 1" className="s-offers__link_img" />
      </a>
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link"
      >
        <img src={OfferImg4} alt="Kampanya 1" className="s-offers__link_img" />
      </a>
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link"
      >
        <img src={OfferImg5} alt="Kampanya 1" className="s-offers__link_img" />
      </a>
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link"
      >
        <img src={OfferImg6} alt="Kampanya 1" className="s-offers__link_img" />
      </a>
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link"
      >
        <img src={OfferImg7} alt="Kampanya 7" className="s-offers__link_img" />
      </a>
      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        className="s-offers__link s-offers__link--wide"
      >
        <img
          src={OfferImg8}
          alt="Kampanya 8"
          className="s-offers__link_img s-offers__link_img__8"
        />
      </a>
    </div>
  );
}
