import React from 'react';
import { Helmet } from 'react-helmet-async';
import ServicesBody from "../components/Services/ServicesBody";
import TitleBar from "../components/TitleBar";
import ServicesTitleImg from "../assets/Services/titleImg.png";

function Services() {
  return (
    <>
      <Helmet>
        <title>Services – Georson Tech Pvt. Ltd | Engineering & Automation</title>
        <meta name="description" content="Explore our industrial engineering services: control panel design, PLC/SCADA programming, IIoT deployments, and annual maintenance contracts." />
        <link rel="canonical" href="https://www.georsontech.com/services" />
      </Helmet>

      <TitleBar title="SERVICES" bg={ServicesTitleImg}/>
      <ServicesBody />
    </>
  );
}

export default Services;