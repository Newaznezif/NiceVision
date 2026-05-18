import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize admin client to bypass RLS restrictions for server actions
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const bucketName = 'nicevision-uploads';

  // Ensure the bucket exists
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucketName);

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/*'],
      });
      if (createError) {
        console.error('Error creating storage bucket:', createError.message);
      }
    }
  } catch (err) {
    console.error('Bucket check failed, attempting upload anyway:', err);
  }

  // Generate safe unique filename
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
  const filename = `${Date.now()}-${safeName}`;
  const fileExt = safeName.split('.').pop() || 'jpeg';
  const contentType = file.type || `image/${fileExt}`;

  // Upload file buffer to Supabase Storage
  const { error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error.message);
    throw new Error(`Failed to upload image to cloud storage: ${error.message}`);
  }

  // Get public CDN URL
  const { data: urlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(filename);

  if (!urlData || !urlData.publicUrl) {
    throw new Error('Failed to retrieve public URL for uploaded file.');
  }

  return urlData.publicUrl;
}
