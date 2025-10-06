'use server'
import fs from "fs";
import path from "path";
import csv from "csv-parser";

// import { createClient } from '@/utils/supabase/server'
// import { cookies } from 'next/headers'
//
// export async function getVendors() {
//     const cookiesStore = await cookies();
//     const supabase = createClient(cookiesStore);
//     const { data: vendors } = await supabase
//         .from('vendors')
//         .select('*');
//     return vendors;
// }
export async function getVendors() {
  const results = [];
  const filePath = path.join(process.cwd(), "src", "assets", "Data", "vendorsData.csv");

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  return results.map((vendor) => ({
    id: vendor["Record ID"] || "",
    name: vendor["Record"] || "",
    state: vendor["Location > State"] || "",
    website: vendor["Website"] || "",
    categories: vendor["Categories"] || "",
    ...vendor
  }));
}

export async function getVendor(id) {
  const vendors = await getVendors();
  return vendors.find((vendor) => vendor.id === id);
}

export async function getDataForVendorDetails(id) {
  const vendors = await getVendors();
  const totalVendors = vendors.length;
  const vendorIndex = vendors.findIndex((vendor) => vendor.id === id);
  const previousVendor = vendors[(vendorIndex - 1 + totalVendors) % totalVendors];
  const nextVendor = vendors[(vendorIndex + 1) % totalVendors];
  const vendor = vendors.find((vendor) => vendor.id === id);
  return { vendor, previousVendor, nextVendor, vendorIndex, totalVendors };
}