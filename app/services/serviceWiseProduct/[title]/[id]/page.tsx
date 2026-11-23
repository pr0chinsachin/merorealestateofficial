"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Pagination, Spinner } from "flowbite-react";
import Link from "next/link";
import DarkFormSale from "@/app/contactAgentForm/darkFormSale";
import PropertyCard, { type Listing } from "@/app/product/propertyCard";
import BASE_URL from "@/app/urlConfig/urlConfig";
import styles from "./category.module.css";

interface ServiceProduct extends Listing {
  address?: string | null;
  details?: string | null;
  deleted?: boolean;
}

const perPage = 8;
const buyingOptions = [
  { label: "All properties", value: "all" },
  { label: "Houses", value: "0" },
  { label: "House & land", value: "1" },
];

export default function ServiceWiseProduct({ params }: { params: { id: string; title: string } }) {
  let title = params.title;
  try {
    title = decodeURIComponent(title);
  } catch {
    // A title containing a literal percent sign is already decoded.
  }
  return <ServiceCategory key={params.id} id={params.id} title={title} />;
}

function ServiceCategory({ id, title }: { id: string; title: string }) {
  const category = title.toLowerCase();
  const sale = category === "sale";
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [buyingOption, setBuyingOption] = useState("all");

  useEffect(() => {
    if (sale) return;
    const controller = new AbortController();

    async function loadProperties() {
      try {
        const params = new URLSearchParams({ id });
        const response = await fetch(`${BASE_URL}/Product/ProductListWithCategoryID?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load properties");
        const data: ServiceProduct[] = await response.json();
        setProducts(data.filter((property) => property.status && !property.deleted));
        setState("ready");
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }

    void loadProperties();
    return () => controller.abort();
  }, [id, sale]);

  const term = query.trim().toLowerCase();
  const filtered = products.filter((property) => {
    if (category === "buy" && buyingOption !== "all" && property.details !== buyingOption) return false;
    if (category === "rent" && !["Rent", "Rented", "UnderManagement"].includes(property.propertyStatusValue)) return false;
    const price = property.price > 0 ? String(property.price) : "contact for price contact agent";
    const priceTerm = term.replace(/[$,\s]/g, "");
    return property.productName.toLowerCase().includes(term)
      || property.address?.toLowerCase().includes(term)
      || price.includes(term)
      || (priceTerm !== "" && price.includes(priceTerm));
  });
  const pageCount = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const heading = sale ? "Sell with us" : title;
  const subtitles: Record<string, string> = {
    buy: "Explore properties for sale.",
    rent: "Browse rental properties.",
    sale: "Request an appraisal for your property.",
    "house / land": "Explore houses and land.",
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/services">Services</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>

        <header className={styles.hero}>
          <h1>{heading}</h1>
          {subtitles[category] && <p>{subtitles[category]}</p>}
        </header>

        {sale ? (
          <div className={styles.appraisal}><DarkFormSale /></div>
        ) : (
          <>
            <div className={styles.toolbar}>
              {category === "buy" && (
                <div className={styles.filters} role="group" aria-label="Property type">
                  {buyingOptions.map(({ label, value }) => (
                    <button key={value} type="button" aria-pressed={buyingOption === value}
                      onClick={() => { setBuyingOption(value); setCurrentPage(1); }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.search}>
                <MagnifyingGlassIcon aria-hidden="true" />
                <input type="search" aria-label="Search by location or price" placeholder="Search by location or price"
                  value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} />
                {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setCurrentPage(1); }}>×</button>}
              </div>
            </div>

            {state === "loading" && <div className={styles.message}><Spinner aria-label="Loading properties" size="lg" /></div>}
            {state === "error" && <p className={styles.message} role="status">Couldn’t load properties. Please try again later.</p>}
            {state === "ready" && (
              <>
                <p className={styles.count} role="status">{filtered.length} {filtered.length === 1 ? "property" : "properties"}{term ? ` matching “${query.trim()}”` : ""}</p>
                {pageItems.length ? (
                  <div className={styles.grid}>
                    {pageItems.map((listing) => <PropertyCard key={listing.id} listing={listing} searchTerm={query} showStartingPrice />)}
                  </div>
                ) : (
                  <p className={styles.message}>{category === "build" && !term ? "Coming soon." : "No properties found."}</p>
                )}
                {pageCount > 1 && (
                  <div className={styles.pagination}>
                    <Pagination className="brand-pagination" currentPage={currentPage} totalPages={pageCount} onPageChange={setCurrentPage} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
