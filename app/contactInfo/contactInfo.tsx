import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { MdFacebook, MdLocalPhone, MdPlayCircleFilled } from "react-icons/md";

const ContactInfo = () => {
  return (
    <div className="text-slate-50" style={{ backgroundColor: "#0097b2" }}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Call us */}
        <div className="flex items-center">
          <MdLocalPhone />
          <span className="ml-2 whitespace-nowrap text-xs font-semibold dark:text-white">
            Call us @
            <span className="ml-2">
              <a
                href="tel:+61415765234"
                className="text-white hover:text-cyan-900"
              >
                +61 415 765 234
              </a>
            </span>
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <Link
            href="https://www.facebook.com/profile.php?id=100090574720751"
            target="_blank"
          >
            <span className="text-white hover:text-cyan-900">
              <MdFacebook />
            </span>
          </Link>
          <Link
            href="https://www.instagram.com/merorealestate/"
            target="_blank"
          >
            <span className="text-white hover:text-cyan-900">
              <FaInstagram />
            </span>
          </Link>
          <Link href="https://www.tiktok.com/@merorealestate" target="_blank">
            <span className="text-white hover:text-cyan-900">
              <FaTiktok />
            </span>
          </Link>
          {/* <Link href="https://www.youtube.com/yourpage">
            <span className="text-white hover:text-cyan-900">
              <MdPlayCircleFilled />
            </span>
          </Link> */}
        </div>
      </div>
    </div>
  );
};
export default ContactInfo;
