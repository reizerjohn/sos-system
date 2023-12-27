/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (session?.user) {
    const userType = session.user.type;
    const userIdData = userType === 'administrator' ? +userId : session.user.id;

    const chat = await prisma.chat.findUnique({
      where: { userId: userIdData },
      include: { user: true, messages: true },
    });

    if (userType === 'administrator') {
      await prisma.chat.update({
        where: { id: chat.id },
        data: { lastReadId: chat.messages[chat.messages.length - 1].id },
      });
    }

    return NextResponse.json(chat);
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session?.user) {
    const userType = session.user.type;
    const body = await req.json();

    if (userType === 'administrator' && body.userId) {
      const userId = body.userId;
      const messageData = { message: body.message, type: 'admin' };

      await prisma.chat.upsert({
        where: { userId },
        create: { userId, messages: { create: messageData } },
        update: { updatedAt: new Date(), messages: { create: messageData } },
      });
    } else if (userType === 'student') {
      const userId = session.user.id;
      const messageData = { message: body.message, type: 'user' };

      await prisma.chat.upsert({
        where: { userId },
        create: { userId, messages: { create: messageData } },
        update: { updatedAt: new Date(), messages: { create: messageData } },
      });
    }

    return NextResponse.json({ message: 'Message sent' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
