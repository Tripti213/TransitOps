export const getVehicles = async (filters: any) => {
  const query = new URLSearchParams({ ...filters, page: filters.page.toString() }).toString();
  const res = await fetch(`/api/vehicles?${query}`);
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
};