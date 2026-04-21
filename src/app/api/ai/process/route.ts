import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      processedImage: image,
      mask: null,
      status: 'success',
      message: 'Image processed successfully (Simulation mode)'
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
