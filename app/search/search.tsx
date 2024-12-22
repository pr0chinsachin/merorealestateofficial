"use client";
import React, { Suspense, useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { BiSearchAlt } from "react-icons/bi";
import Styles from "./search.module.css";
import { useRouter } from "next/navigation";
import BASE_URL from "../urlConfig/urlConfig";
import { useSearchParams } from "next/navigation";

interface Category {
  id: string;
  categoryCode: string;
  categoryTitle: string;
  thumbnailImagePath: string | null;
  status: boolean;
  deleted: boolean;
}

interface subCategory {
  id: string;
  categoryTitle: string;
  thumbnailImagePath: string | null;
  status: boolean;
  deleted: boolean;
  categoryID: string;
  subCategoryTitle: string;
  subCategoryCode: string;
}

interface FiltersType {
  BathRoomCount: string;
  MaxPrice: string;
  MaxArea: string;
  RoomCount: string;
  ParkingCount: string;
  MinPrice: string;
  MinArea: string;
  SubCategoryId: string;
  CategoryId: string;
}

const Search = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<subCategory[]>([]);
  const [loading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FiltersType>({
    BathRoomCount: "",
    MaxPrice: "",
    MaxArea: "",
    RoomCount: "",
    ParkingCount: "",
    MinPrice: "",
    MinArea: "",
    SubCategoryId: "",
    CategoryId: "",
  });

  const [filtersFromSearch, setFiltersFromSearch] = useState<FiltersType>({
    BathRoomCount: "",
    MaxPrice: "",
    MaxArea: "",
    RoomCount: "",
    ParkingCount: "",
    MinPrice: "",
    MinArea: "",
    SubCategoryId: "",
    CategoryId: "",
  });

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const filtersFromParams = searchParams.get("filters");

    if (filtersFromParams) {
      try {
        const parsedFilters = JSON.parse(filtersFromParams) as Partial<FiltersType>;
        setFiltersFromSearch((prevFilters) => ({
          ...prevFilters,
          ...parsedFilters,
        }));
      } catch (error) {
        console.error("Invalid filters JSON", error);
      }
    }
  }, [searchParams]);

  const handleApplyFilters = () => {
    const query = new URLSearchParams({
      filters: JSON.stringify(filters),
    }).toString();

    router.push(`/search/results?${query}`);
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/MenuCategory/CategoryList`);
      if (response.ok) {
        const data: Category[] = await response.json();
        const processedData = data.map((service) => ({
          ...service,
          thumbnailImagePath: service.thumbnailImagePath ? service.thumbnailImagePath.replace(/~/g, "") : null,
        }));
        setCategory(processedData);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch data");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/MenuSubCategory/SubCategoryList`);
      if (response.ok) {
        const data: subCategory[] = await response.json();
        const processedData = data.map((service) => ({
          ...service,
          thumbnailImagePath: service.thumbnailImagePath ? service.thumbnailImagePath.replace(/~/g, "") : null,
        }));
        setSubCategory(processedData);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch data");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchSubCategory();
  }, []);

  const updateFilters = (field: string, value: string) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
  };

  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <div className="flex justify-center mx-auto">
        <div id={Styles.desktopView}>
          <div className={Styles.fixedFormContainer}>
            <form className="mx-auto p-4 shadow-md rounded-lg">
              <div className="flex gap-9 items-center">
                <div>
                  <div className="font-semibold">Category</div>
                  <select
                    id="propertyType"
                    value={filtersFromSearch.CategoryId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFiltersFromSearch((prevFilters) => ({
                        ...prevFilters,
                        CategoryId: value,
                      }));
                      updateFilters("CategoryId", value);
                      setSelectedCategory(value);
                    }}
                    className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {category.map((data) =>
                      data.status === true ? (
                        <option key={data.id} value={data.id}>
                          {data.categoryTitle}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
                <div>
                  <div className="font-semibold">Property</div>
                  <select
                    id="propertyType"
                    value={filtersFromSearch.SubCategoryId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFiltersFromSearch((prevFilters) => ({
                        ...prevFilters,
                        SubCategoryId: value,
                      }));
                      updateFilters("SubCategoryId", value);
                      setSelectedSubCategory(value);
                    }}
                    className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {subCategory.map(
                      (data) =>
                        data.status && (
                          <option key={data.id} value={data.id}>
                            {data.subCategoryTitle}
                          </option>
                        )
                    )}
                  </select>
                </div>

                <div>
                  <div className="font-semibold">Number</div>

                  <div className="flex gap-2 w-max ">
                    <input
                      type="number"
                      id="car-park"
                      className="w-24 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bedroom"
                      required
                      value={filtersFromSearch.RoomCount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFiltersFromSearch((prevFilters) => ({
                          ...prevFilters,
                          RoomCount: value,
                        }));
                        updateFilters("RoomCount", value);
                      }}
                    />
                    <input
                      type="number"
                      id="car-park"
                      className="w-24 py-2 px-1 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bathroom"
                      required
                      value={filtersFromSearch.BathRoomCount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFiltersFromSearch((prevFilters) => ({
                          ...prevFilters,
                          BathRoomCount: value,
                        }));
                        updateFilters("BathRoomCount", value);
                      }}
                    />

                    <input
                      type="number"
                      id="car-park"
                      className="w-24 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Car Park"
                      required
                      value={filtersFromSearch.ParkingCount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFiltersFromSearch((prevFilters) => ({
                          ...prevFilters,
                          ParkingCount: value,
                        }));
                        updateFilters("ParkingCount", value);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="font-semibold">Price</div>
                  <div className="flex gap-2 w-max ">
                    <input
                      type="number"
                      id="car-park"
                      className="w-28 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Min Price"
                      required
                      value={filtersFromSearch.MinPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFiltersFromSearch((prevFilters) => ({
                          ...prevFilters,
                          MinPrice: value,
                        }));
                        updateFilters("MinPrice", value);
                      }}
                    />
                    <input
                      type="number"
                      id="car-park"
                      className="w-28 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Max Price"
                      required
                      value={filtersFromSearch.MaxPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFiltersFromSearch((prevFilters) => ({
                          ...prevFilters,
                          MaxPrice: value,
                        }));
                        updateFilters("MaxPrice", value);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <Button onClick={toggleFormVisibility}>Filter</Button>
          {isFormVisible && (
            <form className="p-4 shadow-md rounded-lg">
              <div className="flex gap-9 items-center">
                <div>
                  <div className="font-semibold">Category</div>
                  <select
                    value={filtersFromSearch.CategoryId}
                    onChange={(e) => updateFilters("CategoryId", e.target.value)}
                    className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {category.map((data) =>
                      data.status === true ? (
                        <option key={data.id} value={data.id}>
                          {data.categoryTitle}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
                <div>
                  <div className="font-semibold">Property</div>
                  <select
                    value={filtersFromSearch.SubCategoryId}
                    onChange={(e) => updateFilters("SubCategoryId", e.target.value)}
                    className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {subCategory.map((data) =>
                      data.status === true ? (
                        <option key={data.id} value={data.id}>
                          {data.subCategoryTitle}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default Search;
