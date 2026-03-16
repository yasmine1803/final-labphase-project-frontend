// About section component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import aboutImg from '../assets/about_img.jpeg';

const About = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="about-section">
      <div className="about-image">
        <img src={aboutImg} alt="Cooking together" />
      </div>
      <div className="about-content">
        <h2>About Bitely</h2>
        <p>
          Bitely is a simple platform where people share recipes from their homes 
          and cultures. Discover meals, save your favorites, and build your own 
          cooking library. Whether you're a student abroad or a young professional, 
          we're here to make cooking simple and enjoyable.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/recipes')}>
          Explore Recipes
        </button>
      </div>
    </section>
  );
};

export default About;