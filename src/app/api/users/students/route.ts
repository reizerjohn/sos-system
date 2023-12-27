/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import { hash } from '@app/lib/bcrypt';
import prisma from '@app/lib/prisma';
import { format } from 'date-fns';
import { isEmpty, omit } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  if (!isEmpty(studentId)) {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        idNumber: true,
        student: true,
      },
      where: { id: +studentId },
    });

    const activeSchoolYear = await prisma.schoolYear.findFirst({
      where: { isActive: true },
    });

    const studentClass = await prisma.class.findFirst({
      where: {
        schoolYear: { id: activeSchoolYear.id },
        students: { some: { user: { id: +studentId } } },
      },
    });

    return NextResponse.json({ ...user, class: studentClass });
  } else {
    const search = searchParams.get('search');
    const page = +searchParams.get('page');
    const limit = +searchParams.get('limit');
    const sortBy = searchParams.get('sortBy');
    const orderBy = searchParams.get('orderBy');

    let orderByParams = {};

    if (isEmpty(sortBy) || sortBy === 'name') {
      orderByParams = { lastName: orderBy };
    } else {
      if (sortBy === 'idNumber') {
        orderByParams = { idNumber: orderBy };
      } else if (sortBy === 'gender') {
        orderByParams = { student: { gender: orderBy } };
      } else if (sortBy === 'status') {
        orderByParams = { student: { status: orderBy } };
      }
    }

    if (session?.user) {
      const activeSchoolYear = await prisma.schoolYear.findFirst({
        where: { isActive: true },
      });

      const teacherClassQuery =
        session.user.type === 'teacher'
          ? { student: { classes: { some: { adviserId: +session.user.id, schoolYearId: activeSchoolYear.id } } } }
          : {};

      const studentSearchQuery = [
        { student: { classes: { some: { gradeLevel: { contains: search } } } } },
        { student: { classes: { some: { section: { contains: search } } } } },
        { student: { gender: { contains: search } } },
        { student: { status: { contains: search } } },
      ];

      const searchQuery = !isEmpty(search)
        ? {
            OR: [
              { idNumber: { contains: search } },
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { middleName: { contains: search } },
              ...studentSearchQuery,
            ],
          }
        : {};

      const [students, count] = await prisma.$transaction([
        prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            idNumber: true,
            student: {
              select: {
                id: true,
                status: true,
                gender: true,
                classes: {
                  where: { schoolYear: { id: activeSchoolYear.id } },
                  select: { gradeLevel: true, section: true },
                },
              },
            },
          },
          take: limit,
          skip: (page - 1) * limit,
          where: { ...searchQuery, ...teacherClassQuery, type: 'student' },
          orderBy: orderByParams,
        }),
        prisma.user.count({
          where: { ...searchQuery, ...teacherClassQuery, type: 'student' },
        }),
      ]);

      const formattedStudents = [];

      for (const user of students) {
        const studentFullName = `${user.lastName}, ${user.firstName} ${user.middleName}`;
        const studentClass = user.student.classes[0];

        formattedStudents.push(
          omit({ ...user, fullName: studentFullName, class: studentClass }, 'password', 'student.classes')
        );
      }

      return NextResponse.json({
        users: formattedStudents,
        count,
      });
    }
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const body = await req.json();

    const { idNumber, firstName, lastName, middleName, ...studentData } = body;
    const idNumberExists = await prisma.user.findUnique({ where: { idNumber } });

    if (idNumberExists) {
      return NextResponse.json({ message: 'LRN/ID number already exists' }, { status: 400 });
    }

    const password = await hash(format(new Date(studentData.birthday), 'yyyy-MM-dd'), 10);
    const birthday = new Date(studentData.birthday).toISOString();
    const dateEnrolled = new Date(studentData.dateEnrolled).toISOString();

    const data = {
      type: 'student',
      idNumber,
      firstName,
      lastName,
      middleName,
      password,
      student: { create: { ...studentData, birthday, dateEnrolled } },
    };

    await prisma.user.create({ data });

    return NextResponse.json({ success: true, message: 'Successfully created student' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const body = await req.json();
    const { studentId } = body;

    const student = await prisma.user.findUnique({
      where: { id: +studentId },
    });

    if (student) {
      const { studentId, idNumber, firstName, lastName, middleName, ...studentData } = body;
      const idNumberExists = await prisma.user.findUnique({ where: { idNumber, AND: { NOT: { id: +studentId } } } });

      if (idNumberExists) {
        return NextResponse.json({ message: 'LRN/ID number already exists' }, { status: 400 });
      }

      const password = await hash(format(new Date(studentData.birthday), 'yyyy-MM-dd'), 10);
      const birthday = new Date(studentData.birthday).toISOString();
      const dateEnrolled = new Date(studentData.dateEnrolled).toISOString();

      const data = {
        idNumber,
        firstName,
        lastName,
        middleName,
        password,
        student: { update: { ...studentData, birthday, dateEnrolled } },
      };

      await prisma.user.update({ where: { id: student.id }, data });

      return NextResponse.json({ success: true, message: 'Successfully updated student' });
    }
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('id');

    const user = await prisma.user.findFirst({
      where: { id: +studentId },
    });

    if (user) {
      await prisma.user.delete({ where: { id: user.id } });

      return NextResponse.json({ success: true, message: `Successfully deleted student` });
    }
    return NextResponse.json({ message: 'User not found' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
