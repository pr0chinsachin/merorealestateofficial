"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge, Button, Spinner } from "flowbite-react";
import { HiEye, HiPencilAlt } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import Slider from "react-slick";
import Image from "next/image";
import carIcon from "../../../public/car.svg";
import Bathroom from "../../../public/bathtub-bold-bathroom.svg";
import Bedroom from "../../../public/bed-bedroom-alt.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BASE_URL from "../../urlConfig/urlConfig";
import SERVER_URL from "../../urlConfig/serverUrl";
import Link from "next/link";
import logo from "../../../public/logo.png";
import type { CustomFlowbiteTheme } from "flowbite-react";

interface LatestProduct {
  id: string;
  productCode: string;
  productName: string;
  price: number;
  thumbnailImgPath: string;
  roomCount: number;
  bathRoomCount: number;
  parkingCount: number;
  area: number;
  propertyStatusValue: string;
  status: boolean;
  createdDate: string;
  updatedDate: string;
}

const customTheme: CustomFlowbiteTheme["card"] = {
  img: {
    horizontal: {
      off: "rounded-t-lg object-cover aspect-[4/3] ",
    },
  },
};

const LatestProductView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [latestProducts, setlatestProducts] = useState<LatestProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const options = { maximumFractionDigits: 2, minimumFractionDigits: 2 };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Product/ProductList`);
      if (response.ok) {
        const data: LatestProduct[] = await response.json();

        const processedData = data.map((latestProduct) => ({
          ...latestProduct,
          thumbnailImgPath: latestProduct.thumbnailImgPath.replace(/~/g, ""),
        }));
        console.log("Buy and rent", processedData);
        setlatestProducts(processedData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setFetchError(true);
        console.error("Failed to fetch data");
      }
    } catch (error) {
      setIsLoading(false);
      setFetchError(true);
      console.error("Error:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: latestProducts.length < 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Enable auto-play
    autoplaySpeed: 2000, // Set auto-play speed in milliseconds (e.g., 3000ms = 3s)
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 md:py-16 pt-5 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl text-center font-bold mb-7 text-white">
          Buy and Rent
        </h2>
        {/* Search Box */}
        <div className="mb-6 flex flex-col sm:flex-row justify-center sm:justify-end gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          />
          <Button
            style={{ backgroundColor: "#f27423" }}
            onClick={() => setSearchTerm("")}
            className="bg-gray-300 text-white px-4 py-2 rounded-lg focus:outline-none"
          >
            <BiSearchAlt className="mr-1" />
            Search
          </Button>
        </div>
        {/* Search Box ends */}
        {fetchError ? (
          <div className="text-red-500 mt-4 text-center">
            Failed to fetch data. Please try again later.
          </div>
        ) : isLoading ? (
          <div className="relative w-full h-64 flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="mt-6 -mx-2 md:px-5 lg:px-0">
            {latestProducts.length === 0 ? (
              <div className="text-center text-gray-500">
                Oops! No properties found at the moment.
              </div>
            ) : (
              <Slider {...settings}>
                {latestProducts
                  .filter((product) => product.status === true) // Filter by status
                  .map((product) => {
                    if (
                      product.propertyStatusValue === "Rent" ||
                      product.propertyStatusValue === "Buy" ||
                      product.propertyStatusValue === "UnderManagement"
                    ) {
                      return (
                        <div key={product.id} className="px-3 ">
                          <Link
                            href={`/product/hotlistproduct/hotlistProductView/${product.id}`}
                          >
                            <Card
                              imgSrc={
                                product.thumbnailImgPath
                                  ? `${SERVER_URL}${product.thumbnailImgPath}`
                                  : logo.src
                              }
                              className="w-full max-w-lg shadow-md"
                              style={{
                                backgroundColor: "",
                                color: "black",
                              }}
                              theme={customTheme}
                            >
                              <h3 className="text-lg font-semibold   truncate">
                                {product.productName}
                              </h3>
                              <div className="flex w-full justify-between">
                                <div>
                                  <span className="inline-flex float-right items-baseline">
                                    {product.propertyStatusValue ===
                                    "UnderManagement" ? (
                                      <Badge color="dark" className="text-sm">
                                        Under Management
                                      </Badge>
                                    ) : (
                                      <Badge
                                        color="success"
                                        className=" text-sm"
                                      >
                                        {product.propertyStatusValue}
                                      </Badge>
                                    )}
                                  </span>
                                </div>
                                <div className="text-orange-500 hover:text-red-500 font-bold items-baseline">
                                  {product.price === 0
                                    ? "NA"
                                    : `$${Intl.NumberFormat("en-US", options).format(product.price)}`}
                                </div>
                              </div>

                              {/* <div className=" text-lg font-medium text-gray-900 ">
                                <div className="flex justify-between items-center">
                                  <div className=" text-orange-500 hover:text-red-500 font-bold">
                                    ${product.price}
                                  </div>
                                  <div className="text-right ">
                                    <HiEye />
                                  </div>
                                </div>
                              </div> */}
                              <div className="flex justify-between  ">
                                <div className="flex items-center">
                                  <Image
                                    src={Bedroom}
                                    alt="Bedroom Icon"
                                    width={20}
                                    height={20}
                                  />
                                  <span className="pl-2">
                                    {product.roomCount < 1
                                      ? "-"
                                      : product.roomCount}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Image
                                    src={Bathroom}
                                    alt="Bathroom Icon"
                                    width={20}
                                    height={20}
                                  />
                                  <span className="pl-2">
                                    {product.bathRoomCount < 1
                                      ? "-"
                                      : product.bathRoomCount}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Image
                                    src={carIcon}
                                    alt="Car Icon"
                                    width={20}
                                    height={20}
                                  />
                                  <span className="pl-2">
                                    {product.parkingCount < 1
                                      ? "-"
                                      : product.parkingCount}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        </div>
                      );
                    } else {
                      return null; // Return null if the condition is not met
                    }
                  })}
              </Slider>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestProductView;
