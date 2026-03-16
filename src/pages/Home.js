// Home page - combines all home sections
import React from 'react';
import NavbarMain from '../components/NavbarMain';
import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <NavbarMain />
      <Hero />
      <About />
      <Footer />
    </>
  );
};

export default Home;