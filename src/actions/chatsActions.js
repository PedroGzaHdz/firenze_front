'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getChatSupabase(chatID) {
  try {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data: chat, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatID)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: true,
      data: chat,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function createChatSupabase({userID,  chatHistory }) {
  try {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data: chat, error } = await supabase
      .from('chats')
      .insert({chat: chatHistory , userID: userID})
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    const { error: userError } = await supabase
      .from('users')
      .update({ lastChatID: chat.id })
      .eq('id', userID)
      .select()
      .single();

    if (userError) {
      return {
        success: false,
        error: userError.message,
      };
    }

    return {
      success: true,
      data: chat,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function updateChatSupabase({ chatID, chatHistory }) {
  try {
    if (!chatID) {
      return {
        success: false,
        error: 'Chat ID is required',
      }
    }
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data: chat, error } = await supabase
      .from('chats')
      .update({ chat: chatHistory })
      .eq('id', chatID)
      .select()
      .single();
    if (error && error.code === 'PGRST116') {
      // PGRST116: No rows found, create new chat
      return {
        success: false,
        error: 'Chat not found',
      };
    }

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (chat) {
      return {
        success: true,
        data: chat,
      };
    }

  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
// Resetea el historial de un chat existente
export async function resetChatSupabase({ chatID }) {
  try {
    if (!chatID) {
      return { success: false, error: 'Chat ID is required' };
    }
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const emptyHistory = [
      {
        type: 'ai',
        message: "Hello, I'm your SKU Margin Assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ];
    const { data: chat, error } = await supabase
      .from('chats')
      .update({ chat: emptyHistory })
      .eq('id', chatID)
      .select()
      .single();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: chat };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
