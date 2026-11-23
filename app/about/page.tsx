import { ArrowRightIcon, CheckIcon, ClockIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import ContactAgentForm from "../contactAgentForm/darkForm";
import founder from "./images/founder.jpg";
import styles from "./about.module.css";

const services = [
  "Buying a home or investment property",
  "Finding a rental",
  "Selling your property and requesting an appraisal",
  "Exploring house and land options",
  "Managing an investment property",
  "Getting advice on the South Australian market",
];

const steps = [
  { title: "Tell us what you need", detail: "Share your property goals, preferred location, and any questions with our team." },
  { title: "Explore your options", detail: "We’ll discuss suitable listings or services based on what you’re looking for." },
  { title: "Plan the next step", detail: "Depending on your goal, we can help you arrange an inspection, request an appraisal, or discuss property management." },
];

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">About Us</span>
        </nav>

        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>About Mero Real Estate</p>
            <h1>Real estate guidance for South Australia</h1>
            <p className={styles.intro}>
              We help buyers, sellers, renters, and investors make informed property decisions.
              Our team brings local market knowledge and advice tailored to your goals.
            </p>
            <div className={styles.actions}>
              <a href="#request-callback" className={styles.primary}>Request a callback <ArrowRightIcon aria-hidden="true" /></a>
              <Link href="/services" className={styles.secondary}>Explore our services</Link>
            </div>
          </div>
          <figure className={styles.founder}>
            <Image src={founder} alt="" width={240} height={240} priority className={styles.portrait} />
            <figcaption>
              <strong>Pushpa Maharjan</strong>
              <span>Founder</span>
              <a href="mailto:pushpa.maharjan@merorealestate.com.au">Email Pushpa</a>
            </figcaption>
          </figure>
        </header>

        <div className={styles.layout}>
          <div className={styles.content}>
            <section>
              <h2>What we can help with</h2>
              <ul className={styles.services}>
                {services.map((service) => (
                  <li key={service}><CheckIcon aria-hidden="true" />{service}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2>How we work</h2>
              <ol className={styles.steps}>
                {steps.map(({ title, detail }, index) => (
                  <li key={title}>
                    <span aria-hidden="true">{index + 1}</span>
                    <div><h3>{title}</h3><p>{detail}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2>Common questions</h2>
              <div className={styles.questions}>
                <details>
                  <summary>Where does Mero Real Estate operate?</summary>
                  <p>We work with clients in South Australia. Our office is in Ridgehaven.</p>
                </details>
                <details>
                  <summary>Where can I see available properties?</summary>
                  <p>Browse our available properties from the <Link href="/#available-properties">Buy and Rent section</Link>, or choose a category on the <Link href="/services">Services page</Link>.</p>
                </details>
                <details>
                  <summary>How do I request an appraisal?</summary>
                  <p>Choose Sale on the <Link href="/services">Services page</Link> to send an appraisal request with your property details.</p>
                </details>
              </div>
            </section>

            <section className={styles.office}>
              <h2>Our Ridgehaven office</h2>
              <address>
                <p><MapPinIcon aria-hidden="true" />29 Jennifer Avenue, Ridgehaven SA 5097</p>
                <p><PhoneIcon aria-hidden="true" /><a href="tel:+61415765234">+61 415 765 234</a></p>
                <p><EnvelopeIcon aria-hidden="true" /><a href="mailto:info@merorealestate.com.au">info@merorealestate.com.au</a></p>
                <p><ClockIcon aria-hidden="true" />Monday–Friday, 9:00 am–5:00 pm</p>
              </address>
              <Link href="/contact">View our location</Link>
            </section>
          </div>

          <aside className={styles.callback} id="request-callback" aria-labelledby="callback-heading">
            <h2 id="callback-heading">Request a callback</h2>
            <p>Tell us how we can help and leave a phone number so our team can call you.</p>
            <ContactAgentForm callback />
          </aside>
        </div>
      </div>
    </div>
  );
}
