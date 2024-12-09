"use client";
import { Card } from "flowbite-react";
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

interface ServiceProduct {
  id: string;
  productCode: string;
  productName: string;
  price: number;
  thumbnailImgPath: string;
  roomCount: number;
  bathRoomCount: number;
  parking: number;
  area: number;
  propertyStatusValue: string; // Change this to string since you're comparing it with 'OnRent'
  href: string;
}
interface ServiceProductProps {
  params: {
    id: string;
    title: string;
  };
}
const ServiceWiseProduct: React.FC<ServiceProductProps> = ({ params }) => {
  const { id, title } = params;
  const [productsByPrice, ProductsByPrice] = useState<ServiceProduct[]>([]);

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
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl md:text-4xl text-center font-bold text-black">
          {title}
        </h2>
        {productsByPrice.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {productsByPrice.map((product) => (
              product.propertyStatusValue === 'OnRent' && (
                <Link
                  key={product.id}
                  href={`/services/serviceWiseProduct/${title}/${id}/serviceWiseProductView/${product.id}`}
                >
                  <div className={styles.serviceCard} key={product.id}>
                  <Card
                              imgSrc={
                                product.thumbnailImgPath
                                  ? `${SERVER_URL}${product.thumbnailImgPath}`
                                  : logo.src
                              }
                              className="w-full max-w-lg shadow-md"
                              style={{
                                backgroundColor: "#14222d",
                                color: "white",
                              }}
                            >
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {product.productName}
                              </h3>
                              <div className="grid grid-cols-2 mb-2 ">
                                <div>
                                  <span className="flex items-center">
                                    <HiPencilAlt className="mr-1" />
                                    <span>{product.area} sq.ft</span>
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="inline-flex float-right items-baseline">
                                    <Badge color="success">
                                      {product.propertyStatusValue}
                                    </Badge>
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 text-lg font-medium text-gray-900 mb-2">
                                <div className="flex justify-between items-center">
                                  <div className=" text-orange-500 hover:text-red-500 font-bold">
                                    ${product.price}
                                  </div>
                                  <div className="text-right text-white">
                                    <HiEye />
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between  mt-3 ">
                                <div className="flex items-center">
                                  <Image
                                    src={carIcon}
                                    alt="Car Icon"
                                    width={20}
                                    height={20}
                                    className="invert"
                                  />
                                  <span className="pl-2">
                                    {product.parking}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Image
                                    src={Bedroom}
                                    alt="Bedroom Icon"
                                    width={20}
                                    height={20}
                                    className="invert"
                                  />
                                  <span className="pl-2">
                                    {product.roomCount}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Image
                                    src={Bathroom}
                                    alt="Bathroom Icon"
                                    width={20}
                                    height={20}
                                    className="invert"
                                  />
                                  <span className="pl-2">
                                    {product.bathRoomCount}
                                  </span>
                                </div>
                              </div>
                            </Card>
                  </div>
                </Link>
              )
            ))}
          </div>
        ) : (
          <div className="text-center text-xl font-medium text-gray-500 mt-7">
            No data available for this category
          </div>
        )}
      </div>
    </div>
  );
};
export default ServiceWiseProduct;
