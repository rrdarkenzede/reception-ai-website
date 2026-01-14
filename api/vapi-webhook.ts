/**
 * Vapi.ai Webhook Handler
 * 
 * This file should be deployed as a serverless function (Vercel, Netlify, etc.)
 * or as an API route in your backend to receive call data from Vapi.ai
 * 
 * Configure the webhook URL in your Vapi.ai dashboard:
 * https://your-domain.com/api/vapi-webhook
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

const headerAsString = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v

interface VapiCallEvent {
  type: 'call-start' | 'call-end' | 'function-call' | 'status-update'
  call: {
    id: string
    status: 'ringing' | 'in-progress' | 'ended'
    direction: 'inbound' | 'outbound'
    from: string
    to: string
    startedAt?: string
    endedAt?: string
    duration?: number
  }
  transcript?: string
  recordingUrl?: string
  metadata?: {
    profile_id?: string
    caller_name?: string
    sentiment_score?: number
    [key: string]: unknown
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabase) {
    return res.status(500).json({
      error: 'Server misconfigured: missing SUPABASE_URL (or VITE_SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY'
    })
  }

  // Verify webhook secret (optional but recommended)
  const webhookSecret = headerAsString(req.headers['x-vapi-secret'])
  const expectedSecret = process.env.VAPI_WEBHOOK_SECRET || process.env.VITE_VAPI_WEBHOOK_SECRET
  if (expectedSecret && webhookSecret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const event: VapiCallEvent = req.body

    // Handle call-end event (most important for logging)
    if (event.type === 'call-end' && event.call.status === 'ended') {
      const { data: callLog, error } = await supabase
        .from('call_logs')
        .insert([
          {
            profile_id: event.metadata?.profile_id || null,
            caller_name: event.metadata?.caller_name || null,
            caller_phone: event.call.direction === 'inbound' ? event.call.from : event.call.to,
            type: event.call.direction === 'inbound' ? 'incoming' : 'outgoing',
            status: 'completed',
            duration: event.call.duration || null,
            recording_url: event.recordingUrl || null,
            transcript: event.transcript || null,
            sentiment_score: event.metadata?.sentiment_score || null,
            metadata: event.metadata || {},
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error inserting call log:', error)
        return res.status(500).json({ error: 'Failed to log call' })
      }

      return res.status(200).json({ success: true, callLog })
    }

    // Handle other event types if needed
    return res.status(200).json({ success: true, message: 'Event received' })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
