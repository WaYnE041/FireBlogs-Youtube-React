import '../styles/About.css';
import { useState, useEffect } from 'react';

function About() {

    useEffect(() => {
        document.title = "About | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

    return (
        <div className="wrapper">
            <div className="about-container">
                <div className="about-profile">
                    <h1 id="text14"><strong>ABOUT ME</strong></h1>
                    <img className="profile-img" src="https://placehold.co/400x400" />
                    
                </div>
                <div className="about-bio">
                    <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Ridiculus non facilisi iaculis; etiam elit dapibus. Nibh sodales mauris quam condimentum mus etiam lobortis. Porttitor elit volutpat eu tincidunt ipsum dapibus risus consectetur dictumst. Fringilla ad ut integer; libero posuere quisque vel. Suscipit potenti dis imperdiet dictum nascetur; eros tempor himenaeos. Eget est eget habitant est ullamcorper natoque tristique integer lacus.</p>
                    <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Ridiculus non facilisi iaculis; etiam elit dapibus. Nibh sodales mauris quam condimentum mus etiam lobortis. Porttitor elit volutpat eu tincidunt ipsum dapibus risus consectetur dictumst. Fringilla ad ut integer; libero posuere quisque vel. Suscipit potenti dis imperdiet dictum nascetur; eros tempor himenaeos. Eget est eget habitant est ullamcorper natoque tristique integer lacus.</p>
                </div>
            </div>
        </div>
    )
}

export default About;