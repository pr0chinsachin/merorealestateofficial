"use client";
import { Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import Styles from "./search.module.css";
import { useRouter } from "next/navigation";
import BASE_URL from "../urlConfig/urlConfig";

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

const Search = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<subCategory[]>([]);
  const [loading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
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

  const handleApplyFilters = () => {
    // Serialize the filters object into a JSON string
    const query = new URLSearchParams({
      filters: JSON.stringify(filters),
    }).toString();

    // Use router.push to navigate to the search results page
    router.push(`/search/results?${query}`);
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/MenuCategory/CategoryList`);
      if (response.ok) {
        const data: Category[] = await response.json();
        console.log("Fetched category data:", data);
        const processedData = data.map((service) => ({
          ...service,
          thumbnailImagePath: service.thumbnailImagePath
            ? service.thumbnailImagePath.replace(/~/g, "")
            : null,
        }));
        console.log("Processed data:", processedData);
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
      const response = await fetch(
        `${BASE_URL}/MenuSubCategory/SubCategoryList`
      );
      if (response.ok) {
        const data: subCategory[] = await response.json();
        console.log("Fetched category data:", data);
        const processedData = data.map((service) => ({
          ...service,
          thumbnailImagePath: service.thumbnailImagePath
            ? service.thumbnailImagePath.replace(/~/g, "")
            : null,
        }));
        console.log("Processed data:", processedData);
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
    <div className="flex justify-center mx-auto">
      <div id={Styles.desktopView}>
        <div className={Styles.fixedFormContainer}>
          <form className="mx-auto p-4   shadow-md rounded-lg">
            <div className="flex gap-9 items-center">
              <div>
                <div className="font-semibold">Features</div>
                <select
                  id="propertyType"
                  value={selectedCategory}
                  onChange={(e) => {
                    updateFilters("CategoryId", e.target.value);
                    setSelectedCategory(e.target.value);
                  }}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  {category.map((data) => {
                    return (
                      <option value={data.id}>{data.categoryTitle}</option>
                    );
                  })}
                </select>
              </div>
              <div>
                <div className="font-semibold">Features</div>
                <select
                  id="propertyType"
                  value={selectedSubCategory}
                  onChange={(e) => {
                    updateFilters("SubCategoryId", e.target.value);
                    setSelectedSubCategory(e.target.value);
                  }}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  {subCategory.map((data) => {
                    return (
                      <option value={data.id}>{data.subCategoryTitle}</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <div className="font-semibold">Features</div>

                <div className="flex gap-2 w-max ">
                  <input
                    type="number"
                    id="car-park"
                    className="w-24 py-2 px-1 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bathroom"
                    required
                    onChange={(e) => {
                      updateFilters("BathRoomCount", e.target.value);
                    }}
                  />
                  <input
                    type="number"
                    id="car-park"
                    className="w-20 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bedroom"
                    required
                    onChange={(e) => {
                      updateFilters("RoomCount", e.target.value);
                    }}
                  />
                  <input
                    type="number"
                    id="car-park"
                    className="w-24 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Car Park"
                    required
                    onChange={(e) => {
                      updateFilters("ParkingCount", e.target.value);
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
                    onChange={(e) => {
                      updateFilters("MinPrice", e.target.value);
                    }}
                  />
                  <input
                    type="number"
                    id="car-park"
                    className="w-28 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Max Price"
                    required
                    onChange={(e) => {
                      updateFilters("MaxPrice", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="font-semibold">Area</div>
                <div className="flex gap-2 w-max ">
                  <input
                    type="number"
                    id="car-park"
                    className="w-28 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Min Area"
                    required
                    onChange={(e) => {
                      updateFilters("MinArea", e.target.value);
                    }}
                  />
                  <input
                    type="number"
                    id="car-park"
                    className="w-28 p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Max Area"
                    required
                    onChange={(e) => {
                      updateFilters("MaxArea", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div>
                <Button
                  style={{ backgroundColor: "#14222d" }}
                  className="w-full md:w-auto flex items-center"
                  onClick={handleApplyFilters}
                >
                  <BiSearchAlt className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div id={Styles.mobileView} className="mt-6 md:mt-0 w-full mx-4">
        <div
          className="flex justify-center items-center mb-4 cursor-pointer text-white rounded-lg  py-4 "
          onClick={toggleFormVisibility}
          style={{ backgroundColor: "#f27423" }}
        >
          <BiSearchAlt className="" />
          <span className="ml-2   ">Search</span>
        </div>

        {isFormVisible && (
          <form className="mx-auto px-4 py-6 bg-white shadow-md rounded-lg">
            <div className="space-y-4">
              <div>
                <select
                  id="propertyType"
                  value={selected}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose Property</option>
                  <option value="R">Rent</option>
                  <option value="P">Property</option>
                  <option value="H">House Buy</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  id="bathroom"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bathroom"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="bed"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bed"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="car-park"
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Car Park"
                  required
                />
              </div>
              <div>
                <select
                  id="range"
                  value={selected}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose Price Range</option>
                  <option value="US">$1000 - $2000</option>
                  <option value="CA">$2001 - $10000</option>
                  <option value="FR">$10001 - $100000</option>
                  <option value="DE">$100001 - $100000</option>
                </select>
              </div>
              <div className="flex justify-center">
                <Button className="bg-cyan-950 w-full md:w-auto flex items-center">
                  <BiSearchAlt className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Search;
