/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty } from 'lodash';
import { NextResponse, type NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');
  const messageId = searchParams.get('messageId');

  if (session?.user && !isEmpty(chatId) && !isEmpty(messageId)) {
    const userType = session.user.type;
    const chat = await prisma.chat.findUniqueOrThrow({ where: { id: +chatId }, include: { messages: true } });

    if (!isEmpty(chat) && (userType === 'administrator' || chat.userId === session.user.id)) {
      const chatMessage = chat.messages.find((m) => m.id === +messageId);
      const { attachment, attachmentName, attachmentType } = chatMessage;

      return new Response(attachment, {
        headers: {
          'content-type': attachmentType,
          'content-disposition': `attachment; filename="${attachmentName}"`,
        },
      });
    }

    return NextResponse.json({ message: 'Success' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (session.user) {
    const userType = session.user.type;
    const formData = await req.formData();
    const attachment = formData.get('attachment') as Blob;
    const attachmentBuffer = await attachment.arrayBuffer();

    if (userType === 'administrator') {
      const userId = formData.get('userId') as string;
      const messageData = {
        type: 'admin',
        messageType: 'file',
        attachment: Buffer.from(attachmentBuffer),
        attachmentName: attachment.name,
        attachmentType: attachment.type,
      };

      await prisma.chat.upsert({
        where: { userId: +userId },
        create: { userId: +userId, messages: { create: messageData } },
        update: { updatedAt: new Date(), messages: { create: messageData } },
      });
    } else if (userType === 'student') {
      const userId = session.user.id;
      const messageData = {
        type: 'user',
        messageType: 'file',
        attachment: Buffer.from(attachmentBuffer),
        attachmentName: attachment.name,
        attachmentType: attachment.type,
      };

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