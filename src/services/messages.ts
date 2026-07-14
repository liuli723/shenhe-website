import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'

export const messageService = {
  async create(message: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getAll(): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
}