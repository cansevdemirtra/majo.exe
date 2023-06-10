import { meta, social } from "@config";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { LoginClient } from "components/buttons/client/Login";
import { Invite } from "components/buttons/server/Invite";
import { UserMenuDropdown } from "components/nav/client/UserMenuDropdown";
import { getSession } from "lib/session";
import Image from "next/image";
import Link from "next/link";
import { ServerDropdown } from "../client/ServerDropdown";
import { SideMenuControl } from "../client/SideMenuControl";

export async function Nav() {
 const session = await getSession();
 return (
  <nav className="fixed z-[9999] flex w-full items-center bg-background-navbar/70 py-4 text-left shadow-lg backdrop-blur-[9px] border-b border-b-neutral-800">
   <SideMenuControl />
   <Link href="/" className="text-lg text-white">
    <div className="flex cursor-pointer items-center gap-2 pl-4 pr-2 text-xl duration-200 hover:opacity-90 motion-reduce:transition-none">
     <Image className="rounded-full w-9 h-9 min-w-[2.25rem] min-h-[2.25rem]" src={social.logo} alt="Majo.exe" width={36} height={36} />
     <h1 className=" sm:block hidden font-bold">{meta.title}</h1>
    </div>
   </Link>
   <ServerDropdown />
   <div className="ml-auto mr-4 ">
    {session ? (
     <div className="flex items-center gap-2">
      <Link href="/dashboard" className="md:flex hidden items-center text-white/60 hover:text-white duration-200 motion-reduce:transition-none">
       <RectangleStackIcon className="mr-2 h-5 w-5 " aria-hidden="true" role="img" /> Dashboard
      </Link>
      <UserMenuDropdown user={session} />
     </div>
    ) : (
     <div className="flex items-center justify-center gap-2">
      <div className="md:block hidden">
       <Invite />
      </div>
      <LoginClient />
     </div>
    )}
   </div>
  </nav>
 );
}