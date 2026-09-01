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
        <div className="min-h-full sticky">
          <main>
            <header className=" shadow-2xl">
              <div className="">
                {/* <div
                  className="text-slate-50 h-6"
                  style={{ backgroundColor: "#f27423" }}
                ></div> */}

                <Navbar />
              </div>
            </header>
          </main>
        </div>
      </div>
    </>
  );
};
export default Header;
