import { supabase } from '@/lib/supabase'
import type { Advantage } from '@/types'

export const advantageService = {
  async getAll(): Promise<Advantage[]> {
    const { data, error } = await supabase
      .from('advantages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getEnabled(): Promise<Advantage[]> {
    const { data, error } = await supabase
      .from('advantages')
      .select('*')
      .eq('status', 'enabled')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Advantage | null> {
    const { data, error } = await supabase
      .from('advantages')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(advantage: Omit<Advantage, 'id' | 'created_at'>): Promise<Advantage> {
    const { data, error } = await supabase
      .from('advantages')
      .insert(advantage)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, advantage: Partial<Omit<Advantage, 'id' | 'created_at'>>): Promise<Advantage> {
    const { data, error } = await supabase
      .from('advantages')
      .update(advantage)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('advantages')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async toggleStatus(id: string, currentStatus: 'enabled' | 'disabled'): Promise<Advantage> {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled'
    return this.update(id, { status: newStatus })
  },
}