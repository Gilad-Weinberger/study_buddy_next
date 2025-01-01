import { signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";

import { auth } from "../auth";
import Search from "./Search";

const Navbar = async () => {
  const session = await auth();
  const is_authenticated = Boolean(session?.user);
  const user = session?.user;

  return (
    <div className="bg-dark flex items-center justify-between px-40 py-4">
      <Link href="/" className="flex items-center no-underline">
        <Image src="/logo.png" alt="logo" width={30} height={30} />
        <h1 className="text-light ml-4 text-xl font-bold">StudyBuddy</h1>
      </Link>
      <div className="flex items-center gap-10">
        <Search />
        {!is_authenticated ? (
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 text-white"
            >
              <Image
                src="/user.svg"
                alt="user"
                height={30}
                width={30}
                className="fill-white"
              />
              <p className="text-[17px]">Login</p>
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-white">
            <Image
              src={user?.image || "/logo.svg"}
              alt="User Avatar"
              height={30}
              width={30}
              className="rounded-full"
            />
            <p className="text-[17px]">{user?.name || "User"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
