"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "next-auth";

// Define the type for a Topic
type Topic = {
  _id: string;
  name: string;
};

type Room = {
  _id: string;
  name: string;
  topics: Topic[]; // An array of Topic objects
  participants: User[]; // An array of User ObjectIds (represented as strings here)
  host: string; // User ObjectId (represented as a string here)
  createdAt: string; // Timestamp for when the room was created
  updatedAt: string; // Timestamp for when the room was last updated
};

const Topics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTopics();
      await fetchRooms();
    };
    fetchData();
  }, []);

  const fetchTopics = async () => {
    const res = await fetch("/api/topics");
    const data = await res.json();
    setTopics(data.data);
  };

  const fetchRooms = async () => {
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(data.data);
  };

  // Function to get room count for a specific topic
  const getTopicRoomCount = (topicId: string) => {
    return rooms.filter((room) =>
      room.topics.some((topic) => topic._id === topicId),
    ).length;
  };

  return (
    <div className="w-52">
      <div>
        <p className="text-dark-light m-0">BROWSE TOPICS</p>
      </div>
      <form>
        <div className="flex cursor-pointer items-center justify-between">
          <input
            type="submit"
            className="topic_name"
            name="topic"
            value="All"
          />
          <p className="topic_count">{rooms.length}</p>
        </div>
        {topics.map((topic) => (
          <div
            key={topic._id}
            className="flex cursor-pointer items-center justify-between"
          >
            <input
              type="submit"
              className="topic_name"
              name="topic"
              value={topic.name}
            />
            <p className="topic_count">{getTopicRoomCount(topic._id)}</p>
          </div>
        ))}
      </form>
      {topics.length > 4 && (
        <Link
          href="/"
          className="text-main hover:border-main no-underline hover:border-b"
        >
          More
          <Image src="/arrow-down.svg" alt="arrow" height={10} width={10} />
        </Link>
      )}
    </div>
  );
};

export default Topics;
