/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty } from 'lodash';
import { NextResponse, NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');

  if (session?.user?.type === 'administrator' && !isEmpty(subjectId)) {
    const subject = await prisma.subjects.findUnique({ where: { id: +subjectId } });

    return NextResponse.json(subject);
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { subjectName } = await req.json();

    if (isEmpty(subjectName)) {
      return NextResponse.json({ message: 'Subject name not found' }, { status: 400 });
    }

    const subjectExist = await prisma.subjects.findUnique({ where: { name: subjectName } });

    if (subjectExist) {
      return NextResponse.json({ message: 'Subject name already exists' }, { status: 400 });
    }

    await prisma.subjects.create({ data: { name: subjectName } });

    return NextResponse.json({ success: true, message: 'Successfully created subject' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user?.type === 'administrator') {
    const { subjectId, subjectName } = await req.json();

    if (isEmpty(subjectName)) {
      return NextResponse.json({ message: 'Subject name not found' }, { status: 400 });
    }

    const subjectExist = await prisma.subjects.findUnique({ where: { name: subjectName, NOT: { id: subjectId } } });

    if (subjectExist) {
      return NextResponse.json({ message: 'Subject name already exists' }, { status: 400 });
    }

    await prisma.subjects.update({ where: { id: subjectId }, data: { name: subjectName } });

    return NextResponse.json({ success: true, message: 'Successfully updated subject' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('id');

  if (session?.user?.type === 'administrator') {
    const subject = await prisma.subjects.findUnique({ where: { id: +subjectId } });

    if (!subject) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 400 });
    }

    await prisma.subjects.delete({ where: { id: +subjectId } });

    return NextResponse.json({ success: true, message: 'Successfully deleted subject' });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
