
import Header from './Header.jsx'
import { Hero } from './Hero.jsx';
import advCareer from '../assets/advance-career.png';
import findOut from '../assets/find-out.png';
import testimonialAvatar from '../assets/testmonial-person.png'
import logo from '../assets/logo2.png';

function Home() {
    return (
        <>
            <div className="home">
                <div className="home-container">
                    <Header />
                    <Hero />
                </div>
            </div>
            <div className="services">
                <div className="services-container">
                    <img src={advCareer} alt="" />
                    <div className="services-text">
                        <p className="caption">Comprehensive Services</p>
                        <p className="hero-title">Explore Our Diverse Mentorship Offerings</p>
                        <p className="hero-info">MentorVibe provides a wide range of mentorship services designed to enhance skills, insights, and career trajectories through expert guidance and personalized connections.</p>
                        <p className="hero-info">Our offerings include one-on-one mentorship, group workshops, and a rich resource library to support your learning journey.</p>
                        <button className="normal-button">Get Started</button>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="features-container">
                    <div className="services-text">
                        <p className="caption">Unique Advantages</p>
                        <p className="hero-title">Explore Exclusive Features of MentorVibe</p>
                        <p className="hero-info">MentorVibe offers unique features like personalized mentor matching, live workshops, and ongoing support to enhance your learning experience every step of the way.</p>
                        <div className="features-list">
                            <p className="hero-info"><i className="fas fa-check-circle"></i> Personalized Connections</p>
                            <p className="hero-info"><i className="fas fa-check-circle"></i> Continuous Support</p>
                            <p className="hero-info"><i className="fas fa-check-circle"></i> Expert-Led Workshops</p>
                        </div>
                        <button className="normal-button">Join Now</button>
                    </div>
                    <img src={findOut} alt="" />
                </div>
            </div>
            <div className="testimonials">
                <div className="testimonials-container">
                    <p className="caption">Real Testimonials</p>
                    <p className="hero-title">User Experiences</p>
                    <div className="testimonial-card">
                        <img src={testimonialAvatar} alt="" className="user-avatar" />
                        <div className="user-content">
                            <p className='user-name'>Priya Singh</p>
                            <p className="hero-info">
                                MentorVibe has greatly enhanced my career journey. The personalized mentoring sessions have provided me with the clarity and direction I desperately needed.
                            </p>
                        </div>
                        <p className="stars">
                            <i className='fas fa-star'></i>
                            <i className='fas fa-star'></i>
                            <i className='fas fa-star'></i>
                            <i className='fas fa-star'></i>
                            <i className='fas fa-star'></i>
                        </p>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-about">
                            <div className="logo-container">
                                <img className="logo-img" src={logo} alt="mentorvibe logo image" />
                                <div className="logo-text">mentorvibe</div>
                            </div>
                            <p>MentorVibe connects learners with experienced mentors across diverse fields, fostering personal and professional growth for everyone.</p>
                        </div>
                        <div className="quick-links">
                            <p>QUICK LINKS</p>
                            <a href="#" onClick={(e)=> e.preventDefault()}>ABOUT</a>
                            <a href="#" onClick={(e)=> e.preventDefault()}>SERVICE</a>
                            <a href="#" onClick={(e)=> e.preventDefault()}>TERMS</a>
                        </div>
                        <div className="contact">
                            <p>CONTACT</p>
                            <div className="contact-div">
                                <i className='fas fa-map-marker-alt'></i>
                                <p>123 Mentor St, Learning City, LC 560003</p>
                            </div>
                            <div className="contact-div">
                                <i className='fas fa-phone-alt'></i>
                                <p>(+91) 72383 23143</p>
                            </div>
                            <div className="contact-div">
                                <i className='fa fa-envelope'></i>
                                <p>support@mentorvibe.site</p>
                            </div>
                        </div>
                    </div>
                    <div className="copyright">
                        © 2025 . All Rights Reserved.
                        <p className="credits">Made with <i class="fa-solid fa-heart"></i> by Team : <span className='team-names'><span id="dk">Deepak</span>|<span id="as">Amitesh</span>|<span id='an'>Asha</span></span></p>
                    </div>

                </div>
            </div>

        </>
    )
}


export default Home;

