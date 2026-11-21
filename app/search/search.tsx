"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BASE_URL from "../urlConfig/urlConfig";
import styles from "./search.module.css";

interface Category {
  id: string;
  categoryTitle: string;
  status: boolean;
}

interface Subcategory {
  id: string;
  categoryID: string;
  subCategoryTitle: string;
  status: boolean;
}

const initialFilters = {
  CategoryId: "",
  SubCategoryId: "",
  MinPrice: "",
  MaxPrice: "",
  RoomCount: "",
  BathRoomCount: "",
  ParkingCount: "",
  MinArea: "",
  MaxArea: "",
};

const moreFilters = [
  ["RoomCount", "Bedrooms"],
  ["BathRoomCount", "Bathrooms"],
  ["ParkingCount", "Car spaces"],
  ["MinArea", "Min area"],
  ["MaxArea", "Max area"],
] as const;

export default function Search() {
  const router = useRouter();
  const query = useSearchParams().get("filters");
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [hasError, setHasError] = useState(false);
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    try {
      const parsed = query ? JSON.parse(query) : {};
      const restored = { ...initialFilters };
      for (const key of Object.keys(restored) as (keyof typeof restored)[]) {
        const value = parsed?.[key];
        if (typeof value === "string" || typeof value === "number") {
          restored[key] = String(value);
        }
      }
      setFilters(restored);
      if (details.current && moreFilters.some(([key]) => restored[key] !== "")) {
        details.current.open = true;
      }
    } catch {
      setFilters(initialFilters);
    }
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOptions<T>(path: string, setOptions: (options: T[]) => void) {
      try {
        const response = await fetch(`${BASE_URL}/${path}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load filter options");
        setOptions(await response.json());
      } catch {
        if (!controller.signal.aborted) setHasError(true);
      }
    }

    loadOptions("MenuCategory/CategoryList", setCategories);
    loadOptions("MenuSubCategory/SubCategoryList", setSubcategories);
    return () => controller.abort();
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ filters: JSON.stringify(filters) });
    router.push(`/search/results?${params}`);
  }

  function numberInput(field: keyof typeof filters, label: string) {
    return (
      <input
        aria-label={label}
        type="number"
        min="0"
        step={field.endsWith("Area") ? "any" : "1"}
        placeholder={label}
        value={filters[field]}
        onChange={(event) => setFilters({ ...filters, [field]: event.target.value })}
      />
    );
  }

  return (
    <form className={styles.panel} onSubmit={submit} aria-label="Property search">
      <div className={styles.primary}>
        <label>
          Category
          <select
            value={filters.CategoryId}
            onChange={(event) => setFilters({ ...filters, CategoryId: event.target.value, SubCategoryId: "" })}
          >
            <option value="">Any category</option>
            {categories.filter((category) => category.status).map((category) => (
              <option key={category.id} value={category.id}>{category.categoryTitle}</option>
            ))}
          </select>
        </label>
        <label>
          Property
          <select
            value={filters.SubCategoryId}
            disabled={!filters.CategoryId}
            onChange={(event) => setFilters({ ...filters, SubCategoryId: event.target.value })}
          >
            <option value="">Any property type</option>
            {subcategories.filter((item) => item.status && String(item.categoryID) === filters.CategoryId).map((item) => (
              <option key={item.id} value={item.id}>{item.subCategoryTitle}</option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Price range</legend>
          <div className={styles.price}>
            {numberInput("MinPrice", "Min price")}
            {numberInput("MaxPrice", "Max price")}
          </div>
        </fieldset>
        <button type="submit"><MagnifyingGlassIcon aria-hidden="true" /> Search</button>
      </div>
      <details ref={details}>
        <summary>More filters</summary>
        <div className={styles.extra}>
          {moreFilters.map(([key, label]) => <div key={key}>{numberInput(key, label)}</div>)}
        </div>
      </details>
      {hasError && <p role="status">Some search options are temporarily unavailable.</p>}
    </form>
  );
}
