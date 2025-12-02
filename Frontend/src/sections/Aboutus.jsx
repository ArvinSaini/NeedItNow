import React from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import Image1 from '../assets/arvin.jpg';

const Aboutus = () => {
    return (
        <>
            <Navbar />
            <div className="about text-center rounded-lg shadow-lg p-3 pt-20 min-h-screen bg-gradient-to-br from-[#F9E7B2]/20 via-white to-[#D34E4E]/5">
                <h1 className="text-4xl font-bold text-primary mb-4">About <span className="text-[#D34E4E]">Me</span></h1>
                <h2 className="text-2xl mb-8">Made with passion by:</h2>
                <div className="details flex justify-center">
                    <div className="member bg-gradient-to-br from-[#F9E7B2]/50 to-[#D34E4E]/20 rounded-lg shadow-lg p-8 text-secondary max-w-md">
                        <h3 className="text-2xl font-bold mb-6">Arvin Saini</h3>
                        <img src={Image1} alt="Arvin Saini" className="rounded-lg mb-6" />
                        <div className="social-icons flex justify-center gap-4">
                            <a href="https://www.instagram.com/arvinsaini23/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <FontAwesomeIcon className='h-12 text-black hover:text-[#D34E4E] transition-colors' icon={faInstagram} />
                            </a>
                            <a href="https://www.linkedin.com/in/ArvinSaini/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <FontAwesomeIcon className='h-12 text-black hover:text-[#D34E4E] transition-colors' icon={faLinkedin} />
                            </a>
                            <a href="https://github.com/ArvinSaini" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <FontAwesomeIcon className='h-12 text-black hover:text-[#D34E4E] transition-colors' icon={faGithub} />
                            </a>
                        </div>
                    </div>
                </div>
                <p className='pt-8 text-lg'>Connect with me on social media!</p>
            </div>
        </>
    );
};

export default Aboutus;
