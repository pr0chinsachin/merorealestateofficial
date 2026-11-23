"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Spinner, Card, Pagination, Badge } from "flowbite-react";
import { BiSearchAlt } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import SERVER_URL from "@/app/urlConfig/serverUrl";
import carIcon from "../../../public/car.svg";
import Bathroom from "../../../public/bathtub-bold-bathroom.svg";
import Bedroom from "../../../public/bed-bedroom-alt.svg";
import Search from "../search";

interface FilterList {
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

const customTheme = {
  img: {
    horizontal: {
      off: "rounded-t-lg object-cover aspect-[4/3]",
    },
  },
};

function Result() {
  const [productsByPrice, setProductsByPrice] = useState<FilterList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState(false);
  const [filterResult, setFilterResult] = useState<FilterList[]>([]);
  const itemsPerPage = 8;

  const searchParams = useSearchParams();
  const filters = searchParams.get("filters");

  const fetchFilteredData = async () => {
    const url =
      "https://merorealstateapi.ism.com.np/api/Product/FilterProductList";
    const filterParams = filters ? JSON.parse(filters) : {};

    const formData = new FormData();
    Object.entries(filterParams).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "text/plain",
        },
        body: formData,
      });

      if (response.ok) {
        const data: FilterList[] = await response.json();
        const processedData = data.map((item) => ({
          ...item,
          thumbnailImgPath: item.thumbnailImgPath.replace(/~/g, ""),
        }));
        setFilterResult(processedData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error("Failed to fetch filter results.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching filter results:", error);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [filters]);

  const totalPages = Math.ceil(filterResult.length / itemsPerPage);
  const onPageChange = (page: number) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filterResult.length);
  const paginatedProducts = filterResult.slice(startIndex, endIndex);

  return (
    <div style={{ backgroundColor: "#14222d" }}>
      <Search />
      <div className="px-4 pt-16 md:pt-0 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto md:py-8">
          <h2 className="text-3xl md:text-4xl text-center font-bold text-sky-50 mb-6">
            Filter Results
          </h2>

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
                    .filter((product) => product.status === true)
                    .map((product) => (
                      <div key={product.id} className="group">
                        <Link
                          href={`../product/hotlistproduct/hotlistProductView/${product.id}`}
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
                              <div>
                                <Badge color="warning" className="text-sm">
                                  {product.propertyStatusValue.toString()}
                                </Badge>
                              </div>
                              <div className="text-orange-500 hover:text-red-500 font-bold items-baseline">
                                <div>${product.price}</div>
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
    </div>
  );
}

export default Result;
