import { NextResponse } from 'next/server';
import rga from '@/controllers/rga';

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    const result = await rga(question);
    
    return NextResponse.json({ answer: result.answer });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
