export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// API route for RTN (Resultado do Tesouro Nacional) data
// Serves from static JSON file that can be updated by a cron job

export async function GET() {
  try {
    // Try to read the static JSON file
    const filePath = path.join(process.cwd(), 'public', 'data', 'rtn-latest.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      data,
      fromCache: true,
      source: 'static-file',
    });
  } catch {
    // Fallback: return hardcoded data from the static file content
    // This ensures the site never breaks
    return NextResponse.json(
      {
        data: null,
        fromCache: false,
        source: 'error',
        error: 'Arquivo rtn-latest.json não encontrado',
      },
      { status: 200 }
    );
  }
}
