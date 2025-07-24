import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


const supabase = createClient(URL, ANON_KEY);

const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return false;
    }

    return true;
}

const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        return false;
    }

    return true;
}

const getJWT = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return token;   
}

const getIsAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user.email === 'administratora@lexica-botania.cool';
}

const getIsSignedIn = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return false;
    }

    return true;
}

export { signOut, signIn, getJWT, getIsAdmin, getIsSignedIn };