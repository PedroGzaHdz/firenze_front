import { getOCRDataFromMistral } from '@/utils/mistralAI';
import { getDataInvoiceFromOCRData } from '@/utils/openai';

export async function getDataFromInvoice(pdfUrl) {
  try {
    const responseOCR = await getOCRDataFromMistral(pdfUrl);
    if (!responseOCR.success) {
      throw new Error(responseOCR.error || 'OCR processing failed');
    }
    const ocrData = responseOCR?.data;

    const responseOpenAi = await getDataInvoiceFromOCRData(ocrData);
    if (!responseOpenAi.success) {
      throw new Error(responseOpenAi.error || 'Data extraction from OCR failed');
    }
    const invoiceData = responseOpenAi?.data;
    return {
      success: true,
      data: invoiceData
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: e.message,
    }
  }
}