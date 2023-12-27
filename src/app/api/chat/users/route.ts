/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from '@app/lib/auth';
import prisma from '@app/lib/prisma';
import { isEmpty } from 'lodash';
import { NextResponse, type NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  if (session?.user && session.user.type === 'administrator') {
    let data = [];
    const chatList = await prisma.chat.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { user: true, messages: { orderBy: { id: 'desc' } } },
    });

    if (!isEmpty(search)) {
      const users = await prisma.user.findMany({
        where: {
          type: 'student',
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { middleName: { contains: search } },
          ],
        },
      });

      const usersWithChatData = users.map((u) => {
        const userChat = chatList.find((c) => c.userId === u.id);

        return {
          id: u.id,
          name: `${u.lastName}, ${u.firstName} ${u.middleName}`,
          lastMessage: userChat ? userChat.messages[0].message || userChat.messages[0].attachmentName : '',
          unreadCount: userChat ? getUnreadCount(userChat.messages, userChat.lastReadId) : 0,
          timestamp: userChat ? userChat.messages[0].createdAt : null,
        };
      });

      data = usersWithChatData;
    } else {
      data = chatList.map((c) => ({
        id: c.userId,
        name: `${c.user.lastName}, ${c.user.firstName} ${c.user.middleName}`,
        lastMessage: c.messages[0].message || c.messages[0].attachmentName,
        unreadCount: getUnreadCount(c.messages, c.lastReadId),
        timestamp: c.messages[0].createdAt,
      }));
    }

    return NextResponse.json(data);
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

const getUnreadCount = (messages = [], lastReadId) => {
  const reverseOrder = [...messages].reverse();
  const indexOfLastRead = reverseOrder.findIndex((m) => m.id === lastReadId);
  return (indexOfLastRead === 0 ? messages.length : messages.length - indexOfLastRead) - 1;
};
