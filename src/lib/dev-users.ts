import { supabase } from './supabase'

// Development users for testing
export const DEV_USERS = {
  admin: {
    email: 'admin@receptionai.com',
    password: import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'admin123',
    name: 'Admin Demo',
    role: 'admin' as const,
    plan: 'elite' as const,
    sector: 'restaurant' as const,
  },
  enterprise: {
    email: 'entreprise@receptionai.com',
    password: import.meta.env.VITE_DEV_ENTERPRISE_PASSWORD || 'entreprise123',
    name: 'Restaurant Le Gourmet',
    role: 'client' as const,
    plan: 'pro' as const,
    sector: 'restaurant' as const,
  },
  // Additional test users
  beauty: {
    email: 'salon@receptionai.com',
    password: import.meta.env.VITE_DEV_BEAUTY_PASSWORD || 'beaute123',
    name: 'Institut Beauté',
    role: 'client' as const,
    plan: 'pro' as const,
    sector: 'beauty' as const,
  },
  medical: {
    email: 'clinique@receptionai.com',
    password: import.meta.env.VITE_DEV_MEDICAL_PASSWORD || 'medical123',
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
        // User might already exist - continue with next user
      } else {
        // Demo user created successfully
      }
    } catch (err) {
      // Error creating demo user - continue with next user
    }
  }
}
