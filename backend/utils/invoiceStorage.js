import { createClient } from '@supabase/supabase-js';

let supabase = null;

const getSupabase = () => {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_API_KEY;

    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized for invoice storage');
    }
  }
  return supabase;
};

const BUCKET_NAME = 'invoice-ocr-uploads';
const AUTO_DELETE_HOURS = 5; // Auto-delete after 5 hours

// Store for scheduled deletions (in-memory)
const scheduledDeletions = new Map();

// Upload base64 file to Supabase Storage
export const uploadInvoiceFile = async (base64Data, mimeType, originalName = 'invoice') => {
  const client = getSupabase();
  if (!client) {
    console.log('⚠️ Supabase not configured, skipping cloud storage');
    return null;
  }

  try {
    // Remove data URL prefix if present
    let cleanBase64 = base64Data;
    if (base64Data.includes('base64,')) {
      cleanBase64 = base64Data.split('base64,')[1];
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(cleanBase64, 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const ext = mimeType === 'application/pdf' ? '.pdf' : '.jpg';
    const fileName = `invoice_${timestamp}_${randomStr}${ext}`;

    // Upload to Supabase
    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      // If bucket doesn't exist, try to create it
      if (error.message.includes('Bucket not found')) {
        console.log('📦 Creating invoice-ocr-uploads bucket...');
        const { error: createError } = await client.storage.createBucket(BUCKET_NAME, {
          public: false,
          fileSizeLimit: 10485760 // 10MB limit
        });

        if (!createError) {
          // Retry upload after creating bucket
          const { data: retryData, error: retryError } = await client.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, {
              contentType: mimeType,
              upsert: false
            });

          if (retryError) {
            console.error('❌ Supabase upload error after bucket creation:', retryError.message);
            return null;
          }

          console.log(`✅ File uploaded to Supabase: ${fileName}`);
          scheduleFileDeletion(fileName);
          return { fileName, path: retryData?.path, bucket: BUCKET_NAME };
        }
      }

      console.error('❌ Supabase upload error:', error.message);
      return null;
    }

    console.log(`✅ File uploaded to Supabase: ${fileName}`);

    // Schedule auto-deletion after 5 hours
    scheduleFileDeletion(fileName);

    return {
      fileName,
      path: data?.path,
      bucket: BUCKET_NAME,
      expiresAt: new Date(Date.now() + AUTO_DELETE_HOURS * 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('❌ Supabase upload failed:', error.message);
    return null;
  }
};

// Delete file from Supabase Storage
export const deleteInvoiceFile = async (fileName) => {
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

// Schedule file deletion after 5 hours
const scheduleFileDeletion = (fileName) => {
  // Clear any existing scheduled deletion for this file
  if (scheduledDeletions.has(fileName)) {
    clearTimeout(scheduledDeletions.get(fileName));
  }

  const delayMs = AUTO_DELETE_HOURS * 60 * 60 * 1000; // 5 hours in milliseconds

  const timeoutId = setTimeout(async () => {
    console.log(`⏰ Auto-deleting invoice file after ${AUTO_DELETE_HOURS} hours: ${fileName}`);
    await deleteInvoiceFile(fileName);
    scheduledDeletions.delete(fileName);
  }, delayMs);

  scheduledDeletions.set(fileName, timeoutId);
  console.log(`⏱️ Scheduled deletion for ${fileName} in ${AUTO_DELETE_HOURS} hours`);
};

// Get signed URL for file access (expires in 1 hour)
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

// Clean up old files (files older than 5 hours) - for manual cleanup
export const cleanupOldFiles = async () => {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data: files, error } = await client.storage
      .from(BUCKET_NAME)
      .list();

    if (error) {
      console.error('❌ Supabase list error:', error.message);
      return;
    }

    const now = Date.now();
    const maxAge = AUTO_DELETE_HOURS * 60 * 60 * 1000;

    for (const file of files || []) {
      const fileTime = new Date(file.created_at).getTime();
      if (now - fileTime > maxAge) {
        await deleteInvoiceFile(file.name);
      }
    }

    console.log('🧹 Invoice storage cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
};

export default {
  uploadInvoiceFile,
  deleteInvoiceFile,
  getSignedUrl,
  cleanupOldFiles
};
