'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { getUserProfileSupabase } from '@/actions/userActions';
import {
  createChatSupabase,
  getChatSupabase,
  updateChatSupabase,
} from '@/actions/chatsActions';
import { generateAIResponseAction } from '@/actions/aiActions';
import { resetChatSupabase } from '@/actions/chatsActions';
import { getVendors } from '@/actions/getVendors';

const suggestions = [
  'Why did this margin drop?',
  'Suggest alternatives',
  "What's the inventory status?",
  'Analyze sales trends',
];

const AiChat = ({ documents = [], loadingDocs = false }) => {
  const [showDocs, setShowDocs] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isAttachingVendors, setIsAttachingVendors] = useState(false);
  const [vendorsData, setVendorsData] = useState(null);
  // Buscar el documento completo (con todos los campos) si existe
  const selectedDoc = documents.find((doc) => doc.id === selectedDocId);
  const [message, setMessage] = useState('');
  const { user } = useAuth({ ensureSignedIn: true });
  const [userProfile, setUserProfile] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message:
        "Hello, I'm your SKU Margin Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  // Ref para el contenedor de mensajes
  const messagesEndRef = useRef(null);
  // Scroll automático al final cuando cambia el chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Forzar autoscroll también cuando isLoadingAI cambia (por si IA typing...)
  useEffect(() => {
    if (isLoadingAI && messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [isLoadingAI]);


  const handleSendMessage = async () => {
    if (!message.trim() || isLoadingAI) return;
    setIsLoadingAI(true);

    // Detectar si el mensaje menciona "vendor" en múltiples idiomas
    // Inglés: vendor(s), supplier(s), provider(s)
    // Español: proveedor(es), provedor(es), vendedor(es)
    // Portugués: fornecedor(es), vendedor(es)
    // Francés: fournisseur(s), vendeur(s)
    // Italiano: fornitore(i), venditore(i)
    // Alemán: lieferant(en), anbieter
    const vendorKeywords = /vendor(e)?s?|supplier(s)?|provider(s)?|prove[e]?dor(es)?|vendedor(es)?|fornecedor(es)?|fournisseur(s)?|vendeur(s)?|fornitore(i)?|venditore(i)?|lieferant(en)?|anbieter/i;
    const mentionsVendors = vendorKeywords.test(message);
    let attachedVendors = null;

    if (mentionsVendors) {
      setIsAttachingVendors(true);
      try {
        const vendors = await getVendors();
        attachedVendors = vendors;
        setVendorsData(vendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
      setIsAttachingVendors(false);
    }

    const userMessage = {
      type: 'user',
      message: message,
      timestamp: new Date(),
      document: selectedDoc ? { ...selectedDoc } : null,
      vendorsTable: attachedVendors,
    };

    // Update local state with user message
    const updatedChatHistory = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory);

    let chatID = null;

    if (userProfile?.lastChatID) {
      chatID = userProfile.lastChatID;
      await updateChatSupabase({
        chatID: chatID,
        chatHistory: updatedChatHistory,
      });
    } else if (user) {
      const responseCreateChat = await createChatSupabase({
        userID: user.id,
        chatHistory: updatedChatHistory,
      });
      if (responseCreateChat?.success) {
        chatID = responseCreateChat?.data?.id;
        setUserProfile((prev) => ({
          ...prev,
          lastChatID: responseCreateChat.data.id,
        }));
      }
    }

    setMessage('');
    setSelectedDocId(null); // Limpiar documento adjunto al enviar

    // Mostrar mensaje de "IA escribiendo..."
    setChatHistory([...updatedChatHistory, {
      type: 'ai',
      message: 'AI is typing...',
      timestamp: new Date(),
      loading: true,
    }]);

    // Enviar también el documento seleccionado a la acción de AI
    const aiMessageResponse = await generateAIResponseAction(updatedChatHistory);

    const finalChatHistory = [...updatedChatHistory, {
      type: 'ai',
      message: aiMessageResponse.success ? aiMessageResponse.data : "I'm sorry, I couldn't process that.",
      timestamp: new Date(),
    }];

    setChatHistory(finalChatHistory);
    setIsLoadingAI(false);

    if (chatID) {
      await updateChatSupabase({
        chatID: chatID,
        chatHistory: finalChatHistory,
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  useEffect(() => {
    if (user) {
      getUserProfileSupabase({ userID: user.id })
        .then(async (response) => {
          if (response.success) {
            const dataUser = response.data;
            setUserProfile(dataUser);
            if (dataUser?.lastChatID) {
              const chatResponse = await getChatSupabase(dataUser.lastChatID);
              if (chatResponse.success) {
                setChatHistory(chatResponse.data.chat);
              } else {
                console.error('Error fetching chat:', chatResponse.error);
              }
            } else {
              setChatHistory([
                {
                  type: 'ai',
                  message:
                    "Hello, I'm your SKU Margin Assistant. How can I help you today?",
                  timestamp: new Date(),
                },
              ]);
            }
          } else {
            console.error('Error fetching user profile:', response.error);
          }
        })
        .catch((error) => {
          console.error('Unexpected error:', error);
        });
    }
  }, [user]);

  // Reiniciar chat (local y preparar para supabase)
  const handleResetChat = async () => {
    setIsResetting(true);
    setMessage('');
    setSelectedDocId(null);
    // Mostrar mensaje de reinicio
    setChatHistory([
      {
        type: 'ai',
        message: 'Resetting chat...',
        timestamp: new Date(),
        loading: true,
      },
    ]);
    // Si hay chatID y userProfile, limpiar en supabase y actualizar local
    if (userProfile?.lastChatID) {
      const res = await resetChatSupabase({ chatID: userProfile.lastChatID });
      if (res.success && res.data?.chat) {
        setChatHistory(res.data.chat);
        setIsResetting(false);
        return;
      }
    }
    // Si no hay chatID o error, limpiar localmente
    setChatHistory([
      {
        type: 'ai',
        message:
          "Hello, I'm your SKU Margin Assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setIsResetting(false);
  };

  return (
    <div className='lg:col-span-2'>
      <Card className='flex h-[600px] flex-col'>
        <CardHeader className='border-b flex flex-row items-center justify-between'>
          <CardTitle className='text-lg'>Chat with AI Assistant</CardTitle>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleResetChat}
              className='text-gray-500 hover:text-blue-600 flex items-center gap-1.5'
            >
              <RotateCcw className='h-4 w-4' />
              Start New Chat
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowDocs((v) => !v)}
              disabled={loadingDocs}
            >
              {showDocs ? 'Hide Documents' : 'Select Document'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className='flex flex-1 flex-col min-h-0 p-0'>
          {/* Document Selector */}
          {showDocs && (
            <div className='border-b bg-gray-50 p-3 max-h-40 overflow-y-auto'>
              {loadingDocs ? (
                <div className='text-gray-500 text-sm'>Loading documents...</div>
              ) : (
                <ul className='space-y-1'>
                  {documents.length === 0 && (
                    <li className='text-gray-400 text-sm'>No documents available</li>
                  )}
                  {documents.map((doc) => (
                    <li key={doc.id}>
                      <Button
                        variant={selectedDocId === doc.id ? 'default' : 'outline'}
                        size='sm'
                        className='w-full flex justify-between items-center text-xs'
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          setShowDocs(false); // Cerrar modal al seleccionar
                        }}
                      >
                        <span className='truncate'>{doc.name}</span>
                        <span className='ml-2 text-gray-400'>{doc.type}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Chat Messages */}
          <div
            className='flex-1 space-y-4 overflow-y-auto p-4 max-w-full overflow-x-hidden'
            ref={messagesEndRef}
          >
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-full sm:max-w-md rounded-lg p-3 overflow-x-auto ${chat.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : chat.loading ? 'bg-gray-50 text-gray-400 italic' : 'bg-gray-100 text-gray-900'
                    }`}
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  <p className='text-sm whitespace-pre-line break-all'>
                    {chat.loading ? (
                      <span className='flex items-center gap-2'>
                        <svg className='animate-spin h-4 w-4 text-gray-400' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                        </svg>
                        AI is typing...
                      </span>
                    ) : chat.message}
                  </p>
                  {chat.document && (
                    <div className='mt-2 text-xs text-blue-900 bg-blue-50 rounded px-2 py-1'>
                      <span className='font-semibold'>Document:</span> {chat.document.name} <span className='text-gray-500'>({chat.document.type})</span>
                    </div>
                  )}
                  {chat.vendorsTable && (
                    <div className='mt-2 text-xs text-purple-900 bg-purple-50 rounded px-2 py-1 flex items-center gap-1'>
                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      <span className='font-semibold'>Vendors Table:</span> {chat.vendorsTable.length} vendors attached
                    </div>
                  )}
                  <p className='mt-1 text-xs opacity-70'>
                    {chat.timestamp
                      ? new Date(chat.timestamp).toLocaleTimeString()
                      : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className='border-t p-4'>
            {isAttachingVendors && (
              <div className='mb-2 text-xs text-purple-700 bg-purple-50 rounded px-3 py-2 flex items-center gap-2'>
                <svg className='animate-spin h-3 w-3 text-purple-700' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                </svg>
                Attaching vendors table to your question...
              </div>
            )}
            <div className='flex gap-2'>
              <Input
                placeholder={selectedDoc ? `Ask about: ${selectedDoc.name}` : 'Ask a question about your margins...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className='flex-1'
                disabled={isLoadingAI || isResetting || loadingDocs || (showDocs && !selectedDocId) || isAttachingVendors}
              />
              <Button
                onClick={handleSendMessage}
                className='bg-blue-600 hover:bg-blue-700'
                disabled={isLoadingAI || isResetting || loadingDocs || (showDocs && !selectedDocId)}
              >
                {(isLoadingAI || isResetting) ? (
                  <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                  </svg>
                ) : (
                  <Send className='h-4 w-4' />
                )}
              </Button>
            </div>
            {/* Quick Suggestions */}
            {
              chatHistory?.find((msg) => msg.type === 'user')  ?
                null
                : (
                <div className='mt-3 flex flex-wrap gap-2'>
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant='outline'
                      size='sm'
                      onClick={() => handleSuggestionClick(suggestion)}
                      className='text-xs'
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )
            }
            {selectedDoc && (
              <div className='mt-2 text-xs text-blue-900 bg-blue-50 rounded px-2 py-1'>
                <span className='font-semibold'>Selected Document:</span> {selectedDoc.name} <span className='text-gray-500'>({selectedDoc.type})</span>
                <Button size='xs' variant='ghost' className='ml-2 text-xs text-blue-600' onClick={() => setSelectedDocId(null)}>
                  Remove
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiChat;
