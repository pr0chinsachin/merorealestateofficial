"use client";
import { Footer, FooterLinkGroup } from "flowbite-react";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import Link from "next/link";
import img1 from "./images/docusign1.svg";
import img2 from "./images/mri.svg";
import img3 from "./images/rei.svg";
import img4 from "./images/reisa.svg";

import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { MdFacebook, MdLocalPhone } from "react-icons/md";

const partners = [
  { src: img1, alt: "DocuSign", size: 50 },
  { src: img2, alt: "Property Tree", size: 50 },
  { src: img3, alt: "REI Forms Live", size: 70 },
  { src: img4, alt: "Reisa", size: 50 },
];

const socials = [
  {
    href: "https://www.facebook.com/profile.php?id=100090574720751",
    label: "Facebook",
    Icon: MdFacebook,
  },
  {
    href: "https://www.instagram.com/merorealestate/",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://www.tiktok.com/@merorealestate",
    label: "TikTok",
    Icon: FaTiktok,
  },
];

const FooterSection = () => {
  const year = new Date().getFullYear();

  return (
    <div style={{ backgroundColor: "#14222d" }} className="overflow-hidden">
      <hr />

      <Footer
        container
        className="rounded-none text-white"
        style={{ backgroundColor: "#14222d" }}
      >
        <div className="w-full">
          {/* Top row: logo / partners / links */}
          <div className="flex w-full flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:text-left">
            <Image
              src={Logo}
              alt="Company Logo"
              width={75}
              height={75}
              className="shrink-0"
            />

            <div className="flex flex-col items-center sm:items-center">
              <span className="text-sm font-medium sm:text-base">
                Our Partners
              </span>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
                {partners.map((p) => (
                  <Image
                    key={p.alt}
                    src={p.src}
                    height={p.size}
                    width={p.size}
                    alt={p.alt}
                    className="h-auto w-10 sm:w-12"
                  />
                ))}
              </div>
            </div>

            <FooterLinkGroup className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
              <Link href="/contact" className="text-white hover:text-cyan-300">
                Contact
              </Link>
              <Link href="/about" className="text-white hover:text-cyan-300">
                About
              </Link>
              <Link
                href="/privacypolicy"
                className="text-white hover:text-cyan-300"
              >
                Privacy Policy
              </Link>
            </FooterLinkGroup>
          </div>
        </div>
      </Footer>

      {/* Bottom bar — now a full-width sibling, not fighting Footer's padding */}
      <div style={{ backgroundColor: "#f27423" }} className="w-full">
        <div className="mx-auto  flex w-full px-10 flex-col items-center  py-3 text-slate-50 sm:flex-row sm:justify-between sm:gap-4">
          {/* Call us */}
          <div className="flex items-center whitespace-nowrap text-xs font-semibold sm:text-sm">
            <MdLocalPhone className="shrink-0" />
            <span className="ml-2">
              Call us @
              <a
                href="tel:+61415765234"
                className="ml-2 text-white hover:text-cyan-900"
              >
                +61 415 765 234
              </a>
            </span>
          </div>

          {/* Dev credit */}
          <div className="order-3 text-center text-xs sm:order-2 sm:text-sm md:-ml-60">
            Developed by{" "}
            <Link
              href="https://ism.com.np"
              target="_blank"
              className="underline hover:text-cyan-900"
            >
              ISM
            </Link>{" "}
            {year}
          </div>

          {/* Social icons */}
          <div className="order-2 flex items-center gap-3 text-lg sm:order-3">
            {socials.map(({ href, label, Icon }) => (
              <Link key={label} href={href} target="_blank" aria-label={label}>
                <span className="text-white hover:text-cyan-900">
                  <Icon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
