
import Header from './Header.jsx'
import { Hero } from './Hero.jsx';
import advCareer from '../assets/advance-career.png';
import findOut from '../assets/find-out.png';
import testimonialAvatar from '../assets/testmonial-person.png'
import logo from '../assets/logo2.png';
import style from './Home.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faEnvelope, faHeart, faMapMarkedAlt, faPhoneAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'


function Home() {
    return (
        <>
            <div className={style.homepage}>
                <div className={style.home}>
                    <Header />
                    <div className={style["home-container"]}>
                        <Hero />
                    </div>
                </div>
                <div className={style["services"]}>
                    <div className={style["services-container"]}>
                        <img src={advCareer} alt="" />
                        <div className={style["services-text"]}>
                            <p className={style["caption"]}>Comprehensive Services</p>
                            <p className={style["hero-title"]}>Explore Our Diverse Mentorship Offerings</p>
                            <p className={style["hero-info"]}>MentorVibe provides a wide range of mentorship services designed to enhance skills, insights, and career trajectories through expert guidance and personalized connections.</p>
                            <p className={style["hero-info"]}>Our offerings include one-on-one mentorship, group workshops, and a rich resource library to support your learning journey.</p>
                            <button className={style["normal-button"]}>Get Started</button>
                        </div>
                    </div>
                </div>
                <div className={style["features"]}>
                    <div className={style["features-container"]}>
                        <div className={style["services-text"]}>
                            <p className={style["caption"]}>Unique Advantages</p>
                            <p className={style["hero-title"]}>Explore Exclusive Features of MentorVibe</p>
                            <p className={style["hero-info"]}>MentorVibe offers unique features like personalized mentor matching, live workshops, and ongoing support to enhance your learning experience every step of the way.</p>
                            <div className={style["features-list"]}>
                                <p className={style["hero-info"]}> <FontAwesomeIcon  className={style.fc}  icon={faCheckCircle} /> Personalized Connections</p>
                                <p className={style["hero-info"]}> <FontAwesomeIcon className={style.fc} icon={faCheckCircle} /> Continuous Support</p>
                                <p className={style["hero-info"]}> <FontAwesomeIcon  className={style.fc}  icon={faCheckCircle} /> Expert-Led Workshops</p>
                            </div>
                            <button className={style["normal-button"]}>Join Now</button>
                        </div>
                        <img src={findOut} alt="" />
                    </div>
                </div>
                <div className={style["testimonials"]}>
                    <div className={style["testimonials-container"]}>
                        <p className={style["caption"]}>Real Testimonials</p>
                        <p className={style["hero-title"]}>User Experiences</p>
                        <div className={style["testimonial-card"]}>
                            <img src={testimonialAvatar} alt="" className={style["user-avatar"]} />
                            <div className={style["user-content"]}>
                                <p className={style['user-name']}>Priya Singh</p>
                                <p className={style["hero-info"]}>
                                    MentorVibe has greatly enhanced my career journey. The personalized mentoring sessions have provided me with the clarity and direction I desperately needed.
                                </p>
                            </div>
                            <p className={style["stars"]}>
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                            </p>
                        </div>
                    </div>
                </div>
                <div className={style["footer"]}>
                    <div className={style["footer-container"]}>
                        <div className={style["footer-content"]}>
                            <div className={style["footer-about"]}>
                                <div className={style["logo-container"]}>
                                    <img className={style["logo-img"]} src={logo} alt="mentorvibe logo image" />
                                    <div className={style["logo-text"]}>mentorvibe</div>
                                </div>
                                <p>MentorVibe connects learners with experienced mentors across diverse fields, fostering personal and professional growth for everyone.</p>
                            </div>
                            <div className={style["quick-links"]}>
                                <p>QUICK LINKS</p>
                                <a href="#" onClick={(e) => e.preventDefault()}>ABOUT</a>
                                <a href="#" onClick={(e) => e.preventDefault()}>SERVICE</a>
                                <a href="#" onClick={(e) => e.preventDefault()}>TERMS</a>
                            </div>
                            <div className={style["contact"]}>
                                <p>CONTACT</p>
                                <div className={style["contact-div"]}>
                                    <FontAwesomeIcon icon={faMapMarkedAlt} />
                                    <p>123 Mentor St, Learning City, LC 560003</p>
                                </div>
                                <div className={style["contact-div"]}>
                                    <FontAwesomeIcon icon={faPhoneAlt} />
                                    <p>(+91) 72383 23143</p>
                                </div>
                                <div className={style["contact-div"]}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <p>support@mentorvibe.site</p>
                                </div>
                            </div>
                        </div>
                        <div className={style["copyright"]}>
                            © 2025 . All Rights Reserved.
                            <p className={style["credits"]}>Made by Team : <span className={style['team-names']}><span id={style.dk}>Deepak</span>|<span id={style.an}>Amitesh</span>|<span id={style.as}>Asha</span></span></p>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}


export default Home;

