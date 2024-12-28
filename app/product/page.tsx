"use client";
import { Card, Pagination, Badge, Button, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiPencilAlt, HiEye } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import carIcon from "../../public/car.svg";
import Bathroom from "../../public/bathtub-bold-bathroom.svg";
import Bedroom from "../../public/bed-bedroom-alt.svg";
import BASE_URL from "../urlConfig/urlConfig";
import SERVER_URL from "../urlConfig/serverUrl";
import Link from "next/link";

interface ProductList {
  id: string;
  productCode: string;
  productName: string;
  price: number;
  thumbnailImgPath: string;
  roomCount: number;
  bathRoomCount: number;
  parking: number;
  area: number;
  propertyStatusValue: boolean;
  href: string;
  status: boolean;
}

const ProductByPrice: React.FC = () => {
  const [productsByPrice, setProductsByPrice] = useState<ProductList[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = productsByPrice.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Product/ProductList`);
        if (response.ok) {
          const data: ProductList[] = await response.json();
          const processedData = data.map((product) => ({
            ...product,
            thumbnailImgPath: product.thumbnailImgPath.replace(/~/g, ""),
          }));
          setProductsByPrice(processedData);
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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const onPageChange = (page: number) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-8">
        <h2 className="text-2xl md:text-4xl text-center font-bold text-black mb-6">
          Leased And Sold Property
        </h2>
        {/* Search Box */}
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
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {paginatedProducts
              .filter((product) => product.status === true) // Filter by status
              .map((product) => (
                <div key={product.id} className="group">
                  <Link
                    href={`product/hotlistproduct/hotlistProductView/${product.id}`}
                  >
                    <Card
                      imgSrc={`${SERVER_URL}${product.thumbnailImgPath}`}
                      className="w-full max-w-lg"
                    >
                      <h3 className="text-sm text-gray-700 mb-2">
                        {product.productName}
                      </h3>
                      <div className="grid grid-cols-2 mb-2">
                        <div>
                          <span className="inline-flex items-baseline">
                            <HiPencilAlt /> &nbsp;
                            <span>{product.area} m.sq</span>
                          </span>
                        </div>
                        <div>
                          <span className="inline-flex float-right items-baseline">
                            <Badge color="warning" className="text-sm">
                              {product.propertyStatusValue.toString()}
                            </Badge>
                          </span>
                        </div>
                      </div>

                      <div className="text-lg font-medium text-gray-900 mb-2">
                        <div className="grid grid-cols-2">
                          <div>${product.price}</div>
                          <div className="mt-1">
                            <span className="float-right">
                              <HiEye />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-2">
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
                                <td className="pl-2">{product.roomCount}</td>
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
                                <td className="pl-2">{product.parking}</td>
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

export default ProductByPrice;
