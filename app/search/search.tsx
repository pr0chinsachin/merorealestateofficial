"use client";
import { Button } from "flowbite-react";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import Styles from "./search.module.css";

const Search = () => {
  const [selected, setSelected] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  return (
    <div className="flex justify-center mx-auto">
      <div id={Styles.desktopView}>
        <div className={Styles.fixedFormContainer}>
          <form className="mx-auto p-4   shadow-md rounded-lg">
            <div className="flex gap-4 items-center">
              <div>
                <select
                  id="propertyType"
                  value={selected}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose Property</option>
                  <option value="R">Rent</option>
                  <option value="P">Property</option>
                  <option value="H">House Buy</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  id="bathroom"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bathroom"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="bed"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bed"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="car-park"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Car Park"
                  required
                />
              </div>
              <div>
                <select
                  id="range"
                  value={selected}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose Price Range</option>
                  <option value="US">$1000 - $2000</option>
                  <option value="CA">$2001 - $10000</option>
                  <option value="FR">$10001 - $100000</option>
                  <option value="DE">$100001 - $100000</option>
                </select>
              </div>
              <div>
                <Button
                  style={{ backgroundColor: "#14222d" }}
                  className="w-full md:w-auto flex items-center"
                >
                  <BiSearchAlt className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div id={Styles.mobileView} className="mt-6 md:mt-0 w-full mx-4">
        <div
          className="flex justify-center items-center mb-4 cursor-pointer text-white rounded-lg  py-4 "
          onClick={toggleFormVisibility}
          style={{ backgroundColor: "#f27423" }}
        >
          <BiSearchAlt className="" />
          <span className="ml-2   ">Search</span>
        </div>

        {isFormVisible && (
          <form className="mx-auto px-4 py-6 bg-white shadow-md rounded-lg">
            <div className="space-y-4">
              <div>
                <select
                  id="propertyType"
                  value={selected}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose Property</option>
                  <option value="R">Rent</option>
                  <option value="P">Property</option>
                  <option value="H">House Buy</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  id="bathroom"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bathroom"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="bed"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bed"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="car-park"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Car Park"
                  required
                />
              </div>
              <div>
                <select
                  id="range"
                  value={selected}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose Price Range</option>
                  <option value="US">$1000 - $2000</option>
                  <option value="CA">$2001 - $10000</option>
                  <option value="FR">$10001 - $100000</option>
                  <option value="DE">$100001 - $100000</option>
                </select>
              </div>
              <div className="flex justify-center">
                <Button className="bg-cyan-950 w-full md:w-auto flex items-center">
                  <BiSearchAlt className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Search;
