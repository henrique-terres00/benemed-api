import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../config/database';

export class DatabaseService {
  protected supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  protected async query<T>(
    table: string,
    query: {
      select?: string;
      eq?: { [key: string]: any };
      order?: { column: string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<T[]> {
    let queryBuilder = this.supabase
      .from(table)
      .select(query.select || '*');

    if (query.eq) {
      Object.entries(query.eq).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
    }

    if (query.order) {
      queryBuilder = queryBuilder.order(
        query.order.column,
        { ascending: query.order.ascending ?? true }
      );
    }

    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    return data as T[];
  }

  protected async insert<T>(
    table: string,
    data: Partial<T>
  ): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .single();

    if (error) {
      throw error;
    }

    return result as T;
  }

  protected async update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return result as T;
  }

  protected async delete(
    table: string,
    id: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}
