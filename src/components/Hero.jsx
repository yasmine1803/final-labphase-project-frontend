// Hero section component
import React from 'react';
import heroBg from '../assets/hero_bg.jpeg';

const Hero = () => {
  return (
    <section 
      id="hero" 
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBg})`
      }}
    >
      <div className="hero-content">
        <h1>Simple recipes for independent living</h1>
        <p>Cook smart, eat well, wherever you are.</p>
      </div>
    </section>
  );
};

export default Hero;