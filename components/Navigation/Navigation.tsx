import Link from "next/link";
import React from "react";
import { Auth } from "./Auth";

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  return (
    <div className="sticky top-0 z-20 flex w-full flex-col items-center">
      <div className="border-0.5 flex w-full max-w-screen-2xl items-center justify-between border border-x-0 border-t-0 border-b-zinc-600/40 bg-white py-4 px-4 dark:border-b-zinc-100/40 dark:bg-zinc-900">
        <div>
          <Link href="/">
            <a className="rounded-sm border-2 border-zinc-900/80 px-2 py-1 text-base font-bold tracking-tighter text-zinc-900/80 dark:border-zinc-50 dark:text-zinc-100 md:text-2xl">
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
