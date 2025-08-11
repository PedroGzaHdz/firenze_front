import React, { useState } from "react";
import {
  BookOpenIcon,
  CubeIcon,
  PlusIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  CloudArrowDownIcon,
  Square3Stack3DIcon,
  ArrowUturnUpIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import { SiGmail, SiDropbox } from "react-icons/si";

const Sidebar = ({ setFlowStep, flowStep, children }) => {
  const [activeItem, setActiveItem] = useState(0);
  const [showInformationalView, setShowInformationalView] = useState(false);
  const [recentViews, setRecentViews] = useState(false);

  const [invoices] = useState([
    {
      id: 1,
      provider: "Provider A",
      amount: "$1,200.00",
      nameFile: "invoice_A.pdf",
    },
    {
      id: 2,
      provider: "Provider B",
      amount: "$850.00",
      nameFile: "invoice_B.pdf",
    },
    {
      id: 3,
      provider: "Provider C",
      amount: "$2,450.00",
      nameFile: "invoice_C.pdf",
    },
    {
      id: 4,
      provider: "Provider D",
      amount: "$3,300.00",
      nameFile: "invoice_D.pdf",
    },
    {
      id: 5,
      provider: "Provider E",
      amount: "$1,750.00",
      nameFile: "invoice_E.pdf",
    },
  ]);

  const handleItemClick = (index) => {
    setActiveItem(index);
    // Mostrar el panel informacional cuando se hace clic en el primer item (BookOpenIcon)
    setShowInformationalView(index === 1);
  };
  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header superior que abarca todo el ancho */}
      <div className="w-full bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between px-6 py-2">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Squares2X2Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Barra de búsqueda alineada a la izquierda */}
        <div className="mx-10 flex-1 w-full">
          <div className="relative my-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search SKUs, Contracts, Vendors"
              className="block w-1/3 pl-10 pr-3 py-2.5 border border-slate-600/50 rounded-xl bg-white text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Avatar y elementos del usuario */}
        <div className="flex items-center gap-2">
          {/*<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">*/}
          {/*  ?*/}
          {/*</div>*/}
          {/*<div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">*/}
          {/*  G*/}
          {/*</div>*/}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex">
        {/* Sidebar lateral - solo 2 iconos */}
        <div className="bg-slate-900/50 border-r border-slate-700/50 flex flex-col">
          <div className="w-20 p-4">
            <nav className="space-y-2">
              <SidebarItem
                icon={<Square3Stack3DIcon className="w-5 h-5" />}
                active={activeItem === 0}
                onClick={() => handleItemClick(0)}
              />
              <SidebarItem
                icon={<CubeIcon className="w-5 h-5" />}
                active={activeItem === 1}
                onClick={() => handleItemClick(1)}
              />
              <SidebarItem
                icon={<ArrowUturnUpIcon className="w-5 h-5" />}
                active={activeItem === 2}
                onClick={() => handleItemClick(2)}
              />
              <SidebarItem
                icon={<CloudArrowDownIcon className="w-5 h-5" />}
                active={activeItem === 3}
                onClick={() => handleItemClick(3)}
              />
            </nav>
          </div>
        </div>

        {/* Panel informacional (condicional) */}
        {showInformationalView && (
          <div className="w-80 bg-slate-800/30 border-r border-slate-700/50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/30">
              <div>
                <h3 className="text-blue-700 text-lg font-medium">
                  Informational View
                </h3>
                <p className="text-white text-base font-light mt-1">
                  {flowStep === 0 &&
                    "Needed documents will update with each prompt."}
                  {flowStep === 1 && "All documents for: SPF 30 Sunscreen"}
                  {flowStep === 2 && "All documents for: SPF 30 Sunscreen"}
                </p>
              </div>
              <div className="flex h-full items-start">
                <button
                  onClick={() => {
                    setFlowStep(3);
                  }}
                  className="text-white hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {flowStep > 0 && (
              <>
                {/* Invoices by providers */}
                <div className="flex flex-row items-start justify-between p-4">
                  <p className="text-blue-700  text-sm font-medium">
                    Invoices by providers
                  </p>
                  <button
                    className="text-blue-700 text-sm font-medium"
                    onClick={() => setFlowStep(2)}
                  >
                    Add more
                  </button>
                </div>
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200"
                  >
                    <p className="text-white text-sm font-light">
                      {invoice.nameFile}
                    </p>
                    <p className="text-white text-sm font-light">
                      {invoice.provider}
                    </p>
                    <button className="text-blue-700 text-sm font-light mt-1">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-row items-start justify-between p-4">
                  <p className="text-blue-700  text-sm font-medium">
                    MSA with providers
                  </p>
                  <button className="text-blue-700 text-sm font-medium">
                    Add more
                  </button>
                </div>
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200"
                  >
                    <p className="text-white text-sm font-light">
                      {invoice.nameFile}
                    </p>
                    <p className="text-white text-sm font-light">
                      {invoice.provider}
                    </p>
                    <button className="text-blue-700 text-sm font-light mt-1">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-row items-start justify-between p-4">
                  <p className="text-blue-700  text-sm font-medium">
                    Linked Accounts
                  </p>
                  <button className="text-blue-700 text-sm font-medium">
                    Add more
                  </button>
                </div>
                <div className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200">
                  <span className="text-white text-sm font-light">
                    <SiGmail className="w-4 h-4 inline mr-2" />
                  </span>
                  <p className=" text-sm font-light">Gmail</p>
                  <p className=" text-sm font-light">g@vendorconnect.ai</p>
                </div>
                <div className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200">
                  <span className="text-white text-sm font-light">
                    <SiDropbox className="w-4 h-4 inline mr-2" />
                  </span>
                  <p className=" text-sm font-light">Dropbox</p>
                  <p className=" text-sm font-light">g@vendorconnect.ai</p>
                </div>
              </>
            )}
          </div>
        )}
        {recentViews && (
          <div className="w-80 bg-slate-800/30 border-r border-slate-700/50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/30">
              <div>
                <h3 className="text-blue-700 text-lg font-medium">
                  Recent View
                </h3>
                <p className="text-white text-base font-light mt-1"></p>
              </div>
              <div className="flex h-full items-start">
                <button
                  onClick={() => {
                    setFlowStep(3);
                  }}
                  className="text-white hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/*{flowStep > 0 && (*/}
            {/*  <>*/}
            {/*    /!* Invoices by providers *!/*/}
            {/*    <div className="flex flex-row items-start justify-between p-4">*/}
            {/*      <p className="text-blue-700  text-sm font-medium">*/}
            {/*        Invoices by providers*/}
            {/*      </p>*/}
            {/*      <button*/}
            {/*        className="text-blue-700 text-sm font-medium"*/}
            {/*        onClick={() => setFlowStep(2)}*/}
            {/*      >*/}
            {/*        Add more*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*    {invoices.map((invoice) => (*/}
            {/*      <div*/}
            {/*        key={invoice.id}*/}
            {/*        className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200"*/}
            {/*      >*/}
            {/*        <p className="text-white text-sm font-light">*/}
            {/*          {invoice.nameFile}*/}
            {/*        </p>*/}
            {/*        <p className="text-white text-sm font-light">*/}
            {/*          {invoice.provider}*/}
            {/*        </p>*/}
            {/*        <button className="text-blue-700 text-sm font-light mt-1">*/}
            {/*          <EyeIcon className="w-4 h-4" />*/}
            {/*        </button>*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*    <div className="flex flex-row items-start justify-between p-4">*/}
            {/*      <p className="text-blue-700  text-sm font-medium">*/}
            {/*        MSA with providers*/}
            {/*      </p>*/}
            {/*      <button className="text-blue-700 text-sm font-medium">*/}
            {/*        Add more*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*    {invoices.map((invoice) => (*/}
            {/*      <div*/}
            {/*        key={invoice.id}*/}
            {/*        className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200"*/}
            {/*      >*/}
            {/*        <p className="text-white text-sm font-light">*/}
            {/*          {invoice.nameFile}*/}
            {/*        </p>*/}
            {/*        <p className="text-white text-sm font-light">*/}
            {/*          {invoice.provider}*/}
            {/*        </p>*/}
            {/*        <button className="text-blue-700 text-sm font-light mt-1">*/}
            {/*          <EyeIcon className="w-4 h-4" />*/}
            {/*        </button>*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*    <div className="flex flex-row items-start justify-between p-4">*/}
            {/*      <p className="text-blue-700  text-sm font-medium">*/}
            {/*        Linked Accounts*/}
            {/*      </p>*/}
            {/*      <button className="text-blue-700 text-sm font-medium">*/}
            {/*        Add more*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*    <div className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200">*/}
            {/*      <span className="text-white text-sm font-light">*/}
            {/*        <SiGmail className="w-4 h-4 inline mr-2" />*/}
            {/*      </span>*/}
            {/*      <p className=" text-sm font-light">Gmail</p>*/}
            {/*      <p className=" text-sm font-light">g@vendorconnect.ai</p>*/}
            {/*    </div>*/}
            {/*    <div className="flex flex-row mx-2 justify-between p-2 border-b border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-200">*/}
            {/*      <span className="text-white text-sm font-light">*/}
            {/*        <SiDropbox className="w-4 h-4 inline mr-2" />*/}
            {/*      </span>*/}
            {/*      <p className=" text-sm font-light">Dropbox</p>*/}
            {/*      <p className=" text-sm font-light">g@vendorconnect.ai</p>*/}
            {/*    </div>*/}
            {/*  </>*/}
            {/*)}*/}
          </div>
        )}

        {/* Área principal para chat */}
        <div className="flex-1 flex flex-col bg-slate-100">{children}</div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, active = false, onClick }) => {
  return (
    <div
      className={`
        w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200
        ${
          active
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            : "text-slate-400 hover:text-white hover:bg-slate-700/30"
        }
      `}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default Sidebar;
