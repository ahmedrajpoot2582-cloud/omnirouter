import { NextResponse } from 'next/server';
import { AVAILABLE_MODELS } from '@/lib/router';

export async function GET() {
  const models = AVAILABLE_MODELS.map((m) => ({
    id: m.id,
    object: 'model',
    created: 1700000000,
    owned_by: m.provider,
    permission: [],
    root: m.id,
    parent: null,
  }));

  return NextResponse.json({
    object: 'list',
    data: models,
  });
}

