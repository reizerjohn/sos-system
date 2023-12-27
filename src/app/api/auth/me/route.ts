/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import { hash } from '@app/lib/bcrypt';
import prisma from '@app/lib/prisma';
import { omit } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user) {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        idNumber: true,
        type: true,
        student: true,
      },
      where: { id: session.user.id },
    });

    const activeSchoolYear = await prisma.schoolYear.findFirst({
      where: { isActive: true },
    });

    let userClass = null;

    if (user.type === 'teacher') {
      userClass = await prisma.class.findFirst({
        where: { schoolYear: { id: activeSchoolYear.id }, adviser: { id: user.id } },
        include: { adviser: true },
      });
    } else if (user.type === 'student') {
      userClass = await prisma.class.findFirst({
        where: { schoolYear: { id: activeSchoolYear.id }, students: { some: { id: +user.student.id } } },
        include: { adviser: true },
      });
    }

    const adviser = userClass?.adviser ? omit(userClass.adviser, 'password') : null;
    const adviserName = adviser ? `${adviser.lastName}, ${adviser.firstName} ${adviser.middleName}` : null;

    return NextResponse.json({
      ...user,
      class: { ...userClass, adviser: adviserName },
      schoolYear: activeSchoolYear.year,
    });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user) {
    const { password } = await req.json();

    const hashedPassword = await hash(password);
    await prisma.user.update({ where: { id: session.user.id }, data: { password: hashedPassword } });

    return NextResponse.json({ success: true, message: 'Successfully updated profile' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
