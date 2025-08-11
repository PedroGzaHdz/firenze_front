"use client";
import React from "react";
import Sidebar from "../components/navBar";
import SugerationChatCard from "../components/sugerationChatCard";
import ChatComponent from "@/components/chatComponent";
import { ChevronDown } from "lucide-react";
import DocumentTermsCard from "@/components/documentsTermsCard";
import UploadDocumentsModal from "@/components/uploadDocumentsModal";

export default function HomePage() {
  const [flowStep, setFlowStep] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  function handleClose() {
    setFlowStep(3);
    setOpenModal(false);
  }
  React.useEffect(() => {
    if (flowStep === 2) {
      setOpenModal(true);
    }
  }, [flowStep]);
  return (
    <>
      <Sidebar setFlowStep={setFlowStep} flowStep={flowStep}>
        {/* Área principal del chat */}
        <div className="flex-1 flex flex-col">
          {/* Área de mensajes del chat */}
          <main className="flex-1 overflow-auto flex flex-col justify-between">
            <div className="w-full px-20 py-8">
              {/* Mensaje de bienvenida */}
              <div className="mb-8 text-center">
                <h1 className="font-mondwest text-3xl  bg-gradient-to-r text-blue-600 bg-clip-text mb-4 text-left">
                  Hey Giulio!
                </h1>
                <p className="text-xl  text-blue-600  font-medium mb-8 text-left">
                  What can we discover for you today?
                </p>

                {/* Sugerencias de chat */}
                {flowStep === 0 && (
                  <>
                    <div className="mt-16  flex flex-row gap-4 mb-8 w-full">
                      <SugerationChatCard
                        onClick={() => setFlowStep(1)}
                        body="Create a new peoduct line and add the needed vendor lists..."
                        footerText="3 additional documents required"
                      />
                      <SugerationChatCard
                        onClick={() => setFlowStep(1)}
                        body="Create a forecast outlining out cash conversion  rate for the next 3 months..."
                        footerText="All documents available"
                      />
                      <SugerationChatCard
                        onClick={() => setFlowStep(1)}
                        body="What vendors should we prepay in order to boost margins on X product?..."
                        footerText="1 previus selection required"
                      />
                    </div>
                    {/* Load more button */}
                    <div className="text-left flex items-center justify-between">
                      <button className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center gap-2 ml-2">
                        Load 4 more options
                      </button>
                    </div>
                  </>
                )}
                {flowStep > 0 && (
                  <>
                    <div className="mt-8">
                      <div className="w-2/5 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-gray-600 text-sm leading-relaxed flex-1 text-left">
                            What vendors should we prepay in order to boost
                            margins on X product?
                          </p>

                          <div className="relative flex-shrink-0">
                            <button className="w-full bg-white  rounded-lg px-3 py-2.5 flex items-center justify-between hover:border-gray-300 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <span className="text-blue-500 text-sm font-medium">
                                SPF 30 Sunscreen
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-blue-500 transition-transform`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {flowStep >= 3 && <DocumentTermsCard />}
                  </>
                )}
              </div>

              {/* Área de mensajes del chat (vacía por ahora) */}
              <div className="space-y-4 mb-2">
                {/* Aquí irán los mensajes del chat */}
              </div>
            </div>
            {/* ChatComponent centrado y abajo */}
            <div className="w-full h-1/5 flex justify-center items-end px-20 py-0">
              <div className="w-full h-full">
                <ChatComponent />
              </div>
            </div>
          </main>
        </div>
      </Sidebar>
      <UploadDocumentsModal isOpen={openModal} onClose={handleClose} />
    </>
  );
}
