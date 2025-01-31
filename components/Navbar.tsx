import { signIn, signOut, auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

import Search from "./Search";
import User from "@/lib/models/userModel";

async function createUser(user: {
  name: string;
  email: string;
  image: string;
}) {
  try {
    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      const newUser = new User({
        name: user.name,
        email: user.email,
        image: user.image,
      });
      await newUser.save();
    }
  } catch (error) {
    console.error("Error ensuring user exists:", error);
  }
}

const Navbar = async () => {
  const session = await auth();
  const is_authenticated = Boolean(session?.user);
  const user = session?.user;

  if (is_authenticated && user?.email) {
    await createUser({
      name: user.name || "Unknown User",
      email: user.email,
      image: user.image || "/user.svg",
    });
  }

  return (
    <div className="flex items-center justify-between bg-dark px-40 py-4">
      <Link href="/" className="flex items-center no-underline">
        <Image src="/logo.png" alt="logo" width={30} height={30} />
        <h1 className="ml-4 text-xl font-bold text-light">StudyBuddy</h1>
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
            <p className="mr-1.5 text-[17px]">
              {user?.name?.split(" ")[0] || "User"}
            </p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="h-8 border-l border-white pl-4 text-white"
              >
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
