'use server';

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server';

// Sube un archivo al bucket 'documents' de Supabase
export async function uploadDocumentSupabase(file, filePath) {
	// file: File | Blob | Buffer
	// filePath: string (ejemplo: 'userId/filename.pdf')
	const supabase = createClient();
	const { data, error } = await supabase.storage
		.from('documents')
		.upload(filePath, file, {
			upsert: true, // sobreescribe si ya existe
		});
	if (error) throw error;
	return data;
}

export async function getDocumentsSupabase(){
  try {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('isDeleted', false);
    if (error) {
      console.error('Error fetching documents:', error);
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: true,
      data: documents,
    }
  } catch (e) {
    console.error('getDocumentsSupabase', e);
    return {
      success: false,
      error: e.message,
    }
  }
}

export async function  getDocuementsAcceptedSupabase(){
  try{
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('status', 'accepted')
      .eq('isDeleted', false);
    if (error) {
      console.error('Error fetching accepted documents:', error);
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: true,
      data: documents,
    }

  } catch(e){
    console.error('getDocuementsAcceptedSupabase', e);
    return {
      success: false,
      error: e.message,
    }
  }
}

export async function logicDeleteDocumentSupabase(id) {

  try {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data, error } = await supabase
      .from('documents')
      .update({ isDeleted: true })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: true,
      data,
    }
  } catch (e) {
    console.error('logicDeleteDocumentSupabase', e);
    return {
      success: false,
      error: e.message,
    }
  }
}

export async function updateStatusDocumentSupabase(id, status) {
  try {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data, error } = await supabase
      .from('documents')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Error updating document status:', error);
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: true,
      data,
    }
  } catch (e) {
    console.error('updateStatusDocumentSupabase', e);
    return {
      success: false,
      error: e.message,
    }
  }
}