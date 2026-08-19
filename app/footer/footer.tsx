"use client";
import { Footer, FooterDivider, FooterLinkGroup } from "flowbite-react";
import { useState } from "react";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import Link from "next/link";
import img1 from "./images/docusign1.svg";
import img2 from "./images/mri.svg";
import img3 from "./images/rei.svg";
import img4 from "./images/reisa.svg";
import ContactInfo from "../contactInfo/contactInfo";

const FooterSection = () => {
  const [cDate, setcDate] = useState(new Date());

  return (
    <div style={{ backgroundColor: "#14222d" }} className="overflow-hidden">
      <hr />
      <ContactInfo />
      <Footer
        container
        className="text-white rounded-none "
        style={{ backgroundColor: "#14222d" }}
      >
        <div className="w-full text-center ">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <Image src={Logo} alt="Company Logo" width={75} height={75} />
            <div className="h-20 mb-10">
              <div className="text-left md:text-center">Our Partners</div>
              <div className="flex justify-between items-center w-4/5 md:w-2/5 lg:w-full gap-5 mx-auto mt-4 ">
                <div>
                  <Image src={img1} height={50} width={50} alt="docusign" />
                </div>
                <div>
                  <Image
                    src={img2}
                    height={50}
                    width={50}
                    alt="Property Tree"
                  />
                </div>
                <div>
                  <Image
                    src={img3}
                    height={100}
                    width={100}
                    alt="REI Forms Live"
                  />
                </div>
                <div>
                  <Image src={img4} height={50} width={50} alt="Reisa" />
                </div>
              </div>
            </div>
            <FooterLinkGroup className="flex space-x-4">
              <Link href={`/contact`} className="text-white">
                Contact
              </Link>
              <Link href={`/about`} className="text-white">
                About
              </Link>
              <Link href={`/privacypolicy`} className="text-white">
                Privacy Policy
              </Link>
            </FooterLinkGroup>
          </div>

          <div
            style={{ backgroundColor: "#f27423" }}
            className="py-5 -mx-10 -my-5 mt-5 "
          >
            Developed by <Link href={`https://ism.com.np`}>ISM</Link>{" "}
            {cDate.getFullYear()}
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default FooterSection;
