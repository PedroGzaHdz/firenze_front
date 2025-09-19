import * as XLSX from 'xlsx';
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

export function getDataFromXLSX(bufferXLSX) {
  try {
    const woorkbook = XLSX.read(bufferXLSX, { type: 'buffer' });

    const result = {};

    woorkbook.SheetNames.forEach((sheetName) => {
      const worksheet = woorkbook.Sheets[sheetName];

      result[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    } );

    return {
      success: true,
      data: result
    }


  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: e.message,
    }
  }
}