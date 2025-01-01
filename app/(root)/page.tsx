import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await auth();
  const is_authenticated = Boolean(session?.user);
  const user = session?.user;

  console.log("session", session);
  console.log("is_authenticated", is_authenticated);
  console.log("user", user);

  return (
    <>
      <Navbar />
    </>
  );
}
