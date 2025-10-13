import './_footer.scss';
import AnnoSportsLogo from '../../assets/anonsports-logo.png'


export default function Footer(){
return (
<footer className="s-footer" role="contentinfo">

  <div class="s-footer__links">
      <a href="https://heylink.me/nextbet7/" target="_blank" rel=""><span>הימורים בשידור חי</span></a>
      <a href="https://heylink.me/nextbet7/" target="_blank" rel=""><span>ספורט אלקטרוני</span></a>
      <a href="https://heylink.me/nextbet7/" target="_blank" rel=""><span> מבצעים</span></a>
      <a href="https://heylink.me/nextbet7/" target="_blank" rel=""><span>ערוץ מבצעים - טלגרם </span></a>
      <a href="https://heylink.me/nextbet7/" target="_blank" rel=""><span> ווטסאפ - הרשמה 24/7  </span></a>
  </div>
  <div class="s-footer__copyright-text">
    בהתאם לחוק מספר 5651, האתר פועל כספק תוכן בלבד. הסרטונים באתר מועלים על ידי המשתמשים שלנו. אם לדעתכם אחד מהסרטונים מפר זכויות יוצרים, אנא פנו אלינו בדוא״ל בצירוף המסמכים המשפטיים הנדרשים, ואנו נסיר את התוכן תוך שני ימי עבודה.
  </div>
  <a className="s-footer__copyright-anon" href="https://2anonsports.online" rel="noopener" title="canlı maç izle">
    <img src={AnnoSportsLogo} alt="Canlı maç yayınları"/>
  </a>
</footer>
)
}