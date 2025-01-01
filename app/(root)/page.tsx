import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import Rooms from "@/components/Rooms";
import Topics from "@/components/Topics";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="">
      <Navbar />
      <div className="flex justify-between px-40 py-5">
        <Topics />
        <Rooms user={user} />
        <div className="recent_activities"></div>
      </div>
    </div>
  );
}
