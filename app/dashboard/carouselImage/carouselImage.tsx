"use client";
import { Carousel } from "flowbite-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import BASE_URL from "../../urlConfig/urlConfig";
import SERVER_URL from "../../urlConfig/serverUrl";
import logoImage from "../../../public/logo.png"; // Import your logo image

interface ImageData {
  id: number;
  imagePath: string | null;
  imageName: string;
  caruoselTitle: string;
  caruoselDescription: string;
  caruoselLink: string;
  status: boolean; // Add status property
}

const CarouselImage = () => {
  const [carouselImageList, setCarouselImageList] = useState<ImageData[]>([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Caruosel/CaruoselList`);
      if (response.ok) {
        const data: ImageData[] = await response.json();
        const processedData = data.map((image) => ({
          ...image,
          imagePath: image.imagePath ? image.imagePath.replace(/~/g, "") : null,
        }));
        setCarouselImageList(processedData);
        setFetchError(false);
      } else {
        console.error("Failed to fetch data");
        setFetchError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setFetchError(true);
    }
  };

  return fetchError ? (
    <div className="text-red-500 mt-4 text-center">
      Failed to fetch carousel images. Please try again later.
    </div>
  ) : (
    <div className="h-[250px] sm:h-[600px] xl:h-[600px] 2xl:h-[600px] ">
      <Carousel slide={true}>
        {carouselImageList
          .filter((image) => image.status === true)
          .map((image, index) => (
            <div key={image.id} className="relative w-full h-full">
              {image.imagePath ? (
                <div className="relative w-full h-full">
                  <Image
                    src={`${SERVER_URL}${image.imagePath}`}
                    alt={`Image ${index}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={logoImage}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 flex flex-col justify-center items-start pl-4">
                <div className="bg-black bg-opacity-50 absolute inset-0 z-10"></div>
                <h2
                  className="text-white text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 relative z-20"
                  style={{ marginTop: "1rem" }}
                >
                  {image.caruoselTitle}
                </h2>
                <p
                  className="text-white text-base sm:text-sm md:text-base lg:text-lg mb-4 overflow-hidden relative z-20"
                  style={{ maxHeight: "3em" }}
                >
                  {image.caruoselDescription}
                </p>
                <a
                  style={{ backgroundColor: "#F27423" }}
                  href={image.caruoselLink}
                  className=" text-white py-2 px-4 rounded-lg hover:bg-amber-500 transition duration-300 relative z-20"
                >
                  Explore More
                </a>
              </div>
            </div>
          ))}
      </Carousel>
    </div>
  );
};

export default CarouselImage;
