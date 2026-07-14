export interface News {
  id: string
  title: string
  summary: string
  content: string
  cover_image: string | null
  publish_time: string
  status: 'published' | 'draft'
  created_at: string
}

export interface Product {
  id: string
  name: string
  summary: string
  description: string
  scenarios: string | null
  process: string | null
  icon: string | null
  status: 'enabled' | 'disabled'
  created_at: string
}

export interface Advantage {
  id: string
  name: string
  summary: string
  description: string
  icon: string | null
  status: 'enabled' | 'disabled'
  created_at: string
}

export interface Message {
  id: string
  name: string
  contact: string
  content: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      news: {
        Row: News
        Insert: Omit<News, 'id' | 'created_at'>
        Update: Partial<Omit<News, 'id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      advantages: {
        Row: Advantage
        Insert: Omit<Advantage, 'id' | 'created_at'>
        Update: Partial<Omit<Advantage, 'id' | 'created_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
    }
  }
}