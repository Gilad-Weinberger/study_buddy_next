"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { User as AuthUser } from "@auth/core/types";
import Image from "next/image";

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

interface User extends AuthUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

const Participants = () => {
  const [participants, setParticipants] = useState<User[]>();
  const [room, setRoom] = useState<Room>();

  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  useEffect(() => {
    if (!id) return;

    // Fetch room details
    const fetchRoom = async () => {
      const res = await fetch("/api/rooms/");
      const data = await res.json();

      // Filter out the room with the required id
      const foundRoom = data.data.find((room: Room) => room._id === id);
      setParticipants(foundRoom?.participants);
      setRoom(foundRoom);
    };

    fetchRoom();
  });

  return (
    <div className="px-5 py-4">
      {participants?.map((user: User) => (
        <div key={user?._id} className="flex items-center gap-3">
          {user._id === room?.host._id ? (
            <Image
              src={user.image}
              className="rounded-full border-2 border-main"
              alt="user-image"
              width={40}
              height={40}
            />
          ) : (
            <Image
              src={user.image}
              className="rounded-full"
              alt="user-image"
              width={40}
              height={40}
            />
          )}
          <p className="text-light">{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Participants;
