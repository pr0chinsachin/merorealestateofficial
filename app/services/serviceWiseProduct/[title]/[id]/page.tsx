"use client";
import { Card, Spinner, Pagination, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Badge } from "flowbite-react";
import Image from "next/image";
import carIcon from "../../../../../public/car.svg";
import Bathroom from "../../../../../public/bathtub-bold-bathroom.svg";
import Bedroom from "../../../../../public/bed-bedroom-alt.svg";
import BASE_URL from "../../../../urlConfig/urlConfig";
import SERVER_URL from "../../../../urlConfig/serverUrl";
import Link from "next/link";
import type { CustomFlowbiteTheme } from "flowbite-react";
import DarkFormSale from "@/app/contactAgentForm/darkFormSale";

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
  status: boolean;
  details: string;
}

interface HotlistById {
  id: string;
  productCode: string;
  productName: string;
  categoryId: string;
  subCategoryId: string;
  address: string;
  price: number;
  mapLink: string;
  thumbnailImgPath: string;
  newThumbnailImg: string;
  videoLink: string;
  description: string;
  details: string;
  propertyStatusValue: string;
  parkingCount: number;
  roomCount: number;
  bathRoomCount: number;
  area: number;
  images: {
    name: string;
    filePath: string;
  }[];
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
      off: "rounded-t-lg object-cover aspect-[4/3]",
    },
  },
};

const ServiceWiseProduct: React.FC<ServiceProductProps> = ({ params }) => {
  const { id, title } = params;
  const [productsByPrice, setProductsByPrice] = useState<ServiceProduct[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("house-land"); // Default to "house-land"
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Product/ProductListWithCategoryID?id=${id}`
      );
      if (response.ok) {
        const data: ServiceProduct[] = await response.json();
        const processedData = data.map((product) => ({
          ...product,
          thumbnailImgPath: product.thumbnailImgPath.replace(/~/g, ""),
        }));
        setProductsByPrice(processedData);
        setIsLoading(false);
      } else {
        setFetchError(true);
        setIsLoading(false);
      }
    } catch (error) {
      setFetchError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (activeTab: number) => {
    const tab = activeTab === 0 ? "house-land" : "house";
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filteredProducts = productsByPrice.filter((product) => {
    if (title !== "Buy") return product.status;

    return activeTab === "house-land"
      ? product.details === "1"
      : product.details === "0";
  });

  const renderProductCard = (product: ServiceProduct) => (
    <div key={product.id} className="group">
      <Link
        href={`/services/serviceWiseProduct/${title}/${id}/serviceWiseProductView/${product.id}`}
      >
        <Card
          imgSrc={`${SERVER_URL}${product.thumbnailImgPath}`}
          className="w-full max-w-lg"
          theme={customTheme}
        >
          <h3 className="text-md text-black font-semibold truncate">
            {product.productName}
          </h3>
          <div className="flex justify-between">
            <Badge color="warning" className="text-sm">
              {product.propertyStatusValue === "Rented"
                ? "Buy"
                : product.propertyStatusValue}
            </Badge>
            <div className="text-orange-500 font-bold">
              ${" "}
              {Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }).format(product.price)}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Image src={Bedroom} alt="Bedroom Icon" width={20} height={20} />
              <span className="pl-2">{product.roomCount}</span>
            </div>
            <div className="flex items-center">
              <Image
                src={Bathroom}
                alt="Bathroom Icon"
                width={20}
                height={20}
              />
              <span className="pl-2">{product.bathRoomCount}</span>
            </div>
            <div className="flex items-center">
              <Image src={carIcon} alt="Car Icon" width={20} height={20} />
              <span className="pl-2">{product.parkingCount}</span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const renderProductsList = () => {
    if (fetchError) {
      return (
        <div className="text-red-500 mt-4 text-center">
          Failed to fetch data. Please try again later.
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="relative w-full h-64 flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      );
    }

    if (paginatedProducts.length === 0) {
      return (
        <div className="text-center text-gray-500">
          {title === "Build" ? "Comming Soon." : "No Products Found."}
        </div>
      );
    }

    return (
      <>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {paginatedProducts.map(renderProductCard)}
        </div>
        <div className="mt-8 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </>
    );
  };

  return (
    <div
      className="px-4 pt-16 md:pt-0 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#14222d" }}
    >
      <div className="max-w-7xl mx-auto md:py-8">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-sky-50 mb-6">
          {title === "Sale" ? "Sale with us" : title}
        </h2>

        {title === "Sale" ? (
          <DarkFormSale />
        ) : title === "Buy" ? (
          <Tabs onActiveTabChange={handleTabChange}>
            <Tabs.Item
              title="House and Land Package"
              active={activeTab === "house-land"}
            >
              {renderProductsList()}
            </Tabs.Item>
            <Tabs.Item
              title="Residental Properties"
              active={activeTab === "house"}
            >
              {renderProductsList()}
            </Tabs.Item>
          </Tabs>
        ) : (
          renderProductsList()
        )}
      </div>
    </div>
  );
};

export default ServiceWiseProduct;
