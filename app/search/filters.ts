export const emptyFilters = {
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

export type PropertyFilters = typeof emptyFilters;

export function parseFilters(query: string | null) {
  if (!query) return emptyFilters;

  try {
    const parsed = JSON.parse(query);
    const filters = { ...emptyFilters };
    for (const key of Object.keys(filters) as (keyof typeof filters)[]) {
      const value = parsed?.[key];
      if (typeof value === "string" || typeof value === "number") {
        filters[key] = String(value).trim();
      }
    }
    return filters;
  } catch {
    return emptyFilters;
  }
}
