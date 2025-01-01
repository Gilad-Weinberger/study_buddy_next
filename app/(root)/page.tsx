import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await auth();
  const is_authenticated = Boolean(session?.user);
  const user = session?.user;

  return (
    <>
      <Navbar />
    </>
  );
}
