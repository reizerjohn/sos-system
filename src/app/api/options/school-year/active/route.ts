/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@app/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const schoolYear = await prisma.schoolYear.findFirst({
    where: { isActive: true },
  });

  let option = { value: schoolYear.id, label: schoolYear.year };

  return NextResponse.json({ option });
}
