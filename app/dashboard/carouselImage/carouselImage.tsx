"use client";

import { Carousel } from "flowbite-react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Image from "next/image";
import BASE_URL from "../../urlConfig/urlConfig";
import SERVER_URL from "../../urlConfig/serverUrl";
import fallback from "./featured-home.webp";
import styles from "../home.module.css";

interface ImageData {
  id: string;
  imagePath: string | null;
  imageName: string;
  caruoselTitle: string;
  caruoselDescription: string;
  caruoselLink: string;
  status: boolean;
}

export default function CarouselImage() {
  const [slides, setSlides] = useState<ImageData[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSlides() {
      try {
        const response = await fetch(`${BASE_URL}/Caruosel/CaruoselList`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data: ImageData[] = await response.json();
        const active = data.filter((slide) => slide.status && slide.imagePath?.trim());
        // Show property photography before promotional banners.
        setSlides([
          ...active.filter((slide) => slide.caruoselTitle?.trim()),
          ...active.filter((slide) => !slide.caruoselTitle?.trim()),
        ]);
      } catch {
        // Keep the bundled photo visible when featured images are unavailable.
      }
    }

    loadSlides();
    return () => controller.abort();
  }, []);

  if (!slides.length) {
    return <Image src={fallback} alt="" fill unoptimized sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />;
  }

  const images = slides.map((slide) => (
    <div key={slide.id} className={styles.slide}>
      <Image
        src={`${SERVER_URL}${slide.imagePath?.replace(/~/g, "")}`}
        alt={slide.caruoselDescription || slide.caruoselTitle || "Mero Real Estate featured image"}
        fill
        sizes="(min-width: 768px) 40vw, 100vw"
        className={slide.caruoselTitle?.trim() ? "object-cover" : "object-contain"}
        unoptimized
      />
      {slide.caruoselLink && (
        <a className={styles.slideLink} href={slide.caruoselLink}>
          {slide.caruoselDescription || slide.caruoselTitle || "See featured listing"} <ArrowUpRightIcon aria-hidden="true" className="inline h-3.5 w-3.5 align-middle" />
        </a>
      )}
    </div>
  ));

  return images.length === 1 ? images[0] : <Carousel slide={false}>{images}</Carousel>;
}
