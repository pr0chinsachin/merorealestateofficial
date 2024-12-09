"use client";
import { Fragment } from "react";
//import Search from "../search/search";
import Navbar from "../navbar//navbar";
import Styles from "./header.module.css";
import ContactInfo from "../contactInfo/contactInfo";

const Header = () => {
  return (
    <>
      <div className={Styles.fixedFormContainer}>
        <div className="min-h-full">
          <main>
            <header className="bg-white shadow">
              <div className="">
              <ContactInfo/>
                <Navbar />
              </div>
            </header>
          </main>
        </div>
      </div>
    </>
  );
}
export default Header;
