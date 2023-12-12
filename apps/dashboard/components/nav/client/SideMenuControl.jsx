"use client";

import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { VisibilityContext } from "./VisibilityContext";

export function SideMenuControl() {
 const { toggleSideNav, sideNavVisible } = useContext(VisibilityContext);
 const params = useParams();

 return (
  <>
   {params.server && (
    <button className="bg-elements text-text ml-4 flex flex-row items-center gap-2 rounded-lg p-2 md:hidden" onClick={toggleSideNav}>
     <div className="relative h-6 w-6">
      <XMarkIcon
       className={clsx(
        {
         "scale-0": !sideNavVisible,
         "scale-100": sideNavVisible,
        },
        "min-h-6 min-w-6 absolute top-0 h-6 w-6 duration-200"
       )}
      />
      <Bars3BottomLeftIcon
       className={clsx(
        {
         "scale-100": !sideNavVisible,
         "scale-0": sideNavVisible,
        },
        "min-h-6 min-w-6 absolute top-0 h-6 w-6 duration-200"
       )}
      />
     </div>
    </button>
   )}
  </>
 );
}
