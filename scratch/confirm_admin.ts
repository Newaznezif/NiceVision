import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function confirmUsers() {
  console.log('Fetching users...')
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  for (const user of users) {
    if (user.email === 'admin@nicevision.com' || user.email === 'admin@nicevision.bi') {
      console.log(`Confirming user: ${user.email} (${user.id})`)
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      )
      
      if (updateError) {
        console.error(`Error confirming ${user.email}:`, updateError)
      } else {
        console.log(`Successfully confirmed ${user.email}`)
      }
    }
  }
}

confirmUsers()
