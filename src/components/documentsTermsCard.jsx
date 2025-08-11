import React from "react";

export default function DocumentTermsCard() {
  return (
    <div className="shadow-lg mt-6  rounded-xl p-8 flex flex-row gap-8 max-w-6xl mx-auto text-xs text-left text-black bg-white">
      {/* Left: Information */}
      <div className="flex-3/5 pr-10">
        <p className="mb-4 font-light">
          Based upon reading all available documentation (18 documents), emails
          (55), and MSAs (3) I’ve come up with a set of document terms to
          present to each vendor to reduce overall costs by 2.2% and only
          affecting 14.9% free cash flows by end of month.
        </p>
        <p className="mb-6 font-light">
          It involves taking advantage of the following information:
        </p>

        <div className="mb-6">
          <div className="font-bold mb-2">
            Current MSAs Accounting for previous invoice history
          </div>
          <div className="flex flex-col gap-1 font-light">
            <div className="flex gap-8">
              <span className="w-40">Inv-882991-max.pdf</span>
              <span className="w-40">Supplychain.co</span>
              <span>1.5% discount on Net 30 payment</span>
            </div>
            <div className="flex gap-8 font-light">
              <span className="w-40">Inv-882991-max.pdf</span>
              <span className="w-40">Masters and Sons</span>
              <span>3.1% discount on Net 15 payment terms</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="font-bold mb-2">
            Credit Facility via Vendor Connect
          </div>
          <div className="font-light">
            JP Morgan &nbsp; | &nbsp; 1.1% interest on $35,000 RLOC – 30 Days
          </div>
        </div>

        <div className="mb-8">
          <div className="font-bold mb-2">Potential Gains</div>
          <div className="flex flex-col gap-1 font-light">
            <div className="flex gap-8">
              <span className="w-72">
                Costs: 1.1% interest on $35,000 RLOC – 30 Days
              </span>
              <span>$385</span>
            </div>
            <div className="flex gap-8">
              <span className="w-72">
                Gains: 2.2% Margin Increase – Minus Interest
              </span>
              <span>$1,850</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-2/5 flex flex-col items-start justify-between ">
        {/* Right: Actions */}
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col gap-2 flex-1/2">
            {/* Card 1 */}
            <div className="border-[0.5px] border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col items-center p-4">
              <img
                src="https://placehold.co/240x160/e2e8f0/1e40af?text=Document"
                className="w-24 h-16 object-cover rounded mb-2"
                alt="Prepayment Letter"
              />
              <p className="w-full text-xs font-light  text-left">
                Prepayment Letter
              </p>
              <p className=" w-full font-light text-xs text-left text-blue-800">
                Email Masters and Sons
              </p>
            </div>
            {/* Card 2 */}
            <div className="border-[0.5px] border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col items-center p-4 mt-2">
              <img
                src="https://placehold.co/240x160/e2e8f0/1e40af?text=Access"
                className="w-24 h-16 object-cover rounded mb-2"
                alt="LOC Access"
              />
              <p className="w-full text-xs font-light text-left">LOC Access</p>
              <p className="w-full text-xs font-light text-left text-blue-800">
                Agent Sign
              </p>
            </div>
          </div>
          {/* Message */}
          <div className="h-full font-light mt-2 mb-2 text-left w-full">
            <p>
              Hey, John, we'd like to let you know that we will be pre-paying
              our order for invoice #582714684 for the amount of $23,000 and
              have included the discount into the line item B form as agreed
              upon in the MSA attached
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="flex flex-col items-end justify-between w-full">
          <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow">
            Execute Process
          </button>
        </div>
      </div>
    </div>
  );
}
