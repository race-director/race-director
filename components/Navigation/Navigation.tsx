import React from "react";
import { Auth } from "./Auth";

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-zinc-900 max-w-screen-xl w-full flex justify-between items-center border-b-zinc-100/40 border border-0.5 border-t-0 border-x-0 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-zinc-100 border-2 border-zinc-50 px-2 py-1 rounded-sm">
            Race Director
          </h1>
        </div>
        <Auth></Auth>
      </div>
    </div>
  );
};

export default Navigation;
