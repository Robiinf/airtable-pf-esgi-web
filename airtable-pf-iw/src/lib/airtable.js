// src/lib/airtable.js
import axios from "axios";

const baseID = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

export const airtableApi = axios.create({
  baseURL: `https://api.airtable.com/v0/${baseID}`,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});
