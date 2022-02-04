import React, { useEffect, useState } from "react";

interface DiscordActivityProps {
  apiUrl: string;
}

const DiscordActivity: React.FC<DiscordActivityProps> = ({ apiUrl }) => {
  const [activity, setActivity] = useState<any>(null);

  const getDiscordActivity = async () => {
    const res = await fetch(apiUrl);
    setActivity(await res.json());
  };

  useEffect(() => {
    getDiscordActivity();
  }, []);

  return (
    <div className="overflow-hidden rounded-md">
      <div className="flex items-center justify-between bg-[#5865F2] px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <img
            className="w-10 pt-1"
            src="https://firebasestorage.googleapis.com/v0/b/race-director.appspot.com/o/assets%2FDiscord-Logo-White.png?alt=media&token=d88c1e73-fd58-4cb9-bdfe-f0af16b91d99"
            alt="Discord logo"
          />
          <h1 className="text-lg font-black text-white">Join our Discord</h1>
        </div>
        <p className="text-sm text-white">
          <span className="font-semibold">
            {activity && activity.presence_count}
          </span>{" "}
          Members online
        </p>
      </div>
      <div className="bg-zinc-800 px-6 py-4">
        <div className="flex h-32 space-x-4 rounded-lg bg-zinc-800">
          <img
            alt="Race Director Discord Logo"
            src="https://firebasestorage.googleapis.com/v0/b/race-director.appspot.com/o/assets%2FUntitled_drawing_5.png?alt=media&token=345c31e5-560a-4c51-a81e-b736ecfaa085"
          ></img>
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-2xl font-black text-zinc-200/80">
              Race Director
            </h1>
            <div>
              <a
                href={activity && activity.instant_invite}
                target={"_blank"}
                rel="noreferrer"
                className="mt-2 rounded-lg bg-[#3fb163] px-6 py-2 text-lg font-black text-white transition-colors hover:bg-[#2e874a]"
              >
                Join
              </a>
            </div>
          </div>
        </div>
        <div className="grid gap-2 pt-4">
          <h2 className="text-lg font-semibold text-zinc-200/80">Online</h2>
          <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-scroll">
            {activity &&
              activity.members.map((user: any) => {
                return (
                  <div key={user.id} className="flex items-center space-x-2">
                    <div className="relative">
                      <img
                        src={user.avatar_url}
                        height={"30rem"}
                        width={"30rem"}
                        className="rounded-full"
                        alt="Discord avatar"
                      ></img>
                      <div
                        className={`absolute top-6 right-0 h-2 w-2 rounded-full ${
                          user.status === "online"
                            ? "bg-green-400"
                            : "bg-orange-400"
                        } `}
                      ></div>
                    </div>
                    <p className="text-sm text-zinc-200/70">{user.username}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordActivity;
