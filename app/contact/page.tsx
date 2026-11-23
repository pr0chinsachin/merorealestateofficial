import { ArrowUpRightIcon, ClockIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ContactAgentForm from "../contactAgentForm/darkForm";
import styles from "./contact.module.css";

const officeAddress = "29 Jennifer Avenue, Ridgehaven SA 5097";
const mapEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.257748498011!2d138.69923359999999!3d-34.82461149265621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0b4bdf432ebc3%3A0xabe9d7ace14ab8e2!2s29%20Jennifer%20Ave%2C%20Ridgehaven%20SA%205097%2C%20Australia!5e0!3m2!1sen!2snp!4v1729790685613!5m2!1sen!2snp";
const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeAddress)}`;

export default function Contact() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Contact Us</span>
        </nav>

        <header className={styles.hero}>
          <h1>Contact Us</h1>
          <p>Get in touch with our South Australian team for help buying, renting, selling, or managing a property.</p>
        </header>

        <div className={styles.layout}>
          <section className={styles.office} aria-labelledby="office-heading">
            <h2 id="office-heading">Our Ridgehaven office</h2>
            <address>
              <p><MapPinIcon aria-hidden="true" />{officeAddress}</p>
              <p><PhoneIcon aria-hidden="true" /><a href="tel:+61415765234">+61 415 765 234</a></p>
              <p><EnvelopeIcon aria-hidden="true" /><a href="mailto:info@merorealestate.com.au">info@merorealestate.com.au</a></p>
              <p><ClockIcon aria-hidden="true" />Monday–Friday, 9:00 am–5:00 pm</p>
            </address>
            <iframe className={styles.map} src={mapEmbed} title="Map of the Mero Real Estate Ridgehaven office" loading="lazy" allowFullScreen />
            <a className={styles.directions} href={directions} target="_blank" rel="noreferrer">
              Get directions <ArrowUpRightIcon aria-hidden="true" />
            </a>
          </section>

          <section className={styles.enquiry} aria-labelledby="enquiry-heading">
            <h2 id="enquiry-heading">Send an enquiry</h2>
            <p>Tell us how we can help and leave your contact details so our team can get back to you.</p>
            <ContactAgentForm listingAddress="" />
          </section>
        </div>
      </div>
    </div>
  );
}
