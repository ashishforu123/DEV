import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio');

    if (!audio) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      text: 'Remove background',
      status: 'success'
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
