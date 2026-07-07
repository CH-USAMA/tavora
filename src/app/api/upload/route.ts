import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/shared/lib/auth'; // Ensure only authenticated admins can upload

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // This runs on the server before the client uploads the file to Vercel Blob
        
        // 1. Check for authentication (Optional but highly recommended)
        // In a real app, verify the user is logged in and is an admin here.
        // If not authenticated, throw an error.

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB limit
          tokenPayload: JSON.stringify({
            // Any custom data you want to associate with the token
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Runs on the server after the upload is complete
        console.log('Blob upload completed', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
