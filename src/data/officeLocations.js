/**
 * @file officeLocations.js
 * @description Centralized, static office location configuration for Georson Tech.
 * Provides exact map embed links and short links for Google Maps navigation.
 */

export const OFFICE_LOCATIONS = [
  {
    id: 1,
    office_name: "Chennai Head Office",
    office_type: "Registered Office",
    address: "No. #4/8, Sriram Nagar Main Road, Karambakkam, Porur, Chennai – 600 116.",
    phone: "+91 98407 80897",
    email: "projects@georsontech.com",
    google_map_link: "https://maps.google.com/maps?q=Georson+Tech+Private+Limited+Porur+Chennai&z=15&output=embed",
    direct_map_link: "https://maps.app.goo.gl/hknZvLJfCXSG1mP46"
  },
  {
    id: 2,
    office_name: "Coimbatore Unit-1",
    office_type: "Manufacturing Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    secondary_phone: "+91 78456 92697",
    email: "covai@georsontech.com",
    google_map_link: "https://maps.google.com/maps?q=GEORSON+TECH+PRIVATE+LIMITED+Kuppepalayam+Coimbatore&z=15&output=embed",
    direct_map_link: "https://maps.app.goo.gl/J6vjApmbvH8SKBvy6"
  },
  {
    id: 3,
    office_name: "Coimbatore Unit-2",
    office_type: "Service Unit",
    address: "Coimbatore, Tamil Nadu, India.",
    phone: "+91 95000 81901",
    secondary_phone: "+91 78456 92697",
    email: "covai@georsontech.com",
    google_map_link: "https://maps.google.com/maps?q=GEORSON+TECH+PRIVATE+LIMITED+Palathurai+Road+Coimbatore&z=15&output=embed",
    direct_map_link: "https://maps.app.goo.gl/JN6vJMWp4aAeb4Kt9"
  }
];

export default OFFICE_LOCATIONS;
