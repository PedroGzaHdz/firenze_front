import { getDataForVendorDetails } from '@/actions/getVendors.js';
import { VendorDetails } from '@/components/vendors/vendorDetails.js';


export default async function VendorPage({ params }) {
  const { id } = await params
  const {vendor, vendorIndex, totalVendors, nextVendor, previousVendor} = await getDataForVendorDetails(id);
  console.log(vendor);
  console.log(totalVendors);
  console.log(vendorIndex);
  return <VendorDetails vendor={vendor} totalRecords={totalVendors} currentIndex={vendorIndex} nextVendorID={nextVendor?.id} previousVendorID={previousVendor?.id} />
}