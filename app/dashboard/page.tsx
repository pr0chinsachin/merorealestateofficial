import Image from "next/image";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import founder from "../../public/founder.jpg";
import CarouselImage from "./carouselImage/carouselImage";
import Agent from "../agent/page";
import ServiceLists from "../services/servicelists";
import Listings from "../product/listings";
import ProductsByPrice from "../product/productByPrice/productByPrice";
import Search from "../search/search";
import styles from "./home.module.css";

export default function Dashboard() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroInner}>
          <div className={styles.portrait}>
            <Image
              src={founder}
              alt="Pushpa Maharjan, Principal Director"
              fill
              priority
              sizes="(min-width: 1024px) 28vw, 40vw"
            />
          </div>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Welcome to Mero Real Estate</p>
            <h1 id="home-title">Find your <em>dream house</em></h1>
            <p className={styles.tagline}>Buy, rent or invest with confidence.</p>
            <ul className={styles.benefits}>
              {["Professional service", "Transparent process", "Dedicated support"].map((benefit) => (
                <li key={benefit}><CheckCircleIcon aria-hidden="true" />{benefit}</li>
              ))}
            </ul>
            <a className={styles.cta} href="#available-properties">
              Explore properties <ArrowRightIcon aria-hidden="true" />
            </a>
          </div>
          <div className={styles.showcase}>
            <CarouselImage />
          </div>
        </div>
      </section>

      <section className={styles.search} aria-label="Find a property">
        <Search />
      </section>

      <section className={styles.services} aria-label="Our services">
        <ServiceLists />
      </section>

      <section id="available-properties" className={styles.available} aria-label="Buy and rent">
        <Listings available />
      </section>

      <section className={styles.completed} aria-label="Sold and leased">
        <ProductsByPrice />
      </section>

      <section className={styles.team} aria-label="Meet our team">
        <Agent />
      </section>
    </div>
  );
}
