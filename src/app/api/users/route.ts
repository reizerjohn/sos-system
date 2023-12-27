/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import { hash } from '@app/lib/bcrypt';
import prisma from '@app/lib/prisma';
import { isEmpty, omit } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!isEmpty(userId)) {
    const user = await prisma.user.findUnique({
      where: { id: +userId },
    });

    const userType = { label: user.type, value: user.type };

    return NextResponse.json(omit({ ...user, type: userType }, 'password'));
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
      } else if (sortBy === 'type') {
        orderByParams = { type: orderBy };
      }
    }

    if (session?.user) {
      const searchQuery = !isEmpty(search)
        ? {
            OR: [
              { idNumber: { contains: search } },
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { middleName: { contains: search } },
            ],
          }
        : {};

      const [users, count] = await prisma.$transaction([
        prisma.user.findMany({
          take: limit,
          skip: (page - 1) * limit,
          where: { ...searchQuery, type: 'teacher' },
          orderBy: orderByParams,
        }),
        prisma.user.count({
          where: { ...searchQuery, type: 'teacher' },
        }),
      ]);

      const formattedUsers = users.map((u) => ({
        ...omit(u, ['password', 'userId']),
        fullName: `${u.lastName}, ${u.firstName} ${u.middleName}`,
      }));

      return NextResponse.json({
        users: formattedUsers,
        count,
      });
    }
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { idNumber, password, ...body } = await req.json();

    const idNumberExists = await prisma.user.findUnique({ where: { idNumber } });

    if (idNumberExists) {
      return NextResponse.json({ message: 'LRN/ID number already exists' }, { status: 400 });
    }

    const hashedPassword = await hash(password);
    await prisma.user.create({ data: { ...body, idNumber, password: hashedPassword, type: 'teacher' } });

    return NextResponse.json({ success: true, message: 'Successfully created user' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { userId, idNumber, password, ...body } = await req.json();
    const hashedPassword = !isEmpty(password) ? await hash(password) : undefined;

    const user = await prisma.user.findUnique({
      where: { id: +userId },
    });

    const idNumberExists = await prisma.user.findUnique({ where: { idNumber, AND: { NOT: { id: +userId } } } });

    if (user) {
      if (idNumberExists) {
        return NextResponse.json({ message: 'LRN/ID number already exists' }, { status: 400 });
      }

      await prisma.user.update({ where: { id: user.id }, data: { ...body, idNumber, password: hashedPassword } });
      return NextResponse.json({ success: true, message: 'Successfully updated user' });
    }
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    const user = await prisma.user.findUnique({
      where: { id: +userId },
    });

    if (user) {
      await prisma.user.delete({ where: { id: +userId } });

      return NextResponse.json({ success: true, message: 'Successfully deleted user' });
    }
    return NextResponse.json({ message: 'User not found' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
