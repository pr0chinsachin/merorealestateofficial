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
  HiOutlineLocationMarker,
  HiChevronDown,
  HiOutlinePhotograph,
  HiOutlineShare,
  HiArrowsExpand,
} from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import styles from "./property.module.css";
import BASE_URL from "../../../../urlConfig/urlConfig";
import SERVER_URL from "../../../../urlConfig/serverUrl";
import PhotoSwipeLightbox from "photoswipe/lightbox";
//@ts-ignore
import "photoswipe/style.css";
import ContactAgentFormDark from "@/app/contactAgentForm/darkForm";

interface HotlistImage {
  imageId?: string;
  name: string;
  filePath: string;
  uploadedDate?: string;
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
  images: HotlistImage[];
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
  return ["", "na", "n/a", "-", "null", "not available"].includes(trimmed);
};

function mediaUrl(value?: string | null) {
  try {
    const src = value?.trim();
    const iframeSrc = src?.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    const url = new URL((iframeSrc ?? src ?? "").replace(/&amp;/g, "&"));
    return ["http:", "https:"].includes(url.protocol) ? { url: url.href, embedded: Boolean(iframeSrc) } : null;
  } catch {
    return null;
  }
}

// Finds an image whose name contains "floorplan" (case-insensitive)
const findFloorplanImage = (
  images: HotlistImage[],
): HotlistImage | undefined => {
  return images.find((img) =>
    (img.name || "").toLowerCase().includes("floorplan"),
  );
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
          text-[#183f48] leading-relaxed
          [&_p]:min-h-[1em]
          [&_ul]:list-disc [&_ul]:pl-5
          [&_ol]:list-decimal [&_ol]:pl-5
          [&_li]:my-1
          [&_strong]:font-semibold [&_strong]:text-[#083a47]
          [&_em]:italic
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#083a47] [&_h1]:my-2
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#083a47] [&_h2]:my-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#083a47] [&_h3]:my-1
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
              "linear-gradient(to top, #f3f9fa 10%, transparent)",
          }}
        />
      )}

      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="relative z-10 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--mero-orange-on-light)] hover:underline transition-colors"
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

// Floor plan image with a small "view full screen" icon, locked to 3:2.
// Clicking either the image or the icon opens a zoomable (pinch/drag) PhotoSwipe view.
const FloorPlanViewer: React.FC<{
  src: string;
  alt: string;
  onExpand: () => void;
  onLoad?: () => void;
}> = ({ src, alt, onExpand, onLoad }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative w-full aspect-[3/2] overflow-hidden rounded-xl border border-white/10 bg-black/20 cursor-zoom-in"
        onClick={onExpand}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 50vw, 100vw"
          className="object-cover"
          onLoad={onLoad}
          unoptimized
          priority
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          aria-label="View floor plan full screen with zoom"
          className="absolute bottom-3 right-3 z-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white p-2 transition-colors"
        >
          <HiArrowsExpand size={18} />
        </button>
      </div>
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
  const [shareStatus, setShareStatus] = useState("");
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  const galleryLightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  const floorPlanLightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  // ── Floor plan detection by filename (case-insensitive "floorplan") ──
  // Computed here (rather than after the loading/error early-returns) so it
  // can be used as a dependency for the floor plan's zoom lightbox effect.
  const floorplanImage = findFloorplanImage(productData.images);
  const floorPlanSrc: string | null = floorplanImage
    ? `${SERVER_URL}${floorplanImage.filePath.replace(/~/g, "")}`
    : productData.propertyStatusValue === "Buy" && productData.images.length > 0
      ? `${SERVER_URL}${productData.images[
          productData.images.length - 1
        ].filePath.replace(/~/g, "")}`
      : null;

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

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    setCategoryNames({});

    async function loadCategoryNames(
      endpoint: string,
      categoryId: string,
      label: "categoryTitle" | "subCategoryTitle",
    ) {
      if (!categoryId) return;
      try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, { signal: controller.signal });
        if (!response.ok) return;
        const rows: ({ id: string } & Partial<Record<typeof label, string>>)[] = await response.json();
        const name = rows.find((row) => String(row.id) === String(categoryId))?.[label];
        if (name && !controller.signal.aborted) {
          setCategoryNames((previous) => ({ ...previous, [label]: name }));
        }
      } catch {
        // The property can still be shown when category labels are unavailable.
      }
    }

    async function loadProperty() {
      try {
        const response = await fetch(`${BASE_URL}/Product/UpdateProduct?${new URLSearchParams({ id })}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load property");
        const data: HotlistById | null = await response.json();
        if (!data?.productName) throw new Error("Property unavailable");
        setProductData({
          ...data,
          thumbnailImgPath: data.thumbnailImgPath?.replace(/~/g, "") ?? "",
          images: (data.images ?? []).filter((image) => image.filePath),
        });
        setIsLoading(false);
        if (!data.deleted) {
          void loadCategoryNames("MenuCategory/CategoryList", data.categoryId, "categoryTitle");
          void loadCategoryNames("MenuSubCategory/SubCategoryList", data.subCategoryId, "subCategoryTitle");
        }
      } catch {
        if (controller.signal.aborted) return;
        setError("Couldn’t load this property. Please try again later.");
        setIsLoading(false);
      }
    }

    void loadProperty();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (isLoading || productData.deleted || error) return;
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#property-gallery",
      children: "a[data-pswp-width]",
      showHideAnimationType: "none",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    galleryLightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
      galleryLightboxRef.current = null;
    };
  }, [isLoading, productData, error]);

  // PhotoSwipe for the floor plan — gives pinch/drag/double-tap zoom in a
  // dedicated fullscreen viewer, separate from the main gallery instance.
  useEffect(() => {
    if (isLoading || !floorPlanSrc) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: "#floorplan-gallery",
      children: "a[data-pswp-width]",
      showHideAnimationType: "none",
      mouseMovePan: true,
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    floorPlanLightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
      floorPlanLightboxRef.current = null;
    };
  }, [isLoading, floorPlanSrc]);

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

  // Hide the detected floorplan image from the main gallery. If no image
  // matched by name, leave the gallery exactly as before.
  const galleryImages = floorplanImage
    ? productData.images.filter((img) =>
        floorplanImage.imageId
          ? img.imageId !== floorplanImage.imageId
          : img.filePath !== floorplanImage.filePath,
      )
    : productData.images;

  const images = [
    ...(productData.thumbnailImgPath ? [{ src: `${SERVER_URL}${productData.thumbnailImgPath}`, name: productData.productName }] : []),
    ...galleryImages.map((image) => ({
      src: `${SERVER_URL}${image.filePath.replace(/~/g, "")}`,
      name: image.name,
    })),
  ];
  const allImages = images.filter((image, index) => images.findIndex((item) => item.src === image.src) === index);

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
              <Label htmlFor="upload-firstName" className="text-white">
                First Name
              </Label>
              <TextInput
                id="upload-firstName"
                name="firstName"
                type="text"
                className="text-black p-2"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="upload-middleName" className="text-white">
                Middle Name
              </Label>
              <TextInput
                id="upload-middleName"
                name="middleName"
                type="text"
                className="text-black p-2"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="upload-lastName" className="text-white">
                Last Name
              </Label>
              <TextInput
                id="upload-lastName"
                name="lastName"
                type="text"
                className="text-black p-2"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="upload-phoneNumber" className="text-white">
                Phone Number
              </Label>
              <TextInput
                id="upload-phoneNumber"
                name="phoneNumber"
                type="text"
                className="text-black p-2"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="upload-address" className="text-white">
                Address
              </Label>
              <TextInput
                id="upload-address"
                name="address"
                type="text"
                className="text-black p-2"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="upload-email" className="text-white">
                Your Email
              </Label>
              <TextInput
                id="upload-email"
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
            <Label htmlFor="upload-description" className="text-white">
              Your Message
            </Label>
            <Textarea
              id="upload-description"
              name="description"
              rows={4}
              className="w-full text-black p-2 rounded"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="upload-applicationFormFile" className="text-white">
              Application Request
            </Label>
            <FileInput
              id="upload-applicationFormFile"
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
                    className="brand-button ml-2 rounded px-2"
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
          className="brand-button px-4 py-2 rounded mt-4 w-full"
          onClick={handleConfirm}
          disabled={formData.applicationFormFile.length === 0}
        >
          Confirm Upload
        </Button>
      </Modal.Body>
    </>
  );

  const inspection = mediaUrl(productData.details);

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
            <Button className="brand-button" onClick={() => window.history.back()}>
              ← Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  async function shareProperty() {
    setShareStatus("");
    try {
      if (navigator.share) {
        await navigator.share({ title: productData.productName, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Property link copied.");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        setShareStatus("Copy the property link from your address bar.");
      }
    }
  }

  const { productName, productCode, address, price, roomCount, bathRoomCount, parkingCount, area, propertyStatusValue: status } = productData;
  const statusLabel = ({ Buy: "For sale", Rent: "For rent", UnderManagement: "Under management" } as Record<string, string>)[status] ?? status;
  const showPrice = Number.isFinite(price) && price > 0;
  const displayPrice = showPrice ? new Intl.NumberFormat("en-AU", {
    style: "currency", currency: "AUD", minimumFractionDigits: 0,
  }).format(price) : "Contact agent";
  const priceLabel = showPrice && status === "Buy" ? "Starting from" : "Price";
  const facts = [
    { label: "Status", value: statusLabel },
    { label: "Property type", value: categoryNames.subCategoryTitle },
    { label: "Category", value: categoryNames.categoryTitle },
    { label: "Property ID", value: productCode },
    { label: "Bedrooms", value: roomCount > 0 ? roomCount : null },
    { label: "Bathrooms", value: bathRoomCount > 0 ? bathRoomCount : null },
    { label: "Car spaces", value: parkingCount > 0 ? parkingCount : null },
    { label: "Area", value: area > 0 ? `${area} m²` : null },
    { label: "Address", value: address },
  ].filter(({ value }) => typeof value === "number" || !isEmptyOrNA(value));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/#available-properties">Properties</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{productName}</span>
        </nav>

        <div className={styles.layout}>
          <article className={styles.content}>
            {allImages.length > 0 && (
              <div className={styles.galleryWrap}>
                <div id="property-gallery" className={styles.gallery} data-count={Math.min(allImages.length, 5)}>
                  {allImages.map((image, index) => (
                    <a
                      key={image.src}
                      href={image.src}
                      data-pswp-width={900}
                      data-pswp-height={600}
                      aria-label={`Open property photo ${index + 1}`}
                      hidden={index > 4}
                    >
                      {index < 5 && (
                        <Image
                          src={image.src}
                          alt={index === 0 ? productName : `${productName}, photo ${index + 1}`}
                          fill
                          sizes={index === 0 ? "(min-width: 960px) 40vw, 100vw" : "(min-width: 960px) 12vw, 28vw"}
                          unoptimized
                          priority={index === 0}
                          onLoad={(event) => {
                            const image = event.currentTarget;
                            const anchor = image.closest("a");
                            anchor?.setAttribute("data-pswp-width", String(image.naturalWidth));
                            anchor?.setAttribute("data-pswp-height", String(image.naturalHeight));
                          }}
                        />
                      )}
                    </a>
                  ))}
                </div>
                <button type="button" className={styles.galleryButton} onClick={() => galleryLightboxRef.current?.loadAndOpen(0)}>
                  <HiOutlinePhotograph aria-hidden="true" />
                  View {allImages.length === 1 ? "photo" : `all ${allImages.length} photos`}
                </button>
              </div>
            )}

            <header className={styles.heading}>
              {statusLabel && <span className={styles.badge}>{statusLabel}</span>}
              <h1>{productName}</h1>
              {!isEmptyOrNA(address) && <p className={styles.address}><HiOutlineLocationMarker aria-hidden="true" />{address}</p>}
              <p className={styles.mobilePrice}><span>{priceLabel}</span> {displayPrice}</p>
              <a href="#property-enquiry" className={styles.mobileEnquiry}>Enquire about this property</a>
            </header>

            {facts.length > 0 && (
              <section className={styles.section}>
                <h2>Key facts</h2>
                <dl className={styles.facts}>
                  {facts.map(({ label, value }) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
              </section>
            )}

            {!isEmptyOrNA(productData.description) && (
              <section className={styles.section}>
                <h2>About this property</h2>
                <ReadMoreHTML html={productData.description} />
              </section>
            )}

            {floorPlanSrc && (
              <section className={styles.section}>
                <h2>Floor plan</h2>
                <FloorPlanViewer src={floorPlanSrc} alt={`${productName} floor plan`} onExpand={() => floorPlanLightboxRef.current?.loadAndOpen(0)} />
                <div id="floorplan-gallery" hidden>
                  <a href={floorPlanSrc} data-pswp-width={1600} data-pswp-height={1067}>Open floor plan</a>
                </div>
              </section>
            )}

            {status === "Buy" && (
              <section className={styles.section}>
                <h2>Offer form</h2>
                <div className={styles.propertyActions}>
                  <a href={productData.details === "0" ? "/Residental Form.pdf" : "/OFFER FORM.pdf"} download>
                    Download offer form
                  </a>
                  <button type="button" onClick={() => setOpenModal(true)}>Upload form</button>
                </div>
              </section>
            )}
            {status === "Rent" && inspection && (
              <section className={styles.section}>
                <h2>Inspection</h2>
                <div className={styles.propertyActions}>
                  <a href={inspection.url} target="_blank" rel="noreferrer">Book an inspection</a>
                </div>
              </section>
            )}

            {[
              { label: "Location", embed: productData.mapLink },
              { label: "Video", embed: productData.videoLink },
            ].map(({ label, embed }) => {
              const media = mediaUrl(embed);
              if (!media) return null;
              return (
                <section key={label} className={styles.section}>
                  <h2>{label}</h2>
                  {media.embedded ? (
                    <iframe className={styles.embed} src={media.url} title={label} loading="lazy" allowFullScreen />
                  ) : (
                    <a className={styles.textLink} href={media.url} target="_blank" rel="noreferrer">View {label.toLowerCase()}</a>
                  )}
                </section>
              );
            })}
          </article>

          <aside className={styles.sidebar} aria-label="Price and enquiry">
            <div className={styles.price}>
              <p>{priceLabel}</p>
              <strong>{displayPrice}</strong>
            </div>
            <section className={styles.enquiry} id="property-enquiry">
              <h2>Enquire about this property</h2>
              <ContactAgentFormDark listingAddress={address ?? ""} />
            </section>
            <button className={styles.share} type="button" onClick={shareProperty}>
              <HiOutlineShare aria-hidden="true" /> Share property
            </button>
            {shareStatus && <p className={styles.shareStatus} role="status">{shareStatus}</p>}
          </aside>
        </div>

        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          {UploadModalForm}
        </Modal>
        <Modal show={openModalSubmittion} onClose={() => setOpenModalSubmittion(false)}>
          <Modal.Header>Form submitted successfully</Modal.Header>
          <Modal.Body>Thank you for submitting your application.</Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default HotlistByIdView;
