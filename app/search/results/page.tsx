"use client";

import { useEffect, useState } from "react";
import { Pagination, Spinner } from "flowbite-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PropertyCard, { type Listing } from "@/app/product/propertyCard";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { parseFilters, type PropertyFilters } from "../filters";
import Search from "../search";
import styles from "./results.module.css";

interface SearchListing extends Listing {
  deleted?: boolean;
  categoryId: string;
  subCategoryId: string;
  area: number;
}

type ResultsState =
  | { status: "loading" | "error" }
  | { status: "ready"; listings: SearchListing[] };

const pageSize = 12;

export default function SearchResultsPage() {
  const query = useSearchParams().get("filters");
  const filters = parseFilters(query);
  const isFiltered = Object.values(filters).some(Boolean);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Properties</span>
        </nav>
        <header className={styles.hero}>
          <h1>{isFiltered ? "Filter results" : "All properties"}</h1>
        </header>
        <Search />
        <Results filters={filters} isFiltered={isFiltered} />
      </div>
    </div>
  );
}

function matchesFilters(listing: SearchListing, filters: PropertyFilters) {
  return (!filters.CategoryId || listing.categoryId === filters.CategoryId)
    && (!filters.SubCategoryId || listing.subCategoryId === filters.SubCategoryId)
    && (!filters.RoomCount || listing.roomCount === Number(filters.RoomCount))
    && (!filters.BathRoomCount || listing.bathRoomCount === Number(filters.BathRoomCount))
    && (!filters.ParkingCount || listing.parkingCount === Number(filters.ParkingCount))
    && (!filters.MinPrice || (listing.price > 0 && listing.price >= Number(filters.MinPrice)))
    && (!filters.MaxPrice || (listing.price > 0 && listing.price <= Number(filters.MaxPrice)))
    && (!filters.MinArea || listing.area >= Number(filters.MinArea))
    && (!filters.MaxArea || listing.area <= Number(filters.MaxArea));
}

function Results({ filters, isFiltered }: { filters: PropertyFilters; isFiltered: boolean }) {
  const [state, setState] = useState<ResultsState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadListings() {
      try {
        const response = await fetch(`${BASE_URL}/Product/ProductList`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load properties");
        const listings: SearchListing[] = await response.json();
        setState({ status: "ready", listings: listings.filter((listing) => listing.status && !listing.deleted) });
      } catch {
        if (!controller.signal.aborted) setState({ status: "error" });
      }
    }

    void loadListings();
    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return <div className={styles.message}><Spinner aria-label="Loading properties" size="lg" /></div>;
  }
  if (state.status === "error") {
    return <p className={styles.message} role="status">Couldn’t load properties. Please try again later.</p>;
  }
  if (state.status !== "ready") return null;

  const listings = isFiltered ? state.listings.filter((listing) => matchesFilters(listing, filters)) : state.listings;
  return <ListingResults key={JSON.stringify(filters)} listings={listings} isFiltered={isFiltered} />;
}

function ListingResults({ listings, isFiltered }: { listings: SearchListing[]; isFiltered: boolean }) {
  const [page, setPage] = useState(1);
  const total = listings.length;
  const pageCount = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;

  return (
    <section className={styles.results} aria-label="Property listings">
      {isFiltered && <Link href="/search/results" className={styles.clear}>Clear filters</Link>}
      <p className={styles.count} role="status">
        {total > 0 && `Showing ${offset + 1}–${Math.min(offset + pageSize, total)} of `}
        {total} {total === 1 ? "property" : "properties"}
      </p>
      {total > 0 ? (
        <div className={styles.grid}>
          {listings.slice(offset, offset + pageSize).map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
        </div>
      ) : (
        <p className={styles.message}>{isFiltered ? "No properties match these filters." : "No properties are available right now."}</p>
      )}
      {pageCount > 1 && (
        <div className={styles.pagination}>
          <Pagination aria-label="Property pages" currentPage={page} totalPages={pageCount} onPageChange={setPage} />
        </div>
      )}
    </section>
  );
}
