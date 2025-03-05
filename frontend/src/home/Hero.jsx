import Search from "./Search"
import dotsImg from '../assets/dots.png';
import homeBannerImg from '../assets/home-banner.png'

export function Hero() {
    return (
        <>
            <div className="hero-container">
                <div className="hero-text">
                    <img src={dotsImg} alt="" className="dots" />
                    <p className="hero-title">Discover Your Perfect Skill Mentor</p>
                    <p className="hero-info">Transform your career with personalized mentorship that connects you with experts in your field to guide you.</p>
                    <form action="" className="search-container">
                        <input type="text" className="search-input" placeholder="Search..." />
                        <button className="search-button">Search</button>
                    </form>
                </div>
                <img src={homeBannerImg} alt="" />
            </div>
        </>
    )
}

