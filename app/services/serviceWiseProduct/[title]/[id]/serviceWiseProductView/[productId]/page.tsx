"use client";
import { useEffect, useState, ChangeEvent } from "react";
import {
  Card,
  Badge,
  Tabs,
  Spinner,
  Accordion,
  Button,
  Modal,
  FileInput,
} from "flowbite-react";
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
import ContactAgentForm from "../../../../../../contactAgentForm/AgentForm";
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    uploadData.append("Address", formData.address);
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

  const handleDownload = () => {
    const files = ["OFFER FORM.pdf", "Rental Application.pdf"];

    files.forEach((file) => {
      const link = document.createElement("a");
      link.href = `/${file}`;
      link.download = file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  // for application request

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Product/UpdateProduct?id=${productId}`,
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
                {productData.price === 0 ? (
                  "Contact Agent for Price"
                ) : (
                  <>
                    {productData.propertyStatusValue.toLowerCase() ===
                      "buy" && <div>Starting From</div>}
                    <b>
                      <span>$</span>
                      {Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(productData.price)}
                    </b>
                  </>
                )}
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
                            "",
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
              <Accordion.Title>Floor Plan</Accordion.Title>
              <Accordion.Content>
                {productData.propertyStatusValue === "Buy" &&
                  productData.images.length > 0 && (
                    <div>
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
                    </div>
                  )}
              </Accordion.Content>
            </Accordion.Panel>
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

            {productData.propertyStatusValue === "Rent" ||
            productData.propertyStatusValue === "Buy" ? (
              <Accordion.Panel>
                <Accordion.Title>Application Request</Accordion.Title>
                <Accordion.Content>
                  <Button className="brand-button" onClick={handleDownload}>Download Form</Button>

                  <br />
                  <div>
                    <Button className="brand-button" onClick={() => setOpenModal(true)}>
                      Upload Form
                    </Button>

                    <Modal show={openModal} onClose={() => setOpenModal(false)}>
                      <Modal.Header style={{ backgroundColor: "#14222d" }}>
                        <div className="text-white"> Upload Instructions</div>
                      </Modal.Header>
                      <Modal.Body style={{ backgroundColor: "#14222d" }}>
                        <p className="text-white">
                          Please select your files and confirm to upload them.
                          Files must be in .jpg or .png format
                        </p>

                        <form className="flex flex-col gap-6 mt-10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                              <label htmlFor="firstName" className="text-white">
                                First Name
                              </label>
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                className="text-black p-2"
                                value={formData.firstName}
                                onChange={handleInputChange}
                              />
                            </div>

                            {/* Middle Name */}
                            <div>
                              <label
                                htmlFor="middleName"
                                className="text-white"
                              >
                                Middle Name
                              </label>
                              <input
                                id="middleName"
                                name="middleName"
                                type="text"
                                className="text-black p-2"
                                value={formData.middleName}
                                onChange={handleInputChange}
                              />
                            </div>

                            {/* Last Name */}
                            <div>
                              <label htmlFor="lastName" className="text-white">
                                Last Name
                              </label>
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                className="text-black p-2"
                                value={formData.lastName}
                                onChange={handleInputChange}
                              />
                            </div>

                            {/* Phone Number */}
                            <div>
                              <label
                                htmlFor="phoneNumber"
                                className="text-white"
                              >
                                Phone Number
                              </label>
                              <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                className="text-black p-2"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                              />
                            </div>

                            {/* Address */}
                            <div>
                              <label htmlFor="address" className="text-white">
                                Address
                              </label>
                              <input
                                id="address"
                                name="address"
                                type="text"
                                className="text-black p-2"
                                value={formData.address}
                                onChange={handleInputChange}
                              />
                            </div>

                            {/* Email */}
                            <div>
                              <label htmlFor="email" className="text-white">
                                Your Email
                              </label>
                              <input
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

                          {/* Description */}
                          <div className="flex flex-col">
                            <label htmlFor="description" className="text-white">
                              Your Message
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              rows={4}
                              className="w-full text-black p-2 rounded"
                              value={formData.description}
                              onChange={handleInputChange}
                            />
                          </div>

                          {/* File Upload */}
                          <div className="flex flex-col">
                            <label
                              htmlFor="applicationFormFile"
                              className="text-white"
                            >
                              Application Request
                            </label>
                            <FileInput
                              id="applicationFormFile"
                              name="applicationFormFile"
                              multiple
                              onChange={handleFileChange}
                              className="text-white"
                            />
                            <ul>
                              {formData.applicationFormFile.map(
                                (file, index) => (
                                  <li
                                    key={index}
                                    className="text-sm text-white flex justify-between p-4 bg-slate-700 my-3"
                                  >
                                    {file.name}
                                    <button
                                      className="brand-button ml-2 rounded px-2"
                                      onClick={() => handleRemoveFile(index)}
                                    >
                                      Remove
                                    </button>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </form>

                        <Button
                          className="brand-button px-4 py-2 rounded mt-4"
                          onClick={handleConfirm}
                          disabled={formData.applicationFormFile.length === 0}
                        >
                          Confirm Upload
                        </Button>
                      </Modal.Body>
                    </Modal>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            ) : (
              <></>
            )}

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
                <Tabs.Item title="Floor Plan" icon={HiClipboardList}>
                  {productData.propertyStatusValue === "Buy" &&
                    productData.images.length > 0 && (
                      <div>
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
                      </div>
                    )}
                </Tabs.Item>
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

                {productData.propertyStatusValue === "Rent" ||
                productData.propertyStatusValue === "Buy" ? (
                  <Tabs.Item title="Application Request" icon={HiClipboardList}>
                    <Button className="brand-button" onClick={handleDownload}>Download Form</Button>

                    <br />
                    <div>
                      <Button className="brand-button" onClick={() => setOpenModal(true)}>
                        Upload Form
                      </Button>

                      <Modal
                        show={openModal}
                        onClose={() => setOpenModal(false)}
                      >
                        <Modal.Header style={{ backgroundColor: "#14222d" }}>
                          <div className="text-white"> Upload Instructions</div>
                        </Modal.Header>
                        <Modal.Body style={{ backgroundColor: "#14222d" }}>
                          <p className="text-white">
                            Please select your files and confirm to upload them.
                            Files must be in .jpg or .png format
                          </p>

                          <form className="flex flex-col gap-6 mt-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* First Name */}
                              <div>
                                <label
                                  htmlFor="firstName"
                                  className="text-white"
                                >
                                  First Name
                                </label>
                                <input
                                  id="firstName"
                                  name="firstName"
                                  type="text"
                                  className="text-black p-2"
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Middle Name */}
                              <div>
                                <label
                                  htmlFor="middleName"
                                  className="text-white"
                                >
                                  Middle Name
                                </label>
                                <input
                                  id="middleName"
                                  name="middleName"
                                  type="text"
                                  className="text-black p-2"
                                  value={formData.middleName}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Last Name */}
                              <div>
                                <label
                                  htmlFor="lastName"
                                  className="text-white"
                                >
                                  Last Name
                                </label>
                                <input
                                  id="lastName"
                                  name="lastName"
                                  type="text"
                                  className="text-black p-2"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Phone Number */}
                              <div>
                                <label
                                  htmlFor="phoneNumber"
                                  className="text-white"
                                >
                                  Phone Number
                                </label>
                                <input
                                  id="phoneNumber"
                                  name="phoneNumber"
                                  type="text"
                                  className="text-black p-2"
                                  value={formData.phoneNumber}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Address */}
                              <div>
                                <label htmlFor="address" className="text-white">
                                  Address
                                </label>
                                <input
                                  id="address"
                                  name="address"
                                  type="text"
                                  className="text-black p-2"
                                  value={formData.address}
                                  onChange={handleInputChange}
                                />
                              </div>

                              {/* Email */}
                              <div>
                                <label htmlFor="email" className="text-white">
                                  Your Email
                                </label>
                                <input
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

                            {/* Description */}
                            <div className="flex flex-col">
                              <label
                                htmlFor="description"
                                className="text-white"
                              >
                                Your Message
                              </label>
                              <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="w-full text-black p-2 rounded"
                                value={formData.description}
                                onChange={handleInputChange}
                              />
                            </div>

                            {/* File Upload */}
                            <div className="flex flex-col">
                              <label
                                htmlFor="applicationFormFile"
                                className="text-white"
                              >
                                Application Request
                              </label>
                              <FileInput
                                id="applicationFormFile"
                                name="applicationFormFile"
                                multiple
                                onChange={handleFileChange}
                                className="text-white"
                              />
                              <ul>
                                {formData.applicationFormFile.map(
                                  (file, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-white flex justify-between p-4 bg-slate-700 my-3"
                                    >
                                      {file.name}
                                      <button
                                        className="brand-button ml-2 rounded px-2"
                                        onClick={() => handleRemoveFile(index)}
                                      >
                                        Remove
                                      </button>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </form>

                          <Button
                            className="brand-button px-4 py-2 rounded mt-4"
                            onClick={handleConfirm}
                            disabled={formData.applicationFormFile.length === 0}
                          >
                            Confirm Upload
                          </Button>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </Tabs.Item>
                ) : (
                  ""
                )}
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

        {/* confirmation modal */}
        <Modal
          show={openModalSubmittion}
          onClose={() => setOpenModalSubmittion(false)}
          className="pt-96 lg:pt-0"
        >
          <Modal.Header style={{ backgroundColor: "#14222d" }}>
            <div className="text-white"> Form Submitted Successfully</div>
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

export default ProductByIdView;
