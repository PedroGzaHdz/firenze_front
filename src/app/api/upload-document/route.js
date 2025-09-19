import { uploadDocumentSupabaseRouteHandler } from '@/utils/supabase/uploadDocumentRouteHandler';

export const runtime = 'nodejs'; // Asegura que se use Node para acceso a streams

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return new Response(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 },
      );
    }
    // Convierte el archivo a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = `documents/${Date.now()}_${file.name}`;
    const contentType = file.type || 'application/octet-stream';
    const { success } = await uploadDocumentSupabaseRouteHandler(
      buffer,
      filePath,
      contentType,
    );
    if (!success) {
      return new Response(
        {
          success: false,
          error: 'Upload failed',
        },
        { status: 500 },
      );
    }
    return new Response(
      {
        success: true,
        message: 'File uploaded successfully',
        filePath,
      },
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      {
        success: false,
        error: err.message || 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
