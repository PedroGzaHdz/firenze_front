import { Mistral } from '@mistralai/mistralai';
import { mistralApiKey } from '@/config/env';

const clientMistral = new Mistral({
  apiKey: mistralApiKey,
});

export async function getOCRDataFromMistral(pdfUrl) {
  try {
    const response = await clientMistral.ocr.process({
      model: 'mistral-ocr-latest',
      document: {
        type: 'document_url',
        documentUrl: pdfUrl,
      },
      includeImageBase64: true,
    });
    const dataExtracted = response?.pages?.map((page) => ({
      pageNumber: page.index,
      text: page.markdown
    }));
    return {
      success: true,
      data: dataExtracted,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}
