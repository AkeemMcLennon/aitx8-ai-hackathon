import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received data for text overlay:', data);
    // TODO: Implement text overlay logic
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error('Text overlay error:', error);
    return NextResponse.json({ error: 'Failed to overlay text' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

