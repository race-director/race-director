import Link from "next/link";
import React from "react";
import { Auth } from "./Auth";

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  return (
    <div className="w-full flex flex-col items-center sticky top-0 z-20">
      <div className="dark:bg-zinc-900 bg-white max-w-screen-2xl w-full flex justify-between items-center dark:border-b-zinc-100/40 border-b-zinc-600/40 border border-0.5 border-t-0 border-x-0 py-4 px-4">
        <div>
          <Link href="/">
            <a className="text-base md:text-2xl font-bold tracking-tighter text-zinc-900/80 dark:text-zinc-100 border-2 dark:border-zinc-50 border-zinc-900/80 px-2 py-1 rounded-sm">
              Race Director
            </a>
          </Link>
        </div>
        <div>{children}</div>
        <Auth></Auth>
      </div>
    </div>
  );
};

export default Navigation;
