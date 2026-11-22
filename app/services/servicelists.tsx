"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, BuildingOffice2Icon, HomeIcon, KeyIcon, TagIcon } from "@heroicons/react/24/outline";
import { Spinner } from "flowbite-react";
import Link from "next/link";
import BASE_URL from "../urlConfig/urlConfig";
import styles from "./serviceLists.module.css";

interface ServiceData {
  id: string;
  categoryTitle: string;
  status: boolean;
}

const services = {
  buy: { Icon: HomeIcon, description: "Find your next home" },
  rent: { Icon: KeyIcon, description: "Explore available rentals" },
  sale: { Icon: TagIcon, description: "Explore your selling options" },
  "house / land": { Icon: BuildingOffice2Icon, description: "Explore houses and land" },
};

export default function ServiceLists() {
  const [serviceList, setServiceList] = useState<ServiceData[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch(`${BASE_URL}/MenuCategory/CategoryList`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load services");
        const data: ServiceData[] = await response.json();
        setServiceList(data.filter((service) => service.status));
        setState("ready");
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }

    loadServices();
    return () => controller.abort();
  }, []);

  return (
    <div className={styles.services}>
      <h2>Our Services</h2>
      <p className={styles.subtitle}>Explore our real estate services</p>
      {state === "error" && <p role="status">Couldn’t load services. Please try again later.</p>}
      {state === "loading" && <div className={styles.loading}><Spinner aria-label="Loading services" size="lg" /></div>}
      {state === "ready" && !serviceList.length && <p role="status">No services available.</p>}
      {state === "ready" && (
        <div className={styles.grid}>
          {serviceList.map(({ id, categoryTitle }) => {
            const service = services[categoryTitle.trim().toLowerCase() as keyof typeof services];
            const Icon = service?.Icon ?? HomeIcon;
            return (
              <Link key={id} className={styles.card} href={`/services/serviceWiseProduct/${encodeURIComponent(categoryTitle)}/${id}`}>
                <span className={styles.icon}><Icon aria-hidden="true" /></span>
                <h3>{categoryTitle}</h3>
                {service && <p>{service.description}</p>}
                <span className={styles.action}>Learn more <ArrowRightIcon aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
