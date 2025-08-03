import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    // 🔐 Variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({
        error: 'Missing environment variables'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    console.log('🔧 Configuration Edge Function chargée')
    console.log('📡 URL:', supabaseUrl)
    console.log('🔑 Service Key:', supabaseServiceKey ? 'Présent' : 'Manquant')

    // Créer le client Supabase avec le service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 🔑 Authentification via Bearer token
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    
    console.log('📋 Auth header:', authHeader ? 'Présent' : 'Manquant')
    console.log('🔑 Token extrait:', token.substring(0, 20) + '...')

    if (!token) {
      console.log('❌ Token d\'authentification manquant')
      return new Response(JSON.stringify({
        error: 'Missing auth token'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    // 🔍 Vérifier l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.log('❌ Erreur d\'authentification:', userError)
      return new Response(JSON.stringify({
        error: 'Invalid auth token'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    console.log(`✅ Utilisateur authentifié: ${user.email} (${user.id})`)
    console.log(`🗑️ Début du soft delete du compte: ${user.email} (${user.id})`)

    // 1. Marquer l'utilisateur comme supprimé (soft delete)
    console.log('🗑️ Marquage du profil comme supprimé...')
    
    const { error: updateProfileError } = await supabase
      .from('users')
      .update({ 
        deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', user.id)
      
    if (updateProfileError) {
      console.error('❌ Erreur lors du marquage comme supprimé:', updateProfileError)
      return new Response(JSON.stringify({
        error: 'Error marking user as deleted',
        details: updateProfileError.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }
    
    console.log('✅ Profil utilisateur marqué comme supprimé')

    // 2. Déconnecter l'utilisateur (pas de suppression auth.users)
    console.log('🚪 Déconnexion forcée de l\'utilisateur...')
    
    const { error: signOutError } = await supabase.auth.admin.signOut(user.id)
    if (signOutError) {
      console.log('⚠️ Erreur lors de la déconnexion forcée:', signOutError)
      // On continue quand même, ce n'est pas critique
    } else {
      console.log('✅ Utilisateur déconnecté avec succès')
    }
    
    console.log(`✅ Compte marqué comme supprimé avec succès: ${user.email}`)

    return new Response(JSON.stringify({
      success: true,
      message: 'Compte marqué comme supprimé avec succès',
      userId: user.id
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return new Response(JSON.stringify({
      error: 'Internal error',
      details: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}) 