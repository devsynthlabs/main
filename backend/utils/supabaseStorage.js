import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

let supabase = null;

const getSupabase = () => {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_API_KEY;

    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized');
    }
  }
  return supabase;
};

const BUCKET_NAME = 'fraud-detection-uploads';

// Upload file to Supabase Storage (Private bucket)
export const uploadToSupabase = async (filePath, originalName) => {
  const client = getSupabase();
  if (!client) {
    console.log('⚠️ Supabase not configured, using local storage');
    return null;
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const timestamp = Date.now();
    const ext = path.extname(originalName);
    const fileName = `${timestamp}_${Math.random().toString(36).substr(2, 9)}${ext}`;

    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: getContentType(ext),
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error.message);
      return null;
    }

    console.log(`✅ File uploaded to Supabase (private): ${fileName}`);

    // Schedule deletion after 12 hours
    scheduleFileDeletion(fileName, 12 * 60 * 60 * 1000);

    return {
      fileName,
      path: data.path,
      bucket: BUCKET_NAME
    };
  } catch (error) {
    console.error('❌ Supabase upload failed:', error.message);
    return null;
  }
};

// Get signed URL for private file access (expires in 1 hour)
export const getSignedUrl = async (fileName, expiresIn = 3600) => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, expiresIn);

    if (error) {
      console.error('❌ Signed URL error:', error.message);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('❌ Signed URL failed:', error.message);
    return null;
  }
};

// Delete file from Supabase Storage
export const deleteFromSupabase = async (fileName) => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error('❌ Supabase delete error:', error.message);
      return false;
    }

    console.log(`🗑️ File deleted from Supabase: ${fileName}`);
    return true;
  } catch (error) {
    console.error('❌ Supabase delete failed:', error.message);
    return false;
  }
};

// Schedule file deletion after specified time
const scheduledDeletions = new Map();

export const scheduleFileDeletion = (fileName, delayMs = 12 * 60 * 60 * 1000) => {
  // Clear any existing scheduled deletion for this file
  if (scheduledDeletions.has(fileName)) {
    clearTimeout(scheduledDeletions.get(fileName));
  }

  const timeoutId = setTimeout(async () => {
    console.log(`⏰ Auto-deleting file after 12 hours: ${fileName}`);
    await deleteFromSupabase(fileName);
    scheduledDeletions.delete(fileName);
  }, delayMs);

  scheduledDeletions.set(fileName, timeoutId);
  console.log(`⏱️ Scheduled deletion for ${fileName} in ${delayMs / 1000 / 60 / 60} hours`);
};

// Get content type based on file extension
const getContentType = (ext) => {
  const types = {
    '.pdf': 'application/pdf',
    '.csv': 'text/csv',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel'
  };
  return types[ext.toLowerCase()] || 'application/octet-stream';
};

// List all files in bucket (for admin/debugging)
export const listFiles = async () => {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .list();

    if (error) {
      console.error('❌ Supabase list error:', error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error('❌ Supabase list failed:', error.message);
    return [];
  }
};

// Clean up old files (files older than 12 hours)
export const cleanupOldFiles = async () => {
  const client = getSupabase();
  if (!client) return;

  try {
    const files = await listFiles();
    const now = Date.now();
    const maxAge = 12 * 60 * 60 * 1000; // 12 hours

    for (const file of files) {
      const fileTime = new Date(file.created_at).getTime();
      if (now - fileTime > maxAge) {
        await deleteFromSupabase(file.name);
      }
    }

    console.log('🧹 Cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
};

export default {
  uploadToSupabase,
  deleteFromSupabase,
  getSignedUrl,
  scheduleFileDeletion,
  listFiles,
  cleanupOldFiles
};
