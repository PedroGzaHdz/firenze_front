import { createBrowserClient } from "@supabase/ssr";
import {supabaseKey, supabaseUrl} from "@/config/env";


export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
