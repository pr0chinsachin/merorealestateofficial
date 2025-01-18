"use client";
import { useEffect, useState } from "react";
import { Card, Badge, Tabs, Spinner, Accordion } from "flowbite-react";
import {
  HiEye,
  HiCalendar,
  HiPencilAlt,
  HiUserCircle,
  HiAdjustments,
  HiClipboardList,
} from "react-icons/hi";
import { FaCarAlt, FaBath } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";
import BASE_URL from "../../../../../../urlConfig/urlConfig";
import SERVER_URL from "../../../../../../urlConfig/serverUrl";
import Style from "./serviceWiseProduct.module.css";
import ContactAgentForm from "../../../../../../contactAgentForm/page";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ContactAgentFormDark from "@/app/contactAgentForm/darkForm";
import Bedroom from "@/public/bed-bedroom-alt.svg";

interface ProductById {
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

interface UpdateProductById {
  params: {
    productId: string;
  };
}

const ProductByIdView: React.FC<UpdateProductById> = ({ params }) => {
  const { productId } = params;
  const [productData, setProductData] = useState<ProductById>({
    id: "",
    productCode: "",
    productName: "",
    categoryId: "",
    subCategoryId: "",
    address: "",
    price: 0,
    mapLink: "",
    thumbnailImgPath: "",
    newThumbnailImg: "",
    videoLink: "",
    description: "",
    details: "",
    propertyStatusValue: "",
    parkingCount: 0,
    roomCount: 0,
    bathRoomCount: 0,
    area: 0,
    images: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false); // State to track loading image
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Product/UpdateProduct?id=${productId}`
        );
        if (response.ok) {
          const data: ProductById = await response.json();
          setProductData({
            ...data,
            thumbnailImgPath: data.thumbnailImgPath
              ? data.thumbnailImgPath.replace(/~/g, "")
              : "",
            newThumbnailImg: data.newThumbnailImg
              ? data.newThumbnailImg.replace(/~/g, "")
              : "",
          });
          setIsLoading(false);
          setFetchError(null);
        } else {
          setFetchError("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error:", error);
        setFetchError("Error: Unable to fetch data from server");
      }
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);

      // Add listener for screen size changes
      const handleResize = () => {
        setIsMobile(mediaQuery.matches);
      };
      mediaQuery.addListener(handleResize);

      return () => {
        mediaQuery.removeListener(handleResize);
      };
    };

    fetchData();
  }, [productId]);

  const changeImage = (url: string) => {
    console.log("here i am", url);
    setProductData((prevData) => ({
      ...prevData,
      thumbnailImgPath: url,
    }));
  };
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (fetchError) {
    return <p className="text-red-500 text-center">{fetchError}</p>;
  }

  function toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullScreen(false);
    } else {
      const element = document.querySelector(".PhotoView-Portal");
      if (element) {
        element.requestFullscreen();
        setFullScreen(true);
      }
    }
  }

  return (
    <>
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        <div className="items-center justify-center">
          {imageLoading && <Spinner size="xl" />}
        </div>
        <Card style={{ backgroundColor: "#14222d" }}>
          <div className="flex flex-wrap gap-2">
            <Badge color="warning" size="md">
              {productData.propertyStatusValue}
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
            <div>
              <h1 className="text-xl sm:text-2xl">{productData.productName}</h1>
              <span className="text-xs sm:text-sm text-white-700 dark:text-white-400">
                {productData.address}
              </span>
            </div>
            <div className="flex justify-end">
              <h1 className="text-xl sm:text-2xl text-orange-500 hover:text-red-500">
                <b>
                  <span>$</span>
                  {Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }).format(productData.price)}
                </b>
              </h1>
            </div>
          </div>

          <hr />
          <div className="grid grid-cols-1 sm:flex justify-between gap-4">
            {productData.roomCount < 1 ? (
              ""
            ) : (
              <span className="inline-flex items-center text-l text-white sm:text-sm font-bold">
                <Image
                  src={Bedroom}
                  alt="Bedroom Icon"
                  width={20}
                  height={20}
                  className="invert"
                />
                &nbsp;
                <span>{productData.roomCount} Room</span>
              </span>
            )}

            {productData.bathRoomCount < 1 ? (
              ""
            ) : (
              <span className="inline-flex items-center text-l text-white sm:text-sm font-bold">
                <FaBath /> &nbsp;
                <span>{productData.bathRoomCount} Bathroom</span>
              </span>
            )}

            {productData.area < 1 ? (
              ""
            ) : (
              <span className="inline-flex items-center text-l text-white sm:text-sm font-bold">
                <HiCalendar /> &nbsp;
                <span>{productData.area} m.sq </span>
              </span>
            )}
            {productData.parkingCount < 1 ? (
              ""
            ) : (
              <span className="inline-flex items-center text-l text-white sm:text-sm font-bold">
                <FaCarAlt /> &nbsp;
                <span>{productData.parkingCount} Parking Space</span>
              </span>
            )}
          </div>
        </Card>
      </div>
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        <Card style={{ backgroundColor: "#14222d" }}>
          <div className="flex flex-col items-center">
            <div>
              <PhotoProvider
                maskOpacity={0.8}
                toolbarRender={({ onScale, scale, rotate, onRotate }) => {
                  return (
                    <div className="flex justify-center items-center gap-5">
                      <div
                        className="cursor-pointer"
                        onClick={() => onScale(scale + 1)}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="m21 21-3.5-3.5M10 7v6m-3-3h6m4 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => onScale(scale - 1)}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="m21 21-3.5-3.5M7 10h6m4 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => onRotate(rotate + 90)}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                          />
                        </svg>
                      </div>

                      {document.fullscreenEnabled && (
                        <div
                          className="cursor-pointer"
                          onClick={toggleFullScreen}
                        >
                          {fullScreen ? (
                            <svg
                              className="w-6 h-6 text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 9h4m0 0V5m0 4L4 4m15 5h-4m0 0V5m0 4 5-5M5 15h4m0 0v4m0-4-5 5m15-5h-4m0 0v4m0-4 5 5"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }}
              >
                <PhotoView
                  src={`${SERVER_URL}${productData.thumbnailImgPath}`} // Ensure the URL is correct
                >
                  <Image
                    src={`${SERVER_URL}${productData.thumbnailImgPath}`}
                    alt={productData.productName}
                    width={800}
                    height={600}
                    className="cursor-pointer rounded-lg"
                    onLoad={handleImageLoad}
                    priority
                  />
                </PhotoView>

                <div
                  className={`flex flex-wrap justify-center gap-4 w-full ${Style.side_view}`}
                >
                  {productData.images.map((item, index) => (
                    <div>
                      <PhotoView
                        key={index}
                        src={`${SERVER_URL}${item.filePath.replace(/~/g, "")}`} // Ensure the URL is correct
                      >
                        <img
                          src={`${SERVER_URL}${item.filePath.replace(
                            /~/g,
                            ""
                          )}`}
                          alt={item.name}
                          style={{ width: "100px", cursor: "pointer" }} // Adjust the width if needed
                        />
                      </PhotoView>
                    </div>
                  ))}
                </div>
              </PhotoProvider>
            </div>
          </div>
        </Card>
      </div>
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        {/* Conditional rendering based on screen size */}
        {isMobile ? (
          <Accordion aria-label="Full width accordion">
            <Accordion.Panel>
              <Accordion.Title>Description</Accordion.Title>
              <Accordion.Content>
                <div
                  dangerouslySetInnerHTML={{
                    __html: productData.description,
                  }}
                />
              </Accordion.Content>
            </Accordion.Panel>
            {/* <Accordion.Panel>
              <Accordion.Title>Features</Accordion.Title>
              <Accordion.Content>
                <div
                  dangerouslySetInnerHTML={{
                    __html: productData.details,
                  }}
                />
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Details</Accordion.Title>
              <Accordion.Content>
                <div
                  dangerouslySetInnerHTML={{
                    __html: productData.details,
                  }}
                />
              </Accordion.Content>
            </Accordion.Panel> */}
            <Accordion.Panel>
              <Accordion.Title>Video</Accordion.Title>
              <Accordion.Content>
                <div
                  className="Container overflow-hidden  grid place-items-center "
                  dangerouslySetInnerHTML={{ __html: productData.videoLink }}
                ></div>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Location</Accordion.Title>
              <Accordion.Content>
                <div
                  className="Container overflow-hidden grid place-items-center"
                  dangerouslySetInnerHTML={{ __html: productData.mapLink }}
                ></div>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Contact Agent</Accordion.Title>
              <Accordion.Content>
                <div className="-m-10">
                  <ContactAgentForm />
                </div>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        ) : (
          <Card style={{ backgroundColor: "#14222d" }}>
            <div className="overflow-x-auto text-white">
              <Tabs aria-label="Full width tabs">
                <Tabs.Item active title="Description" icon={HiUserCircle}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: productData.description,
                    }}
                  />
                </Tabs.Item>
                {/* <Tabs.Item title="Features" icon={MdDashboard}>
                  <div
                    dangerouslySetInnerHTML={{ __html: productData.details }}
                  />
                </Tabs.Item>
                <Tabs.Item title="Details" icon={HiAdjustments}>
                  <div
                    dangerouslySetInnerHTML={{ __html: productData.details }}
                  />
                </Tabs.Item> */}
                <Tabs.Item
                  title="Floor Plan"
                  icon={HiClipboardList}
                ></Tabs.Item>
                <Tabs.Item title="Video" icon={HiClipboardList}>
                  <div
                    className="Container w-full grid place-items-center"
                    dangerouslySetInnerHTML={{ __html: productData.videoLink }}
                  ></div>
                </Tabs.Item>
                <Tabs.Item title="Location" icon={HiClipboardList}>
                  <div
                    className="Container w-full grid place-items-center"
                    dangerouslySetInnerHTML={{ __html: productData.mapLink }}
                  ></div>
                </Tabs.Item>
              </Tabs>
            </div>
            <div className="pt-1 px-4 sm:px-0">
              <div className="block sm:hidden w-full">
                <ContactAgentForm />
              </div>
              <div className="hidden sm:block w-full">
                <Card
                  className="max-w-full "
                  style={{ backgroundColor: "#14222d" }}
                >
                  <ContactAgentFormDark />
                </Card>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default ProductByIdView;
