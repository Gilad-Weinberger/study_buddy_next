"use client";

import { User } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

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
    <div className="max-h-[620px] w-[20vw] rounded bg-dark">
      <p className="m-0 rounded-t bg-dark-light px-4 py-2.5 text-light">
        Recent Activities
      </p>
      {user ? (
        <div className="flex flex-col items-start gap-4 p-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className="w-full rounded border border-dark-medium p-4"
            >
              <Link
                href="/"
                className="mb-1 flex items-center gap-2.5 no-underline"
              >
                <Image
                  src={message.user.image || "/user.svg"}
                  alt="profile-image"
                  height={32}
                  width={32}
                  className="rounded-full border-2 border-main"
                />
                <div>
                  <p className="m-0 text-main">@{message.user.name}</p>
                  <p className="m-0 text-[13px] text-gray">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>
              <p className="m-0 ml-11 text-[14px] text-light-gray">
                in the room:
              </p>
              <Link
                href="/"
                className="m-0 ml-11 text-[14px] text-main hover:border-b hover:border-main"
              >
                {`"${message.room.name}"`}
              </Link>
              <p className="mt-2 w-full rounded-md bg-bg px-3 py-2 text-[14px] font-extralight text-light">
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
