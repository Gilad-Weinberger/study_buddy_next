import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import Room from "@/components/Room";
import Participants from "@/components/Participants";
import { User as AuthUser } from "@auth/core/types";
import createUser from "@/lib/createUser";

interface User extends AuthUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export default async function Page() {
  const session = await auth();
  const auth_user = session?.user as User;
  const user = await createUser(auth_user);

  console.log(user?.id);

  return (
    <div className="">
      <Navbar />
      <div className="flex justify-between px-40 py-5">
        <div className="w-[56vw] rounded-lg bg-dark">
          <div className="flex items-center gap-2 rounded-t-lg bg-dark-light px-5 py-3">
            <Link href="/">
              <Image
                src="/arrow-left.svg"
                alt="arrow-back"
                width={24}
                height={24}
              />
            </Link>
            <p className="text-light">STUDY ROOM</p>
          </div>
          <Room user={user} />
        </div>
        <div className="w-[21vw] bg-dark">
          <div className="rounded-t-lg bg-dark-light px-5 py-3">
            <p className="text-light">PARTICIPANTS</p>
          </div>
          <Participants />
        </div>
      </div>
    </div>
  );
}
