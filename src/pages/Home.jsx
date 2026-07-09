import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero           from '../components/Home/Hero';
import Welcome        from '../components/Home/Welcome';
import GoalInNumber   from '../components/Home/GoalInNumber';
import ServicesPreview from '../components/Home/ServicesPreview';
import ProductsPreview from '../components/Home/ProductsPreview';
import ClientsPreview  from '../components/Home/ClientsPreview';
import CTABanner       from '../components/Home/CTABanner';
import DealWithBrand   from '../components/Home/DealWithBrand';
import GroupOfCompany  from '../components/Home/GroupOfCompany';

function Home() {
  return (
    <>
      <Helmet>
        <title>Georson Tech Pvt. Ltd – Industrial Engineering & Automation Solutions</title>
        <meta name="description" content="Georson Tech – Leading Industrial Engineering, Automation, IIoT, and Manufacturing Solutions company in Chennai and Coimbatore, Tamil Nadu, India." />
        <meta name="keywords" content="industrial automation, IIoT, electrical panels, PLC, SCADA, engineering solutions, Chennai, Coimbatore" />
        <meta property="og:title" content="Georson Tech – Gateway of Engineering & Technology" />
        <meta property="og:description" content="Industrial Engineering, Automation & IIoT Solutions – Chennai | Coimbatore" />
        <link rel="canonical" href="https://www.georsontech.com/" />
      </Helmet>

      <Hero />
      <GroupOfCompany />
      <Welcome />
      <GoalInNumber />
      <ServicesPreview />
      <ProductsPreview />
      <ClientsPreview />
      <DealWithBrand />
      <CTABanner />
    </>
  );
}

export default Home;