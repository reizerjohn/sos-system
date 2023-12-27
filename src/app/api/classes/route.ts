/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty, omit } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');

  const activeSchoolYear = await prisma.schoolYear.findFirst({
    where: { isActive: true },
  });

  if (session?.user?.type === 'administrator') {
    if (!isEmpty(classId)) {
      const classData = await prisma.class.findFirst({
        where: { id: +classId, schoolYearId: activeSchoolYear.id },
        include: { adviser: true, students: { include: { user: true } }, schoolYear: true },
      });

      if (!classData) {
        return NextResponse.json({ message: 'Class not found' }, { status: 400 });
      }

      const classAdviser = classData.adviser;
      const adviserName = classAdviser
        ? `${classAdviser.lastName}, ${classAdviser.firstName} ${classAdviser.middleName}`
        : 'None';
      const adviser = classAdviser ? { value: classData.adviser.id, label: adviserName } : null;

      const students = classData.students.map((s) => ({
        value: s.userId,
        label: `${s.user.lastName}, ${s.user.firstName} ${s.user.middleName}`,
      }));
      const schoolYearValue = { value: classData.schoolYear.id, label: classData.schoolYear.year };

      return NextResponse.json(omit({ ...classData, schoolYear: schoolYearValue, adviser, students }, 'adviserId'));
    } else {
      const search = searchParams.get('search');
      const page = +searchParams.get('page');
      const limit = +searchParams.get('limit');
      const sortBy = searchParams.get('sortBy');
      const orderBy = searchParams.get('orderBy');

      let orderByParams = {};

      if (isEmpty(sortBy) || sortBy === 'name') {
        orderByParams = { id: orderBy };
      } else {
        if (sortBy === 'gradeLevel') {
          orderByParams = { gradeLevel: orderBy };
        } else if (sortBy === 'section') {
          orderByParams = { section: orderBy };
        } else if (sortBy === 'adviser') {
          orderByParams = { adviser: { lastName: orderBy } };
        }
      }

      const searchQuery = !isEmpty(search)
        ? {
            OR: [
              { gradeLevel: { contains: search } },
              { section: { contains: search } },
              { adviser: { firstName: { contains: search } } },
              { adviser: { lastName: { contains: search } } },
              { adviser: { middleName: { contains: search } } },
            ],
          }
        : {};

      const [classes, count] = await prisma.$transaction([
        prisma.class.findMany({
          select: {
            id: true,
            gradeLevel: true,
            section: true,
            schoolYear: true,
            adviser: { select: { firstName: true, lastName: true, middleName: true } },
          },
          take: limit,
          skip: (page - 1) * limit,
          where: { ...searchQuery, schoolYear: { id: activeSchoolYear.id } },
          orderBy: orderByParams,
        }),
        prisma.class.count({
          where: { ...searchQuery, schoolYear: { id: activeSchoolYear.id } },
        }),
      ]);

      const formatClasses = classes.map((c) =>
        omit(
          {
            ...c,
            adviserName: c.adviser ? `${c.adviser.lastName}, ${c.adviser.firstName} ${c.adviser.middleName}` : 'None',
          },
          'adviser'
        )
      );
      return NextResponse.json({ classes: formatClasses, count });
    }
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  const activeSchoolYear = await prisma.schoolYear.findFirst({
    where: { isActive: true },
  });

  if (session?.user?.type === 'administrator') {
    const { gradeLevel, section, adviserId, studentIds } = await req.json();

    // Validate if there's existing gradeLevel and section
    const dataExist = await prisma.class.findFirst({
      where: { gradeLevel: { equals: gradeLevel }, section: { equals: section } },
    });

    if (!dataExist) {
      const getStudentIds = await prisma.student.findMany({
        select: { id: true },
        where: { userId: { in: studentIds } },
      });

      await prisma.class.create({
        data: {
          gradeLevel,
          section,
          adviserId,
          schoolYearId: activeSchoolYear.id,
          students: {
            connect: getStudentIds,
          },
        },
      });

      return NextResponse.json({ success: true, message: 'Successfully created class' });
    }
    return NextResponse.json(
      { success: false, message: 'Class grade level and section already exist' },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { classId, gradeLevel, section, adviserId, studentIds } = await req.json();

    const getStudentIds = await prisma.student.findMany({
      select: { id: true },
      where: { userId: { in: studentIds } },
    });

    await prisma.class.update({
      where: { id: +classId },
      data: {
        gradeLevel,
        section,
        adviserId,
        students: {
          set: [],
          connect: getStudentIds,
        },
      },
    });

    return NextResponse.json({ success: true, message: 'Successfully updated class' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('id');

    const classData = await prisma.class.findUnique({
      where: { id: +classId },
    });

    if (classData) {
      await prisma.class.delete({ where: { id: +classId } });

      return NextResponse.json({ success: true, message: 'Successfully deleted class' });
    }
    return NextResponse.json({ message: 'Class not found' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
