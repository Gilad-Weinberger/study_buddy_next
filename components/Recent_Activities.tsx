"use client";

import { User } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";

type Topic = {
  _id: string;
  name: string;
};
type Room = {
  _id: string;
  name: string;
  topics: Topic[];
  participants: User[];
  host: string;
  createdAt: string;
  updatedAt: string;
};
type Message = {
  _id: string;
  room: Room;
  user: User;
  text: string;
  createdAt: string;
  updatedAt: string;
};

interface RecentActivitiesProps {
  user?: User;
}

const Recent_Activities: React.FC<RecentActivitiesProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();

        // Sort and limit to the most recent 3 messages
        const sortedMessages = data.data
          .sort(
            (a: Message, b: Message) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        setMessages(sortedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  return (
    <div className="bg-dark max-h-[620px] w-[20vw] rounded">
      <p className="text-light bg-dark-light m-0 rounded-t px-4 py-2.5">
        Recent Activities
      </p>
      {user ? (
        <div className="flex flex-col items-start gap-4 p-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className="border-dark-medium w-full rounded border p-4"
            >
              <Link
                href="/"
                className="mb-1 flex items-center gap-2.5 no-underline"
              >
                <Image
                  src="/logo.png"
                  alt="profile-image"
                  height={32}
                  width={32}
                  className="border-main rounded-full border-2"
                />
                <div>
                  <p className="text-main m-0">@{message.user.name}</p>
                  <p className="text-gray m-0 text-[13px]">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>
              <p className="text-light-gray m-0 ml-11 text-[14px]">
                in the room:
              </p>
              <Link
                href="/"
                className="text-main hover:border-main m-0 ml-11 text-[14px] hover:border-b"
              >
                {`"${message.room.name}"`}
              </Link>
              <p className="bg-bg text-light mt-2 w-full rounded-md px-3 py-2 text-[14px] font-extralight">
                {message.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="align max-w-[75%] text-center text-[18px] text-white">
            Please log in to see activities.
          </p>
        </div>
      )}
    </div>
  );
};

export default Recent_Activities;
