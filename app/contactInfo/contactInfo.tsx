import Link from "next/link";
import { FaPhone } from "react-icons/fa";
import { MdFacebook, MdLocalPhone, MdPlayCircleFilled } from "react-icons/md";

const ContactInfo = () => {
  return (
    <div className="text-slate-50" style={{ backgroundColor: "#f27423" }}>
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

        {/* Facebook and Play Circle Icons */}
        <div className="flex items-center">
          <Link
            href="https://www.facebook.com/profile.php?id=100090574720751"
            target="_blank"
          >
            <span className="text-white hover:text-cyan-900">
              <MdFacebook />
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
