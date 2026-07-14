import { supabase } from '@/lib/supabase'
import type { News } from '@/types'

export const newsService = {
  async getAll(): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('publish_time', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getPublished(): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('publish_time', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<News | null> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(news: Omit<News, 'id' | 'created_at'>): Promise<News> {
    const { data, error } = await supabase
      .from('news')
      .insert(news)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, news: Partial<Omit<News, 'id' | 'created_at'>>): Promise<News> {
    const { data, error } = await supabase
      .from('news')
      .update(news)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async toggleStatus(id: string, currentStatus: 'published' | 'draft'): Promise<News> {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    return this.update(id, { status: newStatus })
  },
}