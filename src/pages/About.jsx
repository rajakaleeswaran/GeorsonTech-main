import React from 'react';
import { Helmet } from 'react-helmet-async';
import AboutIntro from "../components/About/AboutIntro";
import Timeline from "../components/About/Timeline";
import Features from "../components/About/Features";
import Stats from "../components/About/Stats";
import Locations from "../components/About/Locations";
import "../styles/About.css";
import TitleBar from "../components/TitleBar";
import AboutTitleImg from "../assets/About/titleImg.png";

function About() {
  return (
    <>
      <Helmet>
        <title>About Us – Georson Tech Pvt. Ltd | Company History & Mission</title>
        <meta name="description" content="Discover Georson Tech's corporate background, mission, vision, core values, timeline, and our multiple office locations in Chennai and Coimbatore." />
        <link rel="canonical" href="https://www.georsontech.com/about" />
      </Helmet>

      <TitleBar title="ABOUT US" bg={AboutTitleImg}/>
      <AboutIntro />
      <Timeline />
      <Stats/>
      <Features />
      <Locations />
    </>
  );
}

export default About;