import { supabase } from './supabase'

// Development users for testing
export const DEV_USERS = {
  admin: {
    email: 'admin@receptionai.com',
    password: 'admin123',
    name: 'Admin Demo',
    role: 'admin' as const,
    plan: 'elite' as const,
    sector: 'restaurant' as const,
  },
  enterprise: {
    email: 'entreprise@receptionai.com',
    password: 'entreprise123',
    name: 'Restaurant Le Gourmet',
    role: 'client' as const,
    plan: 'pro' as const,
    sector: 'restaurant' as const,
  },
  // Additional test users
  beauty: {
    email: 'salon@receptionai.com',
    password: 'beaute123',
    name: 'Institut Beauté',
    role: 'client' as const,
    plan: 'pro' as const,
    sector: 'beauty' as const,
  },
  medical: {
    email: 'clinique@receptionai.com',
    password: 'medical123',
    name: 'Clinique Santé',
    role: 'client' as const,
    plan: 'elite' as const,
    sector: 'medical' as const,
  }
}

// Function to create demo users in Supabase (for development setup)
export async function createDemoUsers() {
  const users = Object.values(DEV_USERS)
  
  for (const user of users) {
    try {
      const { error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role,
            sector: user.sector,
            plan: user.plan,
          }
        }
      })
      
      if (error) {
        console.log(`User ${user.email} might already exist:`, error.message)
      } else {
        console.log(`Created demo user: ${user.email}`)
      }
    } catch (err) {
      console.error(`Error creating user ${user.email}:`, err)
    }
  }
}
