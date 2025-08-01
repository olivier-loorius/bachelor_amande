import { supabase } from './supabaseService'

export async function registerUser({ email, password, name }: { email: string; password: string; name: string }) {
  // 🔒 Validation des champs
  if (!email || !password || !name) {
    throw new Error("Tous les champs sont requis.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name
      }
    }
  });

  if (error) throw error;

  // 🛑 Retourner user et session pour accès immédiat aux tokens
  return {
    user: data.user,
    session: data.session
  };
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  // 🔒 Validation des champs
  if (!email || !password) {
    throw new Error("Email et mot de passe requis.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // 🛑 Retourner user et session pour accès immédiat aux tokens
  return {
    user: data.user,
    session: data.session
  };
}

export async function getUserInfos(userId: string) {
  console.log('🔍 getUserInfos - userId:', userId);
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('❌ Erreur getUserInfos:', error);
    throw error;
  }
  
  console.log('✅ getUserInfos - data:', data);
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
} 