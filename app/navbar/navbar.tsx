import Logo from "../../public/logo.svg";
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button,
} from "flowbite-react";
import Link from "next/link";

const NavbarItem = () => {
  return (
    <Navbar
      fluid
      className="text-slate-50 "
      style={{ backgroundColor: "#14222d" }}
    >
      <NavbarBrand href="/" className="">
        <Image src={Logo} className="mr-3" alt="Logo" width={65} height={80} />
      </NavbarBrand>
      <div className="flex md:order-2">
        <Link href={`/contactAgentForm`}>
          <Button
            pill
            size="xs"
            className="mr-2 text-sm-bold text-white"
            style={{ backgroundColor: "#F27423" }}
          >
            BOOK AN APPOINMENT
          </Button>
        </Link>
      </div>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink as={Link} href="/" className="text-slate-50">
          Home
        </NavbarLink>
        <NavbarLink as={Link} href="/services" className="text-slate-50">
          Services
        </NavbarLink>
        <NavbarLink as={Link} href="/agent" className="text-slate-50">
          Agent
        </NavbarLink>
        <NavbarLink as={Link} href="/about" className="text-slate-50">
          About Us
        </NavbarLink>
        <NavbarLink as={Link} href="/contact" className="text-slate-50">
          Contact
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};
export default NavbarItem;
