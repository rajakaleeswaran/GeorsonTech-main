import React from 'react';
import { Helmet } from 'react-helmet-async';
import ClientsBody from "../components/Clients/ClientsBody";

function Clients() {
  return (
    <>
      <Helmet>
        <title>Clients & Testimonials – Georson Tech Pvt. Ltd | Trusted Partner</title>
        <meta name="description" content="View our client list, testimonials from major industry leaders (ABB, Ramco, etc.), and the industries we serve with our automation systems." />
        <link rel="canonical" href="https://www.georsontech.com/clients" />
      </Helmet>
      <ClientsBody />
    </>
  );
}

export default Clients;