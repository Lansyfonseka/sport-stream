import './_adBanner.scss';

export default function AdBanner({imgUrl, link}) {


  return (
    <div className='c-ad_banner'>
      <a href={link} target="_blank">
        <img src={imgUrl} alt="ad-banner"/>
      </a>
    </div>
  )
}