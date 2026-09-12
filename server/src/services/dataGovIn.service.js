import axios from "axios";

const BASE_URL = "https://api.data.gov.in/resource";

export async function fetchAgmarknetPrices({ commodity, state, limit = 100 }) {
  const resourceId = process.env.DATA_GOV_IN_RESOURCE_ID;
  const { data } = await axios.get(`${BASE_URL}/${resourceId}`, {
    params: {
      "api-key": process.env.DATA_GOV_IN_API_KEY,
      format: "json",
      limit,
      ...(commodity && { "filters[commodity]": commodity }),
      ...(state && { "filters[state]": state }),
    },
  });
  return data.records || [];
}