import { createRouteHandlerSupabaseClient } from '@/utils/supabase/routeHandlerClient';
import {
  getDataFromInvoice,
  getDataFromXLSX,
} from '@/app/api/upload-document/functions';
import { getDataInvoiceFromOCRData } from '@/utils/openai';

// Validaciones básicas: si no es válido -> null
function vString(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function vNumber(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function vISODate(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function vLineItems(items) {
  if (!Array.isArray(items)) return null;
  return items
    .map((it) => {
      if (!it || typeof it !== 'object') return null;
      return {
        description: vString(it.description),
        quantity: vNumber(it.quantity),
        unitPrice: vNumber(it.unitPrice),
        total: vNumber(it.total),
        skuCode: Array.isArray(it.skuCode)
          ? it.skuCode
              .filter((s) => typeof s === 'string' && s.trim())
              .map((s) => s.trim())
          : null,
      };
    })
    .filter(Boolean);
}

// Sube un archivo al bucket 'documents' de Supabase desde un route handler
export async function uploadDocumentSupabaseRouteHandler(
  file,
  filePath,
  contentType,
) {
  try {
    const supabase = createRouteHandlerSupabaseClient();
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        upsert: true,
        contentType: contentType,
      });
    if (error) throw error;
    // Obtener la URL pública del archivo subido
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    if (contentType === 'application/pdf' && publicUrlData?.publicUrl) {
      const responseDataToSave = await getDataFromInvoice(
        publicUrlData?.publicUrl,
      );
      if (responseDataToSave?.success) {
        const dataToSave = responseDataToSave?.data;
        const {
          cogsCategory,
          vendor,
          hash,
          date,
          confidenceScore,
          total,
          lineItems,
        } = dataToSave;
        const dataToInsert = {
          name: vString(filePath.split('/').pop()),
          cogsCategory: vString(cogsCategory),
          vendor: vString(vendor),
          hash: vString(hash),
          date: vISODate(date), // ISO o null
          confidenceScore: vNumber(confidenceScore), // 0-1 se puede filtrar luego si quieres
          total: vNumber(total),
          lineItems: vLineItems(lineItems) /* array normalizado o null */,
          status: 'pending',
          url: vString(publicUrlData?.publicUrl),
          rawData: dataToSave, // Guarda los datos extraídos del PDF
        };

        const responseSupabaseUploadData = await supabase
          .from('documents')
          .insert(dataToInsert);

        if (responseSupabaseUploadData.error) {
          console.error(
            'Error saving document data to Supabase:',
            responseSupabaseUploadData.error,
          );
          throw responseSupabaseUploadData.error;
        }

        return {
          success: true,
          data,
          url: publicUrlData?.publicUrl || null,
        };
      }
    }else if (
      contentType ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      console.log("It's an Excel file");
      const dataXlsx = getDataFromXLSX(file);
      if (dataXlsx?.success) {
        const dataInvoice = await getDataInvoiceFromOCRData(dataXlsx);
        if (dataInvoice?.success) {
          const dataToSave = dataInvoice?.data;
          const {
            cogsCategory,
            vendor,
            hash,
            date,
            confidenceScore,
            total,
            lineItems,
          } = dataToSave;
          const dataToInsert = {
            name: vString(filePath.split('/').pop()),
            cogsCategory: vString(cogsCategory),
            vendor: vString(vendor),
            hash: vString(hash),
            date: vISODate(date), // ISO o null
            confidenceScore: vNumber(confidenceScore), // 0-1 se puede filtrar luego si quieres
            total: vNumber(total),
            lineItems: vLineItems(lineItems) /* array normalizado o null */,
            status: 'pending',
            url: vString(publicUrlData?.publicUrl),
            rawData: dataXlsx.data, // Guarda los datos extraídos del XLSX
          }
          const responseSupabaseUploadData = await supabase
            .from('documents')
            .insert(dataToInsert);
          if (responseSupabaseUploadData.error) {
            console.error(
              'Error saving document data to Supabase:',
              responseSupabaseUploadData.error,
            );
            throw responseSupabaseUploadData.error;
          }
          return {
            success: true,
            data,
            url: publicUrlData?.publicUrl || null,
          }
        }
      }
    }
  } catch (e) {
    console.error('Error uploading document to Supabase:', e);
    return {
      success: false,
      error: e.message,
    };
  }
}
