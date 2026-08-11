import React from "react";
import ContactAgentForm from "../contactAgentForm/AgentForm";
import {
  HiLocationMarker,
  HiOutlinePhoneOutgoing,
  HiOutlineMail,
  HiClock,
} from "react-icons/hi";
import Link from "next/link";
import ContactAgentFormDark from "../contactAgentForm/darkForm";

const Contact = () => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-10 mb-10">
          <div
            className="card bg-white shadow-md rounded px-6 py-4"
            style={{ backgroundColor: "#14222d", color: "#fff" }}
          >
            <h1 className="text-xl font-bold mb-4">Contact Us</h1>
            <div className="space-y-2">
              <p className="flex items-center">
                <HiLocationMarker className="mr-2" />
                29 Jennifer Avenue Ridgehaven SA 5097
              </p>

              <p className="flex items-center">
                <HiOutlinePhoneOutgoing className="mr-2" />
                <span>
                  <Link href="tel:+61415765234">+61 415 765 234</Link>
                </span>
              </p>
              <p className="flex items-center">
                <HiOutlineMail className="mr-2" />
                <span>
                  <Link href="mailto: Info@merorealestate.com.au">
                    Info@merorealestate.com.au
                  </Link>
                </span>
              </p>
              <p className="flex items-center">
                <HiClock className="mr-2" />
                <span>9:00 AM - 5:00 PM (Mon-Fri)</span>
              </p>
            </div>
          </div>
          {/* Embed Google Map */}
          <div
            className="card  shadow-md rounded px-6 py-4 mt-10 mb-10"
            style={{ backgroundColor: "#14222d", color: "#fff" }}
          >
            <h1 className="text-xl font-bold mb-4">Our Location</h1>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.257748498011!2d138.69923359999999!3d-34.82461149265621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0b4bdf432ebc3%3A0xabe9d7ace14ab8e2!2s29%20Jennifer%20Ave%2C%20Ridgehaven%20SA%205097%2C%20Australia!5e0!3m2!1sen!2snp!4v1729790685613!5m2!1sen!2snp"
                width="325"
                height="450"
                loading="lazy"
                className="block lg:hidden"
              ></iframe>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.257748498011!2d138.69923359999999!3d-34.82461149265621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0b4bdf432ebc3%3A0xabe9d7ace14ab8e2!2s29%20Jennifer%20Ave%2C%20Ridgehaven%20SA%205097%2C%20Australia!5e0!3m2!1sen!2snp!4v1729790685613!5m2!1sen!2snp"
                width="700"
                height="450"
                loading="lazy"
                className="hidden lg:block"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="hidden md:block col-span-1">
          <div
            className="card  shadow-md rounded px-6 py-4 mt-10"
            style={{ backgroundColor: "#14222d" }}
          >
            <ContactAgentFormDark />
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div
          className="card  shadow-md rounded px-6 py-4"
          style={{ backgroundColor: "#14222d" }}
        >
          <ContactAgentFormDark />
        </div>
      </div>
    </div>
  );
};

export default Contact;
