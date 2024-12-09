"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge, Tabs, Spinner, Accordion } from "flowbite-react";
import {
  HiEye,
  HiCalendar,
  HiPencilAlt,
  HiUserCircle,
  HiAdjustments,
  HiClipboardList,
} from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";
import BASE_URL from "../../../../urlConfig/urlConfig";
import SERVER_URL from "../../../../urlConfig/serverUrl";
import Style from "./productByCateoryView.module.css";
import ContactAgentForm from "../../../../contactAgentForm/page";

interface ProductByCategroy {
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
  roomCount: number;
  bathRoomCount: number;
  area: number;
  images: {
    name: string;
    filePath: string;
  }[];
}

interface UpdateProductByCategroy {
  params: {
    id: string;
  };
}

const ProductByCategoryView: React.FC<UpdateProductByCategroy> = ({
  params,
}) => {
  const { id } = params;
  const [productData, setProductData] = useState<ProductByCategroy>({
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
    roomCount: 0,
    bathRoomCount: 0,
    area: 0,
    images: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false); // State to track loading image
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Product/UpdateProduct?id=${id}`
        );
        if (response.ok) {
          const data: ProductByCategroy = await response.json();
          setProductData({
            ...data,
            thumbnailImgPath: data.thumbnailImgPath
              ? data.thumbnailImgPath.replace(/~/g, "")
              : "",
            newThumbnailImg: data.newThumbnailImg
              ? data.newThumbnailImg.replace(/~z/g, "")
              : "",
          });
          setIsLoading(false);
          setError(null);
        } else {
          setError("Failed to fetch data");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error: Unable to fetch data from server");
        setIsLoading(false);
      }
    };
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
    fetchData();
  }, [id]);

  const changeImage = (url: string) => {
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
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        <p>Error: {error}</p>
      </div>
    );
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
                  {productData.price}
                </b>
              </h1>
            </div>
          </div>

          <hr />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <span className="inline-flex items-baseline text-l text-white sm:text-sm font-bold">
              <HiEye style={{ paddingTop: "2px" }} /> &nbsp;
              <span>{productData.roomCount} Room/s</span>
            </span>
            <span className="inline-flex items-baseline text-l text-white sm:text-sm font-bold">
              <HiCalendar style={{ paddingTop: "2px" }} /> &nbsp;
              <span>{productData.bathRoomCount} Bathroom/s</span>
            </span>
            <span className="inline-flex items-baseline text-l text-white sm:text-sm font-bold">
              <HiPencilAlt />
              &nbsp;
              <span>{productData.area} meter Sq</span>
            </span>
          </div>
        </Card>
      </div>
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        <Card>
          <div className="flex flex-col items-center">
            <div className="main_view mb-4 w-full flex justify-center">
              {imageLoading && <Spinner size="xl" />}
              <Image
                src={`${SERVER_URL}${productData.thumbnailImgPath}`}
                alt={productData.productName}
                width={800}
                height={600}
                className="cursor-pointer rounded-lg"
                onLoad={handleImageLoad}
                priority
              />
            </div>

            <div
              className={`flex flex-wrap justify-center gap-2 w-full ${Style.side_view}`}
            >
              {productData.images.map((image, index) => (
                <Image
                  key={index}
                  src={
                    new URL(image.filePath.replace(/~/g, ""), SERVER_URL).href
                  }
                  className="cursor-pointer rounded-lg"
                  onClick={() => changeImage(image.filePath.replace(/~/g, ""))}
                  alt={image.name}
                  width={150}
                  height={100}
                  priority
                />
              ))}
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
            <Accordion.Panel>
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
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Video</Accordion.Title>
              <Accordion.Content>
                <a
                  href={productData.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Location</Accordion.Title>
              <Accordion.Content>
                <a
                  href={productData.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Map
                </a>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Contact Agent</Accordion.Title>
              <Accordion.Content>
                <ContactAgentForm />
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Tabs aria-label="Full width tabs">
                <Tabs.Item active title="Description" icon={HiUserCircle}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: productData.description,
                    }}
                  />
                </Tabs.Item>
                <Tabs.Item title="Features" icon={MdDashboard}>
                  <div
                    dangerouslySetInnerHTML={{ __html: productData.details }}
                  />
                </Tabs.Item>
                <Tabs.Item title="Details" icon={HiAdjustments}>
                  <div
                    dangerouslySetInnerHTML={{ __html: productData.details }}
                  />
                </Tabs.Item>
                <Tabs.Item
                  title="Floor Plan"
                  icon={HiClipboardList}
                ></Tabs.Item>
                <Tabs.Item title="Video" icon={HiClipboardList}>
                  <a
                    href={productData.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Video
                  </a>
                </Tabs.Item>
                <Tabs.Item title="Location" icon={HiClipboardList}>
                  <a
                    href={productData.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </Tabs.Item>
              </Tabs>
            </div>
            <div className="pt-1 px-4 sm:px-0">
              <div className="block sm:hidden w-full">
                <ContactAgentForm />
              </div>
              <div className="hidden sm:block w-full">
                <Card className="max-w-full">
                  <ContactAgentForm />
                </Card>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default ProductByCategoryView;
