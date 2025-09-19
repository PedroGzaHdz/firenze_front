'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function createUserProfileSupabase({userID}) {
  try {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const {data : userProfile, error} = await supabase
      .from('users')
      .insert({id: userID})
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: true,
      data: userProfile
    }
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function getUserProfileSupabase({userID}) {
  try {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const {data : userProfile, error} = await supabase
      .from('users')
      .select('*')
      .eq('id', userID)
      .single();
    if (error && error.code === 'PGRST116') { // PGRST116: No rows found
      const responseCreate = await createUserProfileSupabase({userID});
      return responseCreate;
    }
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: true,
      data: userProfile
    }
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}
