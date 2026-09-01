"use client";
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import {
  Card,
  Badge,
  Spinner,
  Button,
  Modal,
  FileInput,
  TextInput,
  Textarea,
  Label,
} from "flowbite-react";
import {
  HiCalendar,
  HiOutlineUserCircle,
  HiOutlineHome,
  HiOutlineVideoCamera,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiChevronDown,
} from "react-icons/hi";
import { IoMdDownload } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { FaCarAlt, FaBath } from "react-icons/fa";
import Image from "next/image";
import BASE_URL from "../../../../urlConfig/urlConfig";
import SERVER_URL from "../../../../urlConfig/serverUrl";
import Style from "./hostlist.module.css";
import ContactAgentForm from "../../../../contactAgentForm/AgentForm";
import PhotoSwipeLightbox from "photoswipe/lightbox";
//@ts-ignore
import "photoswipe/style.css";
import Slider from "react-slick";
//@ts-ignore
import "slick-carousel/slick/slick.css";
//@ts-ignore
import "slick-carousel/slick/slick-theme.css";
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
  deleted: boolean;
}

interface UpdateHotlistById {
  params: {
    id: string;
  };
}

//if na shown on data
const isEmptyOrNA = (value?: string | null) => {
  if (!value) return true;
  const trimmed = value.trim().toLowerCase();
  return trimmed === "" || trimmed === "na";
};

// Read more / read less for HTML description
const DESCRIPTION_COLLAPSED_HEIGHT = 160; // px

const ReadMoreHTML: React.FC<{
  html: string;
  collapsedHeight?: number;
}> = ({ html, collapsedHeight = DESCRIPTION_COLLAPSED_HEIGHT }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      setFullHeight(el.scrollHeight);
      setOverflowing(el.scrollHeight > collapsedHeight + 4);
    };

    measure();

    // Re-measure if content inside (e.g. images) loads/resizes later.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html, collapsedHeight]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        style={{
          maxHeight: expanded ? (fullHeight ?? undefined) : collapsedHeight,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
        className="
          text-gray-300 leading-relaxed
          [&_p]:min-h-[1em]
          [&_ul]:list-disc [&_ul]:pl-5
          [&_ol]:list-decimal [&_ol]:pl-5
          [&_li]:my-1
          [&_strong]:font-semibold [&_strong]:text-white
          [&_em]:italic
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:my-2
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:my-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:my-1
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* fade-out overlay hinting there's more content, only while collapsed */}
      {!expanded && overflowing && (
        <div
          className="pointer-events-none absolute left-0 right-0 h-12"
          style={{
            bottom: 0,
            background:
              "linear-gradient(to top, #14222d 10%, rgba(20,34,45,0))",
          }}
        />
      )}

      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="relative z-10 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F27423] hover:text-orange-400 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
          <HiChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      )}
    </div>
  );
};

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
    deleted: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);

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
          console.log("Fetched product data:", data);
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
      <div className="flex items-center justify-center min-h-[60vh]">
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

  // Shared upload modal form JSX
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
        {/* when details has 0 then download resedential form and when details has 1 then download offer form */}
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

  const RentInquirySection = (
    <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-3">
      <Card className="w-full">
        {isEmptyOrNA(productData.details) ? (
          <Button className="w-full" disabled>
            No Link Found
          </Button>
        ) : (
          // goes to book inspection link
          <a href={productData.details} target="_blank" rel="noreferrer">
            <Button className="w-full">Book an Inspection</Button>
          </a>
        )}
      </Card>
    </div>
  );

  //no product error
  if (productData.deleted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 sm:px-0">
        <Card style={{ backgroundColor: "#14222d" }}>
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Badge color="failure" size="lg">
              Unavailable
            </Badge>
            <h2 className="text-xl font-semibold text-white">
              Property No Longer Available
            </h2>
            <p className="text-sm text-gray-400">
              This listing has been removed or is no longer active.
            </p>
            <Button color="gray" onClick={() => window.history.back()}>
              ← Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const showFormTab =
    productData.propertyStatusValue === "Rent" ||
    productData.propertyStatusValue === "Buy";

  const tabs = [
    {
      label: "Description",
      icon: HiOutlineUserCircle,
      content: productData.description ? (
        <ReadMoreHTML html={productData.description} />
      ) : (
        <p className="text-gray-400 text-sm py-6 text-center">
          No description available for this listing.
        </p>
      ),
    },
    {
      label: "Floor Plan",
      icon: HiOutlineHome,
      content:
        productData.propertyStatusValue === "Buy" &&
        productData.images.length > 0 ? (
          <Image
            src={`${SERVER_URL}${productData.images[
              productData.images.length - 1
            ].filePath.replace(/~/g, "")}`}
            alt={productData.productName}
            width={900}
            height={500}
            className="cursor-pointer rounded-xl w-full h-auto mx-auto border border-white/10"
            onLoad={handleImageLoad}
            priority
          />
        ) : (
          <p className="text-gray-400 text-sm py-6 text-center">
            No floor plan available for this listing.
          </p>
        ),
    },
    {
      label: "Video",
      icon: HiOutlineVideoCamera,
      content: !isEmptyOrNA(productData.videoLink) ? (
        <div
          className="w-full grid place-items-center rounded-xl overflow-hidden border border-white/10 [&_iframe]:w-full [&_iframe]:aspect-video"
          dangerouslySetInnerHTML={{ __html: productData.videoLink }}
        />
      ) : (
        <p className="text-gray-400 text-sm py-6 text-center">
          No video available for this listing.
        </p>
      ),
    },
    {
      label: "Location",
      icon: HiOutlineLocationMarker,
      content: !isEmptyOrNA(productData.mapLink) ? (
        <div
          className="w-full grid place-items-center rounded-xl overflow-hidden border border-white/10 [&_iframe]:w-full [&_iframe]:aspect-video"
          dangerouslySetInnerHTML={{ __html: productData.mapLink }}
        />
      ) : (
        <p className="text-gray-400 text-sm py-6 text-center">
          No location set for this listing.
        </p>
      ),
    },
    ...(showFormTab
      ? [
          {
            label:
              productData.propertyStatusValue === "Buy"
                ? "Offer Form"
                : "Book an Inspection",
            icon: HiOutlineDocumentText,
            content: (
              <>
                {productData.propertyStatusValue === "Buy"
                  ? ApplicationSection
                  : RentInquirySection}
                <Modal show={openModal} onClose={() => setOpenModal(false)}>
                  {UploadModalForm}
                </Modal>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
              {/* Main image — locked to a 3:2 aspect ratio */}
              <a
                href={allImages[0]?.src}
                data-pswp-width={900}
                data-pswp-height={600}
                target="_blank"
                rel="noreferrer"
                className="block w-full xl:w-1/2 lg:mx-auto"
              >
                <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg bg-black/20">
                  <Image
                    src={allImages[0]?.src}
                    alt={productData.productName}
                    fill
                    sizes="(min-width: 1280px) 50vw, 100vw"
                    className="cursor-pointer object-cover"
                    onLoad={handleImageLoad}
                    priority
                  />
                </div>
              </a>

              {allImages.length > 4 ? (
                <div className="mt-4 w-full lg:w-1/2 lg:mx-auto">
                  <Slider {...thumbnailSliderSettings}>
                    {allImages.slice(1).map((item, index) => (
                      <div key={index} className="px-1">
                        <a
                          href={item.src}
                          data-pswp-width={900}
                          data-pswp-height={600}
                          target="_blank"
                          rel="noreferrer"
                          className="block relative w-full aspect-[3/2] overflow-hidden rounded"
                        >
                          <img
                            src={item.src}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full cursor-pointer object-cover"
                          />
                        </a>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="flex overflow-x-auto gap-1 w-full flex-nowrap justify-center sm:gap-4 mt-4">
                  {allImages.slice(1).map((item, index) => (
                    <div
                      key={index}
                      className="relative shrink-0 sm:shrink w-[100px] md:w-[150px] aspect-[3/2] overflow-hidden"
                    >
                      <a
                        href={item.src}
                        data-pswp-width={900}
                        data-pswp-height={600}
                        target="_blank"
                        rel="noreferrer"
                        className="block absolute inset-0"
                      >
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full cursor-pointer object-cover"
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

      {/* ── Property Details — unified tab panel (same design on every breakpoint) ── */}
      <div className="container mx-auto mt-10 mb-10 px-4 sm:px-0">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#14222d] shadow-2xl">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#0f7490] opacity-20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#F27423] opacity-[0.08] blur-3xl" />

          <div className="relative">
            {/* tab bar — identical markup/colors at every breakpoint */}
            <div
              className="flex gap-1 overflow-x-auto px-3 pt-3 sm:px-5 sm:pt-5 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === i;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={`
                      group flex shrink-0 items-center gap-2 rounded-t-lg px-3 sm:px-4 py-2.5 sm:py-3
                      text-xs sm:text-sm font-medium whitespace-nowrap
                      border-b-2 transition-colors duration-150
                      ${
                        isActive
                          ? "border-[#F27423] text-white"
                          : "border-transparent text-gray-400 hover:text-gray-200"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150
                        ${
                          isActive
                            ? "bg-[#F27423]/15 text-[#F27423]"
                            : "bg-white/5 text-gray-500 group-hover:text-[#0f7490] group-hover:bg-[#0f7490]/10"
                        }
                      `}
                    >
                      <Icon size={15} />
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-white/10" />

            {/* active panel */}
            <div
              key={activeTab}
              className="p-5 sm:p-8 animate-[fadeIn_0.25s_ease-out]"
            >
              {tabs[activeTab].content}
            </div>
          </div>
        </div>

        {/* ── Contact Agent — same dark card treatment on every breakpoint ── */}
        <div className="mt-6 relative overflow-hidden rounded-2xl border border-white/10 bg-[#14222d] shadow-2xl">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#0f7490] opacity-[0.12] blur-3xl" />
          <div className="relative p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F27423]/15 text-[#F27423]">
                <HiOutlineChatAlt2 size={15} />
              </span>
              <h3 className="text-white font-semibold">Contact Agent</h3>
            </div>
            <ContactAgentFormDark />
          </div>
        </div>

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
