"use client";

import { User } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns"; // Import date-fns

// Define the type for a Topic
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

interface RoomsProps {
  user?: User;
}

const Rooms: React.FC<RoomsProps> = ({ user }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRooms();
    };
    fetchData();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(data.data);
    console.log("data:", data.data);
  };

  return (
    <div className="w-[38vw]">
      <div className="flex items-center justify-between">
        <div className="no-underline">
          <p className="text-light m-0 text-[16px]">STUDY ROOMS</p>
          <p className="text-dark-light m-0 mt-1 text-[15px] font-medium">
            {rooms.length} Room available
          </p>
        </div>
        {user && (
          <Link
            href="create-room"
            className="text-dark bg-main rounded-md px-4 py-3 no-underline"
          >
            <span className="mr-2 text-[18px]">+</span>Create Rooms
          </Link>
        )}
      </div>
      <div className="mt-5">
        {rooms.map((room) => (
          <div className="bg-dark mb-6 rounded-lg p-5" key={room._id}>
            <div className="flex max-h-10 items-center justify-between">
              <Link
                href={`room/${room._id}`}
                className="flex items-center gap-2.5"
              >
                <Image
                  src="/user.svg"
                  alt="profile-image"
                  width={32}
                  height={32}
                  className="border-main rounded-full border-2"
                />
                <p className="text-main m-0">Room Host</p>
              </Link>
              <p className="text-light text-[14px]">
                {formatDistanceToNow(new Date(room.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <Link href="/" className="no-underline">
              <p className="text-light hover:text-main my-5 text-[20px]">
                {room.name}
              </p>
            </Link>
            <div className="border-dark-medium flex items-center justify-between border-t-2 py-2.5">
              <div className="flex items-center gap-2">
                <Image
                  src="/user.svg"
                  alt="profile-image"
                  width={22}
                  height={32}
                />
                <p className="text-light-gray m-0 text-[14px]">
                  {room.participants.length} Joined
                </p>
              </div>
              <p className="text-light-gray bg-dark-medium rounded-2xl px-3 py-1">
                {room.topics[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
