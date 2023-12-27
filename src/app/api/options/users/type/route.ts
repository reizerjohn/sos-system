import { NextResponse } from 'next/server';

const userTypes = ['administrator', 'teacher'];

export async function GET() {
  let options = userTypes.map((t) => ({ value: t, label: t }));

  return NextResponse.json({ options });
}
