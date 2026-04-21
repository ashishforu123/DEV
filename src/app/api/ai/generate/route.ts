import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await req.json();

    // Simulating background generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockBg = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80`;

    return NextResponse.json({
      backgroundImage: mockBg,
      status: 'success'
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
