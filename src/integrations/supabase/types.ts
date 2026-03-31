export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admission_thresholds: {
        Row: {
          created_at: string
          id: string
          min_bagrut: number | null
          min_combined: number | null
          min_psychometric: number | null
          notes: string | null
          path_id: string
          university_id: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          min_bagrut?: number | null
          min_combined?: number | null
          min_psychometric?: number | null
          notes?: string | null
          path_id: string
          university_id: string
          updated_at?: string
          year?: number
        }
        Update: {
          created_at?: string
          id?: string
          min_bagrut?: number | null
          min_combined?: number | null
          min_psychometric?: number | null
          notes?: string | null
          path_id?: string
          university_id?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "admission_thresholds_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admission_thresholds_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_likes: {
        Row: {
          announcement_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_likes_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          event_date: string | null
          group_name: string | null
          id: string
          path_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          event_date?: string | null
          group_name?: string | null
          id?: string
          path_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          event_date?: string | null
          group_name?: string | null
          id?: string
          path_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_applicants: {
        Row: {
          acceptance_status: string
          bagrut_average: number | null
          created_at: string
          eligible_for_promotion: boolean
          id: string
          mor_score: string | null
          path_id: string | null
          psychometric: number | null
          university_id: string | null
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          acceptance_status?: string
          bagrut_average?: number | null
          created_at?: string
          eligible_for_promotion?: boolean
          id?: string
          mor_score?: string | null
          path_id?: string | null
          psychometric?: number | null
          university_id?: string | null
          updated_at?: string
          user_id: string
          year?: number
        }
        Update: {
          acceptance_status?: string
          bagrut_average?: number | null
          created_at?: string
          eligible_for_promotion?: boolean
          id?: string
          mor_score?: string | null
          path_id?: string | null
          psychometric?: number | null
          university_id?: string | null
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_applicants_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anonymous_applicants_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_data: Json | null
          old_data: Json | null
          user_id: string
        }
        Insert: {
          action?: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      auto_group_leaves: {
        Row: {
          auto_group_key: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          auto_group_key: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          auto_group_key?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      beta_allowed_emails: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "beta_allowed_emails_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string
          data: Json
          eligible_for_promotion: boolean
          id: string
          share_data_consent: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          eligible_for_promotion?: boolean
          id?: string
          share_data_consent?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          eligible_for_promotion?: boolean
          id?: string
          share_data_consent?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          announcement_id: string
          content: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_favorites: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_favorites_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          question_id: string | null
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id?: string | null
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string | null
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      community_mentions: {
        Row: {
          created_at: string
          id: string
          mentioned_user_id: string
          question_id: string | null
          reply_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mentioned_user_id: string
          question_id?: string | null
          reply_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mentioned_user_id?: string
          question_id?: string | null
          reply_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_mentions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_mentions_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      community_questions: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_pinned: boolean
          status: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_pinned?: boolean
          status?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_pinned?: boolean
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      community_replies: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_best: boolean
          parent_id: string | null
          question_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_best?: boolean
          parent_id?: string | null
          question_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_best?: boolean
          parent_id?: string | null
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_replies_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_votes: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          resend_message_id: string | null
          sender_email: string
          sender_user_id: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          resend_message_id?: string | null
          sender_email: string
          sender_user_id: string
          status: string
          subject: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          resend_message_id?: string | null
          sender_email?: string
          sender_user_id?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          last_read_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          last_read_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          last_read_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          auto_group_key: string | null
          created_at: string
          group_avatar: string | null
          group_name: string | null
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          auto_group_key?: string | null
          created_at?: string
          group_avatar?: string | null
          group_name?: string | null
          id?: string
          type?: string
          updated_at?: string
        }
        Update: {
          auto_group_key?: string | null
          created_at?: string
          group_avatar?: string | null
          group_name?: string | null
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      donation_settings: {
        Row: {
          contributors: number
          goal: number
          id: string
          raised: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contributors?: number
          goal?: number
          id?: string
          raised?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contributors?: number
          goal?: number
          id?: string
          raised?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          method: string
          notes: string | null
          reported_by: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          reported_by: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          reported_by?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      libraries: {
        Row: {
          color: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          file_type: string | null
          file_url: string | null
          folder_id: string | null
          id: string
          is_folder: boolean
          link_url: string | null
          path: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          folder_id?: string | null
          id?: string
          is_folder?: boolean
          link_url?: string | null
          path?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          folder_id?: string | null
          id?: string
          is_folder?: boolean
          link_url?: string | null
          path?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "libraries_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "libraries"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          file_type: string | null
          file_url: string | null
          id: string
          message_type: string
          reply_to_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          message_type?: string
          reply_to_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          message_type?: string
          reply_to_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string
          announcement_id: string | null
          comment_id: string | null
          community_question_id: string | null
          created_at: string
          id: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          actor_id: string
          announcement_id?: string | null
          comment_id?: string | null
          community_question_id?: string | null
          created_at?: string
          id?: string
          read?: boolean
          type?: string
          user_id: string
        }
        Update: {
          actor_id?: string
          announcement_id?: string | null
          comment_id?: string | null
          community_question_id?: string | null
          created_at?: string
          id?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_community_question_id_fkey"
            columns: ["community_question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      paths: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      profile_visits: {
        Row: {
          created_at: string
          id: string
          profile_owner_id: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_owner_id: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_owner_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[]
          banned_at: string | null
          banned_by: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          email: string
          email_notifications: boolean
          first_name: string
          hide_last_seen: boolean
          id: string
          is_admin: boolean
          is_email_private: boolean
          is_phone_private: boolean
          is_student: boolean
          last_name: string
          last_seen_at: string | null
          permissions: string[]
          primary_role: string
          role: string
          student_university_id: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[]
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string
          email_notifications?: boolean
          first_name?: string
          hide_last_seen?: boolean
          id?: string
          is_admin?: boolean
          is_email_private?: boolean
          is_phone_private?: boolean
          is_student?: boolean
          last_name?: string
          last_seen_at?: string | null
          permissions?: string[]
          primary_role?: string
          role?: string
          student_university_id?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[]
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string
          email_notifications?: boolean
          first_name?: string
          hide_last_seen?: boolean
          id?: string
          is_admin?: boolean
          is_email_private?: boolean
          is_phone_private?: boolean
          is_student?: boolean
          last_name?: string
          last_seen_at?: string | null
          permissions?: string[]
          primary_role?: string
          role?: string
          student_university_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_student_university_id_fkey"
            columns: ["student_university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          content: string
          created_at: string
          id: string
          path: string
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          path?: string
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          path?: string
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string
          id: string
          reason: string
          reported_user_id: string | null
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          reason: string
          reported_user_id?: string | null
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          reason?: string
          reported_user_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: []
      }
      role_settings: {
        Row: {
          badge_color: string
          id: string
          name_color: string
          role: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          badge_color?: string
          id?: string
          name_color?: string
          role: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          badge_color?: string
          id?: string
          name_color?: string
          role?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      score_thresholds: {
        Row: {
          category: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          notes: string | null
          path_id: string | null
          round: string
          score: number | null
          score_date: string | null
          type: string
          university: string
          updated_at: string
          year: number
        }
        Insert: {
          category?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          notes?: string | null
          path_id?: string | null
          round?: string
          score?: number | null
          score_date?: string | null
          type?: string
          university: string
          updated_at?: string
          year?: number
        }
        Update: {
          category?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          notes?: string | null
          path_id?: string | null
          round?: string
          score?: number | null
          score_date?: string | null
          type?: string
          university?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "score_thresholds_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      simulations: {
        Row: {
          created_at: string
          id: string
          path: string
          result: Json
          score: number | null
          university: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          path?: string
          result?: Json
          score?: number | null
          university?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          result?: Json
          score?: number | null
          university?: string
          user_id?: string
        }
        Relationships: []
      }
      steps: {
        Row: {
          content: string
          created_at: string
          id: string
          path: string
          sort_order: number
          title: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          path?: string
          sort_order?: number
          title: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          path?: string
          sort_order?: number
          title?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "steps_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          path_id: string | null
          slug: string | null
          sort_order: number
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          path_id?: string | null
          slug?: string | null
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          path_id?: string | null
          slug?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "universities_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_files: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      wall_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wall_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "wall_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      wall_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          parent_id: string | null
          profile_owner_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          parent_id?: string | null
          profile_owner_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          parent_id?: string | null
          profile_owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wall_posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wall_posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_admissions: { Args: { uid: string }; Returns: boolean }
      can_manage_library: { Args: { uid: string }; Returns: boolean }
      can_moderate_community: { Args: { uid: string }; Returns: boolean }
      delete_direct_conversation: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: undefined
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      delete_group_conversation: {
        Args: { _admin_user_id: string; _conversation_id: string }
        Returns: undefined
      }
      delete_message_with_audit: {
        Args: { _message_id: string; _user_id: string }
        Returns: undefined
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_profile_permission: {
        Args: { permission_name: string; uid: string }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_beta_email_allowed: { Args: { _email: string }; Returns: boolean }
      is_conversation_participant: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      leave_group_and_promote: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: undefined
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      send_system_message: {
        Args: { _content: string; _conversation_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
