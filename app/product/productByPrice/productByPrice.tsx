"use client";
import { Card, Pagination, Badge, Button, Spinner, Tabs } from "flowbite-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BiSearchAlt } from "react-icons/bi";
import carIcon from "../../../public/car.svg";
import Bathroom from "../../../public/bathtub-bold-bathroom.svg";
import Bedroom from "../../../public/bed-bedroom-alt.svg";
import BASE_URL from "../../urlConfig/urlConfig";
import SERVER_URL from "../../urlConfig/serverUrl";
import Link from "next/link";
import type { CustomFlowbiteTheme } from "flowbite-react";

interface ProductList {
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

const ProductByPrice: React.FC = () => {
  const [productsByPrice, setProductsByPrice] = useState<ProductList[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [currentSoldPage, setCurrentSoldPage] = useState(1);
  const [currentLeasedPage, setCurrentLeasedPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("sold");
  const itemsPerPage = 8;
  const options = { maximumFractionDigits: 2, minimumFractionDigits: 2 };

  const filteredProducts = productsByPrice
    .filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime(),
    );

  const soldProducts = filteredProducts.filter(
    (product) =>
      product.status === true && product.propertyStatusValue === "Sold",
  );

  const leasedProducts = filteredProducts.filter(
    (product) =>
      product.status === true &&
      (product.propertyStatusValue === "Leased" ||
        product.propertyStatusValue === "UnderManagement"),
  );

  const totalSoldPages = Math.ceil(soldProducts.length / itemsPerPage);
  const totalLeasedPages = Math.ceil(leasedProducts.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Product/ProductList`);
        if (response.ok) {
          const data: ProductList[] = await response.json();
          const processedData = data
            .filter(
              (product) =>
                product.propertyStatusValue === "Sold" ||
                product.propertyStatusValue === "Leased" ||
                product.propertyStatusValue === "UnderManagement",
            )
            .map((product) => ({
              ...product,
              thumbnailImgPath: product.thumbnailImgPath.replace(/~/g, ""),
            }));
          setProductsByPrice(processedData);
          console.log("processedData", processedData);
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

    fetchData();
  }, []);

  const getPaginatedProducts = (
    products: ProductList[],
    currentPage: number,
  ) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    return products.slice(startIndex, endIndex);
  };

  const handleTabChange = (activeTab: number) => {
    const tab = activeTab === 0 ? "sold" : "leased";
    setActiveTab(tab);
    // Reset pagination when switching tabs
    if (tab === "sold") {
      setCurrentSoldPage(1);
    } else {
      setCurrentLeasedPage(1);
    }
  };

  const renderProductCard = (product: ProductList) => (
    <div key={product.id} className="group">
      <Link href={`product/hotlistproduct/hotlistProductView/${product.id}`}>
        <Card
          imgSrc={`${SERVER_URL}${product.thumbnailImgPath}`}
          className="w-full max-w-lg"
          theme={customTheme}
        >
          <h3 className="text-md text-black font-semibold truncate">
            {product.productName}
          </h3>
          <div className="flex justify-between">
            <div>
              <span className="inline-flex items-baseline ">
                {product.propertyStatusValue === "UnderManagement" ? (
                  <Badge color="dark" className="text-sm">
                    Under Management
                  </Badge>
                ) : (
                  <Badge color="warning" className="text-sm">
                    {product.propertyStatusValue.toString()}
                  </Badge>
                )}
              </span>
            </div>
            <div className="text-orange-500 hover:text-red-500 font-bold items-baseline">
              <div>
                ${Intl.NumberFormat("en-US", options).format(product.price)}
              </div>
              <div className="mt-1">
                <span className=""></span>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
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
                      {product.roomCount < 1 ? "-" : product.roomCount}
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
                      {product.bathRoomCount < 1 ? "-" : product.bathRoomCount}
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
                        src={carIcon}
                        alt="Car Icon"
                        width={20}
                        height={20}
                      />
                    </td>
                    <td className="pl-2">
                      {product.parkingCount < 1 ? "-" : product.parkingCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );

  return (
    <div className="px-4 pt-16 md:pt-0 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto md:py-8">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-sky-50 mb-6">
          Sold and Leased
        </h2>
        <div className="mb-6 flex flex-col sm:flex-row justify-center sm:justify-start gap-2">
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
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500">
                No products found.
              </div>
            ) : (
              <Tabs onActiveTabChange={handleTabChange}>
                <Tabs.Item title="Sold" active={activeTab === "sold"}>
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {getPaginatedProducts(soldProducts, currentSoldPage).map(
                      renderProductCard,
                    )}
                  </div>
                  {soldProducts.length > 0 && (
                    <div className="mt-8 flex justify-end">
                      <Pagination
                        currentPage={currentSoldPage}
                        totalPages={totalSoldPages}
                        onPageChange={setCurrentSoldPage}
                      />
                    </div>
                  )}
                </Tabs.Item>

                <Tabs.Item title="Leased" active={activeTab === "leased"}>
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {leasedProducts.length === 0 ? (
                      <div className="text-center text-gray-500">
                        No products leased.
                      </div>
                    ) : (
                      getPaginatedProducts(
                        leasedProducts,
                        currentLeasedPage,
                      ).map(renderProductCard)
                    )}
                  </div>
                  {leasedProducts.length > 0 && (
                    <div className="mt-8 flex justify-end">
                      <Pagination
                        currentPage={currentLeasedPage}
                        totalPages={totalLeasedPages}
                        onPageChange={setCurrentLeasedPage}
                      />
                    </div>
                  )}
                </Tabs.Item>
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductByPrice;
