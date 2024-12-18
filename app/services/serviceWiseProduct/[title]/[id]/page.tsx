"use client";
import { Card, Spinner, Pagination } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiEye, HiPencilAlt } from "react-icons/hi";
import { Badge } from "flowbite-react";
import Image from "next/image";
import carIcon from "../../../../../public/car.svg";
import Bathroom from "../../../../../public/bathtub-bold-bathroom.svg";
import Bedroom from "../../../../../public/bed-bedroom-alt.svg";
import styles from "../../../../product/productByPrice/productsByPrice.module.css";
import BASE_URL from "../../../../urlConfig/urlConfig";
import SERVER_URL from "../../../../urlConfig/serverUrl";
import Link from "next/link";
import logo from "../../../../../public/logo.svg";
import type { CustomFlowbiteTheme } from "flowbite-react";

interface ServiceProduct {
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
  href: string;
  status: boolean;
}
interface ServiceProductProps {
  params: {
    id: string;
    title: string;
  };
}

const customTheme: CustomFlowbiteTheme["card"] = {
  img: {
    horizontal: {
      off: "rounded-t-lg object-cover aspect-[4/3] ",
    },
  },
};

const ServiceWiseProduct: React.FC<ServiceProductProps> = ({ params }) => {
  const { id, title } = params;
  const [productsByPrice, ProductsByPrice] = useState<ServiceProduct[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Product/ProductListWithCategoryID?id=${id}`
      );
      if (response.ok) {
        const data: ServiceProduct[] = await response.json();
        const processedData = data.map((hotListProduct) => ({
          ...hotListProduct,
          thumbnailImgPath: hotListProduct.thumbnailImgPath.replace(/~/g, ""), // Remove all occurrences of ~
        }));
        ProductsByPrice(processedData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error("Failed to fetch data");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(productsByPrice.length / itemsPerPage);

  const onPageChange = (page: number) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, productsByPrice.length);
  const paginatedProducts = productsByPrice.slice(startIndex, endIndex);

  return (
    <div
      className="px-4 pt-16 md:pt-0 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#14222d" }}
    >
      <div className="max-w-7xl mx-auto  md:py-8">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-sky-50 mb-6">
          {title}
        </h2>
        {/* Search Box */}
        {/* <div className="mb-6 flex flex-col sm:flex-row justify-center sm:justify-start gap-2">
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
        </div> */}
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
          <div>
            {paginatedProducts.length === 0 ? (
              <div className="text-center text-gray-500">
                No products found.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {paginatedProducts
                  .filter((product) => product.status === true) // Filter by status
                  .map((product) => (
                    <div key={product.id} className="group">
                      <Link
                        href={`/services/serviceWiseProduct/${title}/${id}/serviceWiseProductView/${product.id}`}
                      >
                        <Card
                          imgSrc={`${SERVER_URL}${product.thumbnailImgPath}`}
                          className="w-full max-w-lg"
                          theme={customTheme}
                        >
                          <h3 className="text-md text-black font-semibold    truncate">
                            {product.productName}
                          </h3>
                          <div className="flex justify-between ">
                            {/* <div>
                              <span className="inline-flex items-baseline">
                                <HiPencilAlt /> &nbsp;
                                <span>{product.area} m.sq</span>
                              </span>
                            </div> */}
                            <div>
                              <span className="inline-flex  items-baseline">
                                <Badge color="warning">
                                  {product.propertyStatusValue.toString()}
                                </Badge>
                              </span>
                            </div>

                            <div className=" text-orange-500 hover:text-red-500 font-bold   items-baseline">
                              <div>${product.price}</div>
                              <div className="mt-1">
                                <span className=""></span>
                              </div>
                            </div>
                          </div>

                          {/* <div className="text-lg font-medium text-gray-900 ">
                            <div className="grid grid-cols-2">
                              <div>${product.price}</div>
                              <div className="mt-1">
                                <span className="float-right">
                                  <HiEye />
                                </span>
                              </div>
                            </div>
                          </div> */}
                          <div className="flex justify-between ">
                            <div>
                              <table>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Image
                                        src={carIcon}
                                        alt="Car Icon"
                                        width={20}
                                        height={20}
                                      />
                                    </td>
                                    <td className="pl-2">
                                      {product.parkingCount}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <table>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Image
                                        src={Bedroom}
                                        alt="Bedroom Icon"
                                        width={20}
                                        height={20}
                                      />
                                    </td>
                                    <td className="pl-2">
                                      {product.roomCount}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <table>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Image
                                        src={Bathroom}
                                        alt="Bathroom Icon"
                                        width={20}
                                        height={20}
                                      />
                                    </td>
                                    <td className="pl-2">
                                      {product.bathRoomCount}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
        <div className="mt-8 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};
export default ServiceWiseProduct;
