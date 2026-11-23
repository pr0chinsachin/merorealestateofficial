"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Pagination, Spinner } from "flowbite-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BASE_URL from "../urlConfig/urlConfig";
import PropertyCard, { type Listing } from "./propertyCard";
import styles from "./listing.module.css";

const availableTabs = ["Buy", "Rent"] as const;
const completedTabs = ["Sold", "Leased"] as const;
const pageSize = 8;

let pendingListings: Promise<Listing[]> | undefined;

function fetchListings() {
  pendingListings ??= fetch(`${BASE_URL}/Product/ProductList`, {
    signal: AbortSignal.timeout(20000),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("Unable to load listings");
      const data: Listing[] = await response.json();
      return data.filter((listing) => listing.status);
    })
    .finally(() => { pendingListings = undefined; });

  return pendingListings;
}

export default function Listings({ available = false }: { available?: boolean }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<string | null>(available ? null : "Sold");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const tabs = available ? availableTabs : completedTabs;
  const title = available ? "Buy and Rent" : "Sold and Leased";

  useEffect(() => {
    let mounted = true;

    fetchListings()
      .then((data) => {
        if (!mounted) return;
        setListings(data);
        setState("ready");
      })
      .catch(() => {
        if (mounted) setState("error");
      });

    return () => { mounted = false; };
  }, []);

  const term = query.trim().toLowerCase();
  const filtered = listings.filter((listing) => {
    const status = listing.propertyStatusValue;
    const group = status === "UnderManagement" ? "Leased" : status;
    const matchesStatus = selected ? selected === group : tabs.some((tab) => tab === group);
    const matchesQuery = listing.productName.toLowerCase().includes(term) ||
      (available && (status.toLowerCase().includes(term) || String(listing.price).includes(term)));
    return matchesStatus && matchesQuery;
  });

  if (available && selected === null) {
    filtered.sort((a, b) => Number(a.propertyStatusValue === "Rent") - Number(b.propertyStatusValue === "Rent"));
  }
  if (!available) {
    filtered.sort((a, b) => Date.parse(b.updatedDate) - Date.parse(a.updatedDate));
  }

  return (
    <div className={`${styles.listings} ${available ? styles.available : styles.completed}`}>
      <div className={styles.heading}>
        <div>
          <h2>{title}</h2>
          <p>{available ? "Discover properties for sale and rent" : "Explore our sold and leased properties"}</p>
        </div>
        {available && (
          <Link href="/search/results" className={styles.more}>
            View all properties <ArrowRightIcon aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="group" aria-label="Property status">
          {available && (
            <button type="button" aria-pressed={selected === null} onClick={() => setSelected(null)}>All</button>
          )}
          {tabs.map((tab) => (
            <button key={tab} type="button" aria-pressed={selected === tab} onClick={() => { setSelected(tab); setPage(1); }}>
              {tab}
            </button>
          ))}
        </div>
        <input
          className={styles.search}
          type="search"
          aria-label={`Search ${title.toLowerCase()} properties`}
          placeholder="Search properties"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setPage(1); }}
        />
      </div>

      {state === "loading" && <div className={styles.message}><Spinner size="lg" aria-label="Loading properties" /></div>}
      {state === "error" && <p className={styles.message} role="status">Couldn’t load properties. Please try again later.</p>}
      {state === "ready" && !filtered.length && <p className={styles.message} role="status">No matching properties.</p>}
      {state === "ready" && filtered.length > 0 && (
        available ? (
          <div className={styles.carousel}>
            <Slider
              key={`${selected}-${term}`}
              dots
              infinite={false}
              slidesToShow={Math.min(4, filtered.length)}
              slidesToScroll={Math.min(4, filtered.length)}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: Math.min(3, filtered.length), slidesToScroll: Math.min(3, filtered.length) } },
                { breakpoint: 800, settings: { slidesToShow: Math.min(2, filtered.length), slidesToScroll: Math.min(2, filtered.length), dots: false } },
                { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, dots: false } },
              ]}
            >
              {filtered.map((listing) => (
                <div key={listing.id} className={styles.slide}><PropertyCard listing={listing} /></div>
              ))}
            </Slider>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {filtered.slice((page - 1) * pageSize, page * pageSize).map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
            </div>
            {filtered.length > pageSize && (
              <div className={styles.pagination}>
                <Pagination currentPage={page} totalPages={Math.ceil(filtered.length / pageSize)} onPageChange={setPage} />
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
