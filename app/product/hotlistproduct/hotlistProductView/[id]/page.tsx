"use client";
import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import {
  Card,
  Badge,
  Tabs,
  Spinner,
  Accordion,
  Button,
  Modal,
  FileInput,
  TextInput,
  Textarea,
  Label,
} from "flowbite-react";
import {
  HiCalendar,
  HiUserCircle,
  HiAdjustments,
  HiClipboardList,
} from "react-icons/hi";
import { IoMdDownload } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { FaCarAlt, FaBath } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";
import BASE_URL from "../../../../urlConfig/urlConfig";
import SERVER_URL from "../../../../urlConfig/serverUrl";
import Style from "./hostlist.module.css";
import ContactAgentForm from "../../../../contactAgentForm/page";
import PhotoSwipeLightbox from "photoswipe/lightbox";

import Slider from "react-slick";

import ContactAgentFormDark from "@/app/contactAgentForm/darkForm";
import Bedroom from "../../../../../public/bed-bedroom-alt.svg";

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

interface UpdateHotlistById {
  params: {
    id: string;
  };
}

const HotlistByIdView: React.FC<UpdateHotlistById> = ({ params }) => {
  const { id } = params;
  const [productData, setProductData] = useState<HotlistById>({
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const galleryRef = useRef<HTMLDivElement>(null);

  // for application request
  const [openModal, setOpenModal] = useState(false);
  const [openModalSubmittion, setOpenModalSubmittion] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    description: "",
    status: true,
    deleted: false,
    applicationFormFile: [] as File[],
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setFormData((prevState) => ({
      ...prevState,
      applicationFormFile: files,
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      applicationFormFile: prevState.applicationFormFile.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleConfirm = async () => {
    const uploadData = new FormData();
    uploadData.append("FirstName", formData.firstName);
    uploadData.append("MiddleName", formData.middleName);
    uploadData.append("LastName", formData.lastName);
    uploadData.append("ContactNumber", formData.phoneNumber);
    uploadData.append(
      "Address",
      `${productData.address} — ${formData.address}`,
    );
    uploadData.append("EmailAddress", formData.email);
    uploadData.append("Description", formData.description);
    uploadData.append("Status", formData.status.toString());
    uploadData.append("Deleted", formData.deleted.toString());
    formData.applicationFormFile.forEach((file) => {
      uploadData.append("ApplicationFormFile.ImgFile", file);
    });

    try {
      const response = await fetch(`${BASE_URL}/ApplicationForm/FormSubmit`, {
        method: "POST",
        body: uploadData,
      });
      if (response.ok) {
        alert("Files uploaded successfully!");
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          phoneNumber: "",
          address: "",
          email: "",
          description: "",
          status: true,
          deleted: false,
          applicationFormFile: [],
        });
        setOpenModal(false);
        setOpenModalSubmittion(true);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      alert("Error uploading files");
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Product/UpdateProduct?id=${id}`,
        );

        if (response.ok) {
          const data: HotlistById = await response.json();
          console.log("Fetched product data:", data); // Log the fetched data for debugging
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
    fetchData();
  }, [id]);

  // Mobile detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);
    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  // PhotoSwipe — re-init after slick renders (300ms delay)
  useEffect(() => {
    if (isLoading || !productData.thumbnailImgPath) return;

    const timer = setTimeout(() => {
      const lightbox = new PhotoSwipeLightbox({
        gallery: "#property-gallery",
        children: "a[data-pswp-width]",
        mouseMovePan: true,
        initialZoomLevel: "fit",
        secondaryZoomLevel: 1.5,
        maxZoomLevel: 1,
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();

      // store destroy on the timer cleanup
      (window as any)._pswpLightbox = lightbox;
    }, 300);

    return () => {
      clearTimeout(timer);
      if ((window as any)._pswpLightbox) {
        (window as any)._pswpLightbox.destroy();
        (window as any)._pswpLightbox = null;
      }
    };
  }, [isLoading, productData]);

  const handleImageLoad = () => setImageLoading(false);

  if (isLoading) {
    return (
      <div className="container items-center justify-center mx-auto mt-10 mb-10 px-4 sm:px-0">
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

  const allImages = [
    {
      src: `${SERVER_URL}${productData.thumbnailImgPath}`,
      name: productData.productName,
    },
    ...productData.images.map((img) => ({
      src: `${SERVER_URL}${img.filePath.replace(/~/g, "")}`,
      name: img.name,
    })),
  ];

  const thumbnailSliderSettings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: Math.min(allImages.length - 1, 5),
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: false,
    arrows: allImages.length - 1 > 5,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          arrows: true,
        },
      },
    ],
  };

  // Shared upload modal form JSX (used in both mobile and desktop)
  const UploadModalForm = (
    <>
      <Modal.Header style={{ backgroundColor: "#14222d" }}>
        <div className="text-white">Upload Instructions</div>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#14222d" }}>
        <p className="text-white">
          Please select your files and confirm to upload them. Files must be in
          .jpg or .png format
        </p>

        <div className="flex flex-col gap-6 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <TextInput
                id="firstName"
                name="firstName"
                type="text"
                className="text-black p-2"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="middleName" className="text-white">
                Middle Name
              </Label>
              <TextInput
                id="middleName"
                name="middleName"
                type="text"
                className="text-black p-2"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <TextInput
                id="lastName"
                name="lastName"
                type="text"
                className="text-black p-2"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-white">
                Phone Number
              </Label>
              <TextInput
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                className="text-black p-2"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-white">
                Address
              </Label>
              <TextInput
                id="address"
                name="address"
                type="text"
                className="text-black p-2"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">
                Your Email
              </Label>
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="name@domain.com"
                required
                className="text-black p-2"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="description" className="text-white">
              Your Message
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              className="w-full text-black p-2 rounded"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="applicationFormFile" className="text-white">
              Application Request
            </Label>
            <FileInput
              id="applicationFormFile"
              name="applicationFormFile"
              multiple
              onChange={handleFileChange}
              className="text-white"
            />
            <ul>
              {formData.applicationFormFile.map((file, index) => (
                <li
                  key={index}
                  className="text-sm text-white flex justify-between p-4 bg-slate-700 my-3"
                >
                  {file.name}
                  <button
                    className="text-red-500 ml-2"
                    onClick={() => handleRemoveFile(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          className="text-white px-4 py-2 rounded mt-4 w-full"
          style={{ backgroundColor: "#F27423" }}
          onClick={handleConfirm}
          disabled={formData.applicationFormFile.length === 0}
        >
          Confirm Upload
        </Button>
      </Modal.Body>
    </>
  );

  // Shared download + upload card section
  const ApplicationSection = (
    <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-3">
      <Card className="w-full sm:w-1/2">
        {productData.propertyStatusValue === "Buy" ? (
          <a
            href={
              productData.details === "0"
                ? "/Residental Form.pdf"
                : "/OFFER FORM.pdf"
            }
            download="Offer Form"
          >
            <Button className="w-full">Download Offer Form</Button>
            <br />
            <div
              style={{ color: "#0f7490" }}
              className="grid place-items-center w-full"
            >
              <IoMdDownload size={50} />
            </div>
          </a>
        ) : (
          <a href="/Rental Application.pdf" download="Rental Application">
            <Button className="w-full">Download Rental Form</Button>
            <br />
            <div
              style={{ color: "#0f7490" }}
              className="grid place-items-center w-full"
            >
              <IoMdDownload size={50} />
            </div>
          </a>
        )}
      </Card>

      <Card
        className="w-full sm:w-1/2 cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        <Button>Upload Form</Button>
        <div
          style={{ color: "#0f7490" }}
          className="grid place-items-center w-full"
        >
          <MdFileUpload size={50} />
        </div>
      </Card>
    </div>
  );

  return (
    <>
      {/* ── Property Header Card ── */}
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
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

            {(() => {
              const isBuyable =
                productData.price !== 0 &&
                productData.propertyStatusValue === "Buy";
              const hasNoPrice = productData.price === 0;

              const displayPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }).format(productData.price);

              return (
                <div
                  className={`flex justify-end ${isBuyable ? "flex-col items-end" : ""}`}
                >
                  {isBuyable && <h2>Starting From</h2>}

                  <h1 className="text-xl sm:text-2xl text-orange-500 hover:text-red-500 font-bold">
                    {hasNoPrice ? "Contact Agent for Price" : displayPrice}
                  </h1>
                </div>
              );
            })()}
          </div>

          <hr />

          <div className="grid grid-cols-1 sm:flex justify-between gap-4">
            {productData.roomCount >= 1 && (
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
            {productData.bathRoomCount >= 1 && (
              <span className="inline-flex items-center text-l text-white sm:text-sm font-bold">
                <FaBath /> &nbsp;
                <span>{productData.bathRoomCount} Bathroom</span>
              </span>
            )}
            {productData.area >= 1 && (
              <span className="inline-flex items-center text-l text-white sm:text-sm font-bold">
                <HiCalendar /> &nbsp;
                <span>{productData.area} m.sq</span>
              </span>
            )}
            {productData.parkingCount >= 1 && (
              <span className="inline-flex items-center text-l text-white sm:text-sm font-bold">
                <FaCarAlt /> &nbsp;
                <span>{productData.parkingCount} Parking Space</span>
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* ── Image Gallery Card ── */}
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        <Card style={{ backgroundColor: "#14222d" }}>
          <div className="flex flex-col items-center w-full">
            {imageLoading && <Spinner size="xl" />}

            <div id="property-gallery" ref={galleryRef} className="w-full">
              <a
                href={allImages[0]?.src}
                data-pswp-width={800}
                data-pswp-height={600}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={allImages[0]?.src}
                  alt={productData.productName}
                  width={800}
                  height={600}
                  className="cursor-pointer rounded-lg w-full xl:w-1/2 lg:mx-auto object-cover"
                  onLoad={handleImageLoad}
                  priority
                />
              </a>

              {allImages.length > 4 ? (
                <div className="mt-4 w-full lg:w-1/2 lg:mx-auto">
                  <Slider {...thumbnailSliderSettings}>
                    {allImages.slice(1).map((item, index) => (
                      <div key={index} className="px-1">
                        <a
                          href={item.src}
                          data-pswp-width={800}
                          data-pswp-height={600}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={item.src}
                            alt={item.name}
                            className="cursor-pointer w-full h-[70px] sm:h-[90px] md:h-[120px] object-cover rounded"
                          />
                        </a>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="flex  overflow-x-auto gap-1 w-full flex-nowrap justify-center sm:gap-4 mt-4 ">
                  {allImages.slice(1).map((item, index) => (
                    <div key={index}>
                      <a
                        href={item.src}
                        data-pswp-width={800}
                        data-pswp-height={600}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={item.src}
                          alt={item.name}
                          className="shrink-0 cursor-pointer sm:shrink w-[100px] h-30 md:h-[110px] object-cover"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Description / Tabs Card ── */}
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        {isMobile ? (
          /* ─── MOBILE: Accordion ─── */
          <Accordion aria-label="Full width accordion">
            <Accordion.Panel>
              <Accordion.Title>Description</Accordion.Title>
              <Accordion.Content>
                <div
                  dangerouslySetInnerHTML={{ __html: productData.description }}
                />
              </Accordion.Content>
            </Accordion.Panel>

            <Accordion.Panel>
              <Accordion.Title>Floor Plan</Accordion.Title>
              <Accordion.Content>
                {productData.propertyStatusValue === "Buy" &&
                  productData.images.length > 0 && (
                    <Image
                      src={`${SERVER_URL}${productData.images[
                        productData.images.length - 1
                      ].filePath.replace(/~/g, "")}`}
                      alt={productData.productName}
                      width={800}
                      height={300}
                      className="cursor-pointer rounded-lg h-screen w-auto mx-auto"
                      onLoad={handleImageLoad}
                      priority
                    />
                  )}
              </Accordion.Content>
            </Accordion.Panel>

            <Accordion.Panel>
              <Accordion.Title>Video</Accordion.Title>
              <Accordion.Content>
                <div
                  className="overflow-hidden grid place-items-center"
                  dangerouslySetInnerHTML={{ __html: productData.videoLink }}
                />
              </Accordion.Content>
            </Accordion.Panel>

            <Accordion.Panel>
              <Accordion.Title>Location</Accordion.Title>
              <Accordion.Content>
                <div
                  className="overflow-hidden grid place-items-center"
                  dangerouslySetInnerHTML={{ __html: productData.mapLink }}
                />
              </Accordion.Content>
            </Accordion.Panel>

            {productData.propertyStatusValue === "Rent" ||
            productData.propertyStatusValue === "Buy" ? (
              <Accordion.Panel>
                <Accordion.Title>
                  {productData.details === "0"
                    ? "Offer Form"
                    : "Application Request"}
                </Accordion.Title>
                <Accordion.Content>
                  {ApplicationSection}

                  <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    {UploadModalForm}
                  </Modal>
                </Accordion.Content>
              </Accordion.Panel>
            ) : (
              <></>
            )}

            <Accordion.Panel>
              <Accordion.Title>Contact Agent</Accordion.Title>
              <Accordion.Content>
                <div className="-m-5">
                  <ContactAgentForm />
                </div>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        ) : (
          /* ─── DESKTOP: Tabs ─── */
          <Card style={{ backgroundColor: "#14222d" }}>
            <div className="overflow-x-auto text-white">
              <Tabs aria-label="Full width tabs">
                <Tabs.Item active title="Description" icon={HiUserCircle}>
                  <div
                    className="
                      [&_p]:min-h-[1em]
                      [&_ul]:list-disc [&_ul]:pl-5
                      [&_ol]:list-decimal [&_ol]:pl-5
                      [&_li]:my-0.5
                      [&_strong]:font-bold
                      [&_em]:italic
                      [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-2
                      [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-2
                      [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:my-1
                    "
                    dangerouslySetInnerHTML={{
                      __html: productData.description,
                    }}
                  />
                </Tabs.Item>

                <Tabs.Item title="Floor Plan" icon={HiClipboardList}>
                  {productData.propertyStatusValue === "Buy" &&
                    productData.images.length > 0 && (
                      <Image
                        src={`${SERVER_URL}${productData.images[
                          productData.images.length - 1
                        ].filePath.replace(/~/g, "")}`}
                        alt={productData.productName}
                        width={800}
                        height={300}
                        className="cursor-pointer rounded-lg h-screen w-auto mx-auto"
                        onLoad={handleImageLoad}
                        priority
                      />
                    )}
                </Tabs.Item>

                <Tabs.Item title="Video" icon={HiClipboardList}>
                  <div
                    className="w-full grid place-items-center"
                    dangerouslySetInnerHTML={{ __html: productData.videoLink }}
                  />
                </Tabs.Item>

                <Tabs.Item title="Location" icon={HiClipboardList}>
                  <div
                    className="w-full grid place-items-center"
                    dangerouslySetInnerHTML={{ __html: productData.mapLink }}
                  />
                </Tabs.Item>

                {(productData.propertyStatusValue === "Rent" ||
                  productData.propertyStatusValue === "Buy") && (
                  <Tabs.Item
                    title={
                      productData.details === "0"
                        ? "Offer Form"
                        : "Application Request"
                    }
                    icon={HiClipboardList}
                  >
                    {ApplicationSection}

                    <Modal
                      dismissible
                      show={openModal}
                      onClose={() => setOpenModal(false)}
                      size="8xl"
                      className="p-72"
                    >
                      {UploadModalForm}
                    </Modal>
                  </Tabs.Item>
                )}
              </Tabs>
            </div>

            {/* Contact Agent — hidden on mobile (shown in accordion above) */}
            <div className="pt-1 px-4 sm:px-0">
              <div className="block sm:hidden w-full">
                <ContactAgentForm />
              </div>
              <div className="hidden sm:block w-full">
                <Card
                  className="max-w-full"
                  style={{ backgroundColor: "#14222d" }}
                >
                  <ContactAgentFormDark />
                </Card>
              </div>
            </div>
          </Card>
        )}

        {/* ── Success confirmation modal ── */}
        <Modal
          show={openModalSubmittion}
          onClose={() => setOpenModalSubmittion(false)}
          className="pt-96 lg:pt-0"
          size="7xl"
        >
          <Modal.Header style={{ backgroundColor: "#14222d" }}>
            <div className="text-white">Form Submitted Successfully</div>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#14222d" }}>
            <p className="text-white">
              Thank you for the Application Submit. Will reach you within 24 hr.
            </p>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default HotlistByIdView;
