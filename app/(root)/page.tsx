import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import Recent_Activities from "@/components/Recent_Activities";
import Rooms from "@/components/Rooms";
import Topics from "@/components/Topics";
import { User as AuthUser } from "@auth/core/types";

interface User extends AuthUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export default async function Home() {
  const session = await auth();
  const user = session?.user as User;

  return (
    <div className="">
      <Navbar />
      <div className="flex justify-between px-40 py-5">
        <Topics />
        <Rooms user={user} />
        <Recent_Activities user={user} />
      </div>
    </div>
  );
}
