/* eslint-disable @typescript-eslint/no-unused-vars */
import { gradeLevel } from '@app/constants/defaults';
import { getServerSession } from '@app/lib/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search');

  if (session?.user) {
    let options = gradeLevel.map((d) => ({ value: d, label: d }));
    options = options.filter((d) => d.value.includes(search));

    return NextResponse.json({ options, count: options.length });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
