"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

type Topic = {
  _id: string;
  name: string;
};

type Room = {
  _id: string;
  name: string;
  topics: Topic[];
  participants: User[];
  host: User;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  _id: string;
  text: string;
  user: User;
  room: Room; // Room ID
  createdAt: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  image: string;
};

interface RoomsProps {
  user?: User;
}

const Room: React.FC<RoomsProps> = ({ user }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isParticipant, setIsParticipant] = useState<boolean>(false); // Boolean for participant check
  const pathname = usePathname();
  const id = pathname?.split("/").pop(); // Extract the `id` from the URL

  useEffect(() => {
    if (!id) return; // Wait until `id` is available

    // Fetch room details
    const fetchRoom = async () => {
      try {
        const res = await fetch("/api/rooms/");
        const data = await res.json();

        // Filter out the room with the required id
        const foundRoom = data.data.find((room: Room) => room._id === id);
        setRoom(foundRoom || null);

        if (foundRoom && user) {
          console.log(foundRoom.participants);
          // Check if the user is in the participants list
          setIsParticipant(
            foundRoom.participants.some(
              (participant: User) => participant._id === user._id,
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    // Fetch all messages and filter for the current room
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();

        // Filter and sort messages by room ID
        const roomMessages = data.data
          .filter((message: Message) => message.room._id === id)
          .sort(
            (a: Message, b: Message) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

        setMessages(roomMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchRoom();
    fetchMessages();
  }, [id, user]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message submitted");
  };

  return (
    <div className="px-5 py-4">
      {room ? (
        <>
          <div className="mb-4">
            <div className="flex max-h-9 items-center justify-between">
              <p className="text-[25px] text-main">{room.name}</p>
              <p className="text-[15px] text-light-gray">
                {formatDistanceToNow(new Date(room.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <p className="my-2.5 text-[13px] uppercase text-gray">hosted by</p>
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 no-underline"
            >
              <Image
                src={room.host.image}
                alt="host-profile-image"
                width={32}
                height={32}
                className="rounded-full border-2 border-main"
              />
              <p className="text-main">@{room.host.name}</p>
            </Link>
            <div className="flex items-center justify-between gap-3">
              <div className="flex">
                {room.topics.map((topic) => (
                  <p
                    key={topic._id}
                    className="rounded-3xl bg-dark-light px-3 py-2 text-light"
                  >
                    {topic.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="relative max-h-[360px] min-h-[360px] overflow-y-auto rounded-lg bg-bg px-5 pt-5">
            {isParticipant ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className="mb-8 border-l-2 border-dark px-4"
                  >
                    <div className="mb-2.5 flex w-full items-center justify-between">
                      <Link
                        href="/"
                        className="mb-1 flex items-center gap-2 no-underline"
                      >
                        <Image
                          src={message.user.image}
                          alt="profile-image"
                          height={28}
                          width={28}
                          className="rounded-full border-2 border-main"
                        />
                        <p className="m-0 text-[14px] text-main">
                          @{message.user.name}
                        </p>
                      </Link>
                      <p className="text-[14px] text-light-gray">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <p className="text-[14px] text-light-gray">
                      {message.text}
                    </p>
                  </div>
                ))}
                <form
                  action=""
                  onSubmit={(e) => handleMessageSubmit(e)}
                  className="sticky z-10 w-full bg-bg pt-4"
                >
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="text"
                      placeholder="Write your message here..."
                      className="ml-[-20px] w-[calc(100%+40px)] rounded-t border border-dark bg-dark-light px-4 py-3 text-light placeholder:text-light"
                    />
                    <button
                      type="submit"
                      className="absolute right-2.5 mr-[-10px] flex h-12 w-12 cursor-pointer items-center justify-center rounded-tr border-none bg-dark text-light"
                    >
                      <Image
                        src="/send.svg"
                        alt="send"
                        width={25}
                        height={25}
                      />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <p>Login to see the content of the room</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading room details...</p>
      )}
    </div>
  );
};

export default Room;
