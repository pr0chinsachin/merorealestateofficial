"use client";

import Logo from "../../public/logo.png";
import Image from "next/image";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./navbar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/agent", label: "Agent" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function NavbarItem() {
  const pathname = usePathname();

  return (
    <Navbar className={styles.nav}>
      <NavbarBrand as={Link} href="/">
        <Image src={Logo} alt="Mero Real Estate" width={75} height={54} priority unoptimized />
      </NavbarBrand>
      <div className={styles.actions}>
        <Link href="/contactAgentForm" className={styles.appointment}>
          <span>Book an appointment</span>
          <CalendarDaysIcon aria-hidden="true" />
        </Link>
        <NavbarToggle aria-label="Toggle navigation" />
      </div>
      <NavbarCollapse>
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
          return (
            <NavbarLink
              key={href}
              as={Link}
              href={href}
              aria-current={active ? "page" : undefined}
              className={styles.link}
            >
              {label}
            </NavbarLink>
          );
        })}
      </NavbarCollapse>
    </Navbar>
  );
}
