export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      certifications: {
        Row: {
          id: string
          name: string
          issuer: string
          year: number | null
          status: string | null
          category: string | null
          expiry: string | null
          badge: string | null
          verify_url: string | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          year?: number | null
          status?: string | null
          category?: string | null
          expiry?: string | null
          badge?: string | null
          verify_url?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          year?: number | null
          status?: string | null
          category?: string | null
          expiry?: string | null
          badge?: string | null
          verify_url?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          position: string
          start_date: string | null
          end_date: string | null
          description: string | null
          highlights: string[] | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          position: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          highlights?: string[] | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          position?: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          highlights?: string[] | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          name: string
          category: string | null
          status: string | null
          description: string | null
          tags: string[] | null
          github_url: string | null
          demo_url: string | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          status?: string | null
          description?: string | null
          tags?: string[] | null
          github_url?: string | null
          demo_url?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          status?: string | null
          description?: string | null
          tags?: string[] | null
          github_url?: string | null
          demo_url?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          thumbnail: string | null
          tags: string[] | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          thumbnail?: string | null
          tags?: string[] | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          thumbnail?: string | null
          tags?: string[] | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
