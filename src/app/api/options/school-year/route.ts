/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search');

  if (session?.user) {
    const schoolYears = await prisma.schoolYear.findMany();

    let options = schoolYears.map((d) => ({ value: d.year, label: d.year }));
    options = options.filter((d) => d.label.includes(search));

    return NextResponse.json({ options, count: options.length });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
