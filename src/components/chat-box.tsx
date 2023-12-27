/* eslint-disable max-len */
'use client';

import { isEmpty } from 'lodash';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { ChatList, MessageList } from 'react-chat-elements';
import { clientApi, clientDownloadApi } from '@app/lib/api';
import { mdiAttachment, mdiClose, mdiMagnify, mdiSend } from '@mdi/js';
import Icon from '@mdi/react';
import LoadingThreeDots from './loading/three-dots';

export type ChatTypes = 'text' | 'photo';

const ChatBox = () => {
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState('');
  const [chatData, setChatData] = useState(null);
  const { data: session } = useSession();
  const inputUploadRef = useRef<any>();
  const inputTextboxRef = useRef<any>();
  const messageBoxRef = useRef<any>();
  const userType = session?.user?.type;
  const isAdmin = userType === 'administrator';

  const fetchUsersList = async () => {
    setIsUsersLoading(true);

    const res = await clientApi.get('chat/users', { params: { search } });

    const formattedUsers = res.data.map((u) => ({
      id: u.id,
      avatar: '',
      alt: u.name[0],
      title: u.name,
      subtitle: u.lastMessage,
      unread: u.unreadCount,
      date: u.timestamp,
      className: 'hover:bg-red',
    }));

    setUsers(formattedUsers);
    setIsUsersLoading(false);
  };

  const fetchChatData = async () => {
    setIsMessageLoading(true);

    const userId = userType === 'administrator' ? { userId: selectedUserId } : {};
    const res = await clientApi.get('chat', { params: { ...userId } });

    setChatData(res.data);
    setIsMessageLoading(false);
  };

  const setChatMessages = () => {
    if (isEmpty(chatData)) {
      return setMessages([]);
    }

    const formattedChatData = chatData.messages.map((c) => {
      const { id, userId, user } = chatData;
      const { id: messageId, type, messageType, message, attachment, attachmentName, attachmentType, timestamp } = c;

      const position =
        (type === 'user' && userType === 'administrator') || (type === 'admin' && userType === 'student')
          ? 'left'
          : 'right';
      const name = type === 'user' ? `${user.lastName}, ${user.firstName} ${user.middleName}` : 'Treasury and Finance';
      const fileData = attachment
        ? { data: { name: attachmentName, type: attachmentType }, status: { click: false, loading: 0 } }
        : {};
      const text = attachment ? attachmentName : message;

      return { id, messageId, userId, position, type: messageType, title: name, text, date: timestamp, data: fileData };
    });

    setMessages(formattedChatData);
  };

  const handleSubmit = async () => {
    setIsMessageLoading(true);

    try {
      const userType = session.user.type;
      const userId = userType === 'administrator' ? { userId: selectedUserId } : {};

      if (attachment) {
        const formData = new FormData();
        formData.append('attachment', attachment);

        if (userType === 'administrator') {
          formData.append('userId', selectedUserId);
        }

        await clientApi.post('chat/attachment', formData);
      } else if (!isEmpty(message)) {
        await clientApi.post('chat', { message, ...userId });
      }

      resetInput();
      setIsMessageLoading(false);

      fetchChatData();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadAttachment = async (e) => {
    try {
      const { id: chatId, messageId } = e;
      const { name, type } = e.data.data;

      const res = await clientDownloadApi.get('chat/attachment', { params: { chatId, messageId } });
      const blob = new Blob([res.data], { type });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = name;
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  const selectUser = (e) => {
    setSelectedUserId(e.id);
    const userChat = users.find((u) => u.id === e.id);
    userChat.unread = 0;
  };

  const resetInput = () => {
    setAttachment(null);
    inputTextboxRef.current.value = '';
  };

  useEffect(() => {
    if (!isEmpty(session)) {
      if (userType === 'administrator') {
        fetchUsersList();
      } else {
        setChatMessages();
      }
    }
  }, [session]);

  useEffect(() => {
    setChatMessages();
  }, [chatData]);

  useEffect(() => {
    if (userType === 'administrator') {
      fetchUsersList();
    }
  }, [search]);

  useEffect(() => {
    if (userType === 'student' || selectedUserId) {
      fetchChatData();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (attachment) {
      inputTextboxRef.current.value = attachment.name;
    }
  }, [attachment]);

  useEffect(() => {
    if (messages.length > 0) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex flex-col ${isAdmin ? 'mx-20' : 'mx-32'}`}>
      <div className='text-center mb-5'>
        <h1 className='text-3xl pb-2'>{isAdmin ? 'Student Messages' : 'Message History'}</h1>
        {userType === 'student' && (
          <p className='px-20 text-sm text-gray-700'>
            Send a direct message to the Treasury Department. You may use this messaging service to send your concerns
            to our Treasury and Finance such as your proof of payments remitted to accredited payment gateways and
            account inquiries.
          </p>
        )}
      </div>
      <div className='flex flex-row'>
        {userType === 'administrator' && (
          <div className='flex flex-col w-4/12 align bg-white border-r border-gray-100 rounded-lg rounded-r-none'>
            <div className='py-3 px-5 border-b border-gray-100'>
              <div className='flex flex-row items-center px-3 rounded-full border'>
                <Icon className='text-gray-700' path={mdiMagnify} size={1} />
                <input
                  name='search'
                  type='text'
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-full rounded-full py-2 px-3 focus:outline-none'
                />
              </div>
            </div>
            {isUsersLoading ? (
              <div className='h-[550px] bg-white'>
                <LoadingThreeDots />
              </div>
            ) : (
              <ChatList
                id={'chat-list'}
                lazyLoadingImage={''}
                className='chat-list h-[550px] rounded-l-lg '
                dataSource={users}
                onClick={selectUser}
              />
            )}
          </div>
        )}

        <div className={`bg-white rounded-lg ${isAdmin ? 'w-8/12 rounded-l-none' : 'w-full'}`}>
          {isMessageLoading ? (
            <div className={`h-[550px] bg-white rounded-lg rounded-b-none ${isAdmin && 'rounded-l-none'}`}>
              <LoadingThreeDots />
            </div>
          ) : userType === 'administrator' && !selectedUserId ? (
            <div className={`h-[550px] bg-white rounded-lg rounded-b-none ${isAdmin && 'rounded-l-none'}`}>
              <p className='text-center p-7 text-gray-600 italic self-stretch'>Select a conversation...</p>
            </div>
          ) : (
            <MessageList
              referance={messageBoxRef}
              className={`message-list h-[550px] rounded-lg rounded-b-none bg-white p-5 ${isAdmin && 'rounded-l-none'}`}
              lockable={true}
              toBottomHeight={'100%'}
              dataSource={messages}
              onDownload={downloadAttachment}
            />
          )}
          <div className='flex flex-row'>
            <div
              className={`flex flex-row w-full bg-slate-50 p-3 px-5 rounded-b-lg space-x-5 ${
                isAdmin && 'rounded-bl-none'
              }`}
            >
              <input
                name='message'
                type='text'
                disabled={attachment || isMessageLoading || (userType === 'administrator' && !selectedUserId)}
                ref={inputTextboxRef}
                className={`grow mr-3 rounded-b-lg text-gray-800 p-2.5 focus:outline-none bg-slate-50 ${
                  isAdmin && 'rounded-bl-none'
                }`}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  e.key === 'Enter' && handleSubmit();
                }}
                placeholder='Send a message'
              />
              <input
                type='file'
                disabled={isMessageLoading}
                onChange={(event) => setAttachment(event.target.files[0])}
                hidden
                ref={inputUploadRef}
              />
              {attachment && (
                <button
                  className='flex flex-row items-center rounded-full px-2 text-gray-700 hover:text-gray-900'
                  onClick={() => resetInput()}
                >
                  <Icon path={mdiClose} size={0.8} />
                </button>
              )}
              <button
                className='flex flex-row items-center rounded-full px-2 text-gray-700 hover:bg-gray-200'
                onClick={() => inputUploadRef.current.click()}
                disabled={isMessageLoading || (userType === 'administrator' && !selectedUserId)}
              >
                <Icon path={mdiAttachment} size={1.3} />
              </button>
              <button
                className='flex flex-row items-center bg-lightBlue-500 hover:bg-lightBlue-600 text-white py-1 px-2 rounded-md'
                type='button'
                onClick={handleSubmit}
                disabled={isMessageLoading || (userType === 'administrator' && !selectedUserId)}
              >
                Send&nbsp;
                <Icon path={mdiSend} size={0.8} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
