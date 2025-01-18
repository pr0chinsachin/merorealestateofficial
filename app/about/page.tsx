"use client";
import Image from "next/image";
import { Card, Accordion, Button } from "flowbite-react";
import Founder from "./images/founder.jpg";
import Contact from "../contact/page";
import { FaArrowRight } from "react-icons/fa6";
import ContactAgentForm from "../contactAgentForm/page";

function About() {
  return (
    <div className="bg-slate-700 ">
      <div className="  text-center relative text-white font-bold text-5xl py-28 bg-[url('./about/images/hero.jpg')] bg-no-repeat bg-cover bg-left hidden sm:block ">
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>
        <span className="absolute inset-0 flex items-center justify-center z-10 text-white">
          About Us
        </span>
      </div>
      <Card
        className="grid place-items-center border-none rounded-none"
        style={{ backgroundColor: "#14222d", color: "#fff" }}
      >
        <div className="sm:flex sm:gap-14 2xl:px-72  sm:my-20 my-10 ">
          <div className="sm:w-1/2">
            <div className="font-semibold" style={{ color: "#0f868e" }}>
              About Company
            </div>
            <h1 className="font-bold text-3xl">Mero Real Estate</h1>
            <div className="text-justify text-md leading-loose font-light">
              Mero Real Estate South Australia is a reputable and highly
              regarded real estate agency dedicated to serving clients
              throughout the stunning region. With a strong focus on the local
              market, our experienced team of professionals offer personalized
              guidance and support to ensure successful real estate
              transactions. South Australia boasts a diverse range of
              properties, from charming coastal retreats to suburban family
              homes and bustling commercial spaces. At Mero Real Estate South
              Australia, we have an extensive portfolio of listings that cater
              to various lifestyles and investment needs. Our agents have
              in-depth knowledge of the region's neighborhoods, market trends,
              and property values, allowing us to provide accurate and
              insightful information to our clients.
            </div>
          </div>
          <div className="sm:w-1/2">
            <div className="text-justify text-md leading-loose font-light">
              We believe that building strong relationships based on trust and
              integrity is the foundation of our success. We take the time to
              listen to our client’s unique needs and goals, tailoring our
              services to meet their specific requirements. Whether you’re a
              first-time buyer, an experienced investor, or a seller looking to
              maximize your property’s value, we are here to guide you through
              every step of the process.​
            </div>

            <div>
              <div className="flex items-center gap-10 mt-10 ">
                <div className="bg-[url('./about/images/founder.jpg')] bg-no-repeat bg-cover overflow-hidden h-20 w-20 rounded-full"></div>

                <div>
                  <div className="font-bold">Pushpa Maharjan</div>
                  <div>FOUNDER</div>
                </div>
              </div>
              <div className="mt-6 font-bold">Need help? Contact me</div>
              <div>
                +61 415 765 234 or pushpa.maharjan@merorealestate.com.au
              </div>

              <Button
                style={{ backgroundColor: "#f27423" }}
                type="submit"
                className="mt-6 self-center w-max "
              >
                Read More &nbsp;
                <FaArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* explore section */}
      <Card
        className="flex justify-center  text-white 2xl:px-40 py-20 border-none rounded-none"
        style={{ backgroundColor: "#14222d" }}
      >
        <span className="font-bold text-3xl text-center">Explore More</span>

        {exploreData.map((data, index) => (
          <Accordion
            key={index}
            className="bg-slate-50 w-full"
            flush
            collapseAll
          >
            <Accordion.Panel>
              <Accordion.Title
                className="font-bold"
                style={{ color: "#0f868e" }}
              >
                {data.title}
              </Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-black">{data.content}</p>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        ))}
      </Card>

      {/* location section */}
      <Card className="2xl:px-40 bg-white rounded-none">
        <Contact />
      </Card>
    </div>
  );
}

export default About;

const exploreData = [
  {
    title: "Expertise and Local Knowledge",
    content:
      "At Mero Real Estate, we pride ourselves on our extensive expertise and local knowledge. Our team of seasoned professionals possesses an in-depth understanding of Australia’s dynamic real estate market, ensuring you receive the most accurate and up-to-date advice. Whether you’re a first-time homebuyer, an experienced investor, or seeking a luxury property, we have the expertise to meet your unique requirements.",
  },
  {
    title: "Wide Range of Properties",
    content:
      "Discover an extensive portfolio of properties that capture the essence of Australia’s diverse landscapes and architectural styles. From breathtaking beachfront villas along the pristine coastlines to elegant urban penthouses in bustling city centers, Mero Real Estate showcases an array of options that cater to your preferences and aspirations. Explore our collection and find the property that resonates with your vision of the perfect home.",
  },
  {
    title: "Personalized Service",
    content:
      "At Mero Real Estate, we understand that buying or selling a property is a deeply personal endeavor. Our dedicated team goes above and beyond to provide personalized service, tailoring every interaction to your specific needs. We listen attentively to your requirements, offering expert advice, conducting thorough market research, and guiding you through the entire process, ensuring a seamless and stress-free experience from start to finish.",
  },
  {
    title: "Exclusive Opportunities",
    content:
      "As a trusted real estate partner, Mero Real Estate has access to an exclusive network of properties and off-market opportunities. We connect you with hidden gems and exclusive listings that are not publicly available, allowing you to gain a competitive edge in the market. Our aim is to provide you with unique opportunities that align with your vision and surpass your expectations.",
  },
  {
    title: "Integrity and Transparency",
    content:
      "At the core of Mero Real Estate’s values lie integrity and transparency. We uphold the highest ethical standards in all our dealings, maintaining open and honest communication throughout the buying or selling process. Our commitment to transparency ensures that you have all the necessary information to make informed decisions, fostering trust and building long-lasting relationships.",
  },
  {
    title: "Unlock the door to your dream home with Mero Real Estate",
    content:
      "Contact us today to embark on a remarkable journey towards finding the perfect property that reflects your unique lifestyle and aspirations. Experience the difference of working with a dedicated team committed to delivering exceptional service and helping you make your real estate dreams come true.",
  },
];
