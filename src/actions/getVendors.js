'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function getVendors() {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const { data: vendors } = await supabase
        .from('vendors')
        .select('*');
    return vendors;
}
