"use client";
import { Card, Spinner, Pagination, Button } from "flowbite-react";
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
import { BiSearchAlt } from "react-icons/bi";

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

// ✅ Highlights matched text within a string
const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim()) return <span>{text}</span>;

  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-orange-300 text-black rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

const ServiceWiseProduct: React.FC<ServiceProductProps> = ({ params }) => {
  const { id, title } = params;
  const [productsByPrice, setProductsByPrice] = useState<ServiceProduct[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("house");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Product/ProductListWithCategoryID?id=${id}`,
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

  const handleTabChange = (index: number) => {
    const tab = index === 0 ? "house" : "house-land";
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // ✅ Filter by category/status
  const categoryFilteredProducts = productsByPrice.filter((product) => {
    if (title === "Buy") {
      return activeTab === "house"
        ? product.details === "0"
        : product.details === "1";
    }
    if (title === "Rent") {
      return (
        product.status &&
        (product.propertyStatusValue === "Rent" ||
          product.propertyStatusValue === "Rented" ||
          product.propertyStatusValue === "UnderManagement")
      );
    }
    return product.status;
  });

  // ✅ Further filter by search term (name or price)
  const filteredProducts = categoryFilteredProducts.filter((product) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const nameMatch = product.productName.toLowerCase().includes(term);
    const priceStr =
      product.price === 0 ? "contact for price" : product.price.toString();
    const priceMatch = priceStr.includes(term);
    return nameMatch || priceMatch;
  });

  // ✅ Format price string for display/highlight
  const formatPrice = (product: ServiceProduct): string => {
    if (product.price === 0) return "Contact for Price";
    return `$ ${Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(product.price)}`;
  };

  // ✅ Product card UI
  const renderProductCard = (product: ServiceProduct) => (
    <div key={product.id} className="group">
      <Link href={`/product/hotlistproduct/hotlistProductView/${product.id}`}>
        <Card
          imgSrc={`${SERVER_URL}${product.thumbnailImgPath}`}
          className="w-full max-w-lg"
          theme={customTheme}
        >
          <h3 className="text-md text-black font-semibold truncate">
            <HighlightText text={product.productName} highlight={searchTerm} />
          </h3>

          <div className="flex justify-between">
            <Badge
              color={
                product.propertyStatusValue === "UnderManagement"
                  ? "dark"
                  : "success"
              }
              className="text-sm"
            >
              {product.propertyStatusValue === "UnderManagement"
                ? "Under Management"
                : title === "Rent" ||
                    ["Leased", "Rented"].includes(product.propertyStatusValue)
                  ? "Rent"
                  : product.propertyStatusValue}
            </Badge>

            <div className="text-orange-500 font-bold">
              {product.propertyStatusValue === "Buy" && product.price !== 0 && (
                <div className="text-sm text-gray-500">Starting From</div>
              )}
              <HighlightText
                text={formatPrice(product)}
                highlight={searchTerm}
              />
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

  // ✅ Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // ✅ Render section
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
        <div className="relative w-full h-96 flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      );
    }

    return (
      <>
        {/* Search Box */}
        <div className="mb-6 flex flex-col sm:flex-row justify-center sm:justify-end gap-2">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by Location or price..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none text-black w-full"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {/* <Button
            style={{ backgroundColor: "#f27423" }}
            className="text-white px-4 py-2 rounded-lg focus:outline-none flex items-center gap-1"
          >
            <BiSearchAlt className="mr-1" />
            Search
          </Button> */}
        </div>
        {/* Search result count */}
        {searchTerm && (
          <p className="text-gray-400 text-sm mb-4 text-right">
            {filteredProducts.length} result
            {filteredProducts.length !== 1 ? "s" : ""} for &ldquo;{searchTerm}
            &rdquo;
          </p>
        )}

        {paginatedProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {title === "Build"
              ? "Coming Soon."
              : `No properties found matching "${searchTerm}".`}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {paginatedProducts.map(renderProductCard)}
            </div>
            <div className="m-8 flex justify-end pb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div
      className="px-4 pt-16 md:pt-0 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#14222d" }}
    >
      <div className="max-w-7xl mx-auto md:py-8 h-max">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-sky-50 md:mt-3 md:mb-16">
          {title === "Sale" ? "Sale with us" : decodeURIComponent(title)}
        </h2>
        <div className="my-10">
          {title === "Sale" ? <DarkFormSale /> : renderProductsList()}
        </div>
      </div>
    </div>
  );
};

export default ServiceWiseProduct;
