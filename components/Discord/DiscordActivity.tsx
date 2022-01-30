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
    <div className="rounded-md overflow-hidden">
      <div className="bg-[#5865F2] px-6 py-4 flex items-center justify-between">
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
        <div className="h-32 bg-zinc-800 rounded-lg flex space-x-4">
          <img
            alt="Race Director Discord Logo"
            src="https://firebasestorage.googleapis.com/v0/b/race-director.appspot.com/o/assets%2FUntitled_drawing_5.png?alt=media&token=345c31e5-560a-4c51-a81e-b736ecfaa085"
          ></img>
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-2xl font-black text-zinc-200/80">
              Race Director Discord
            </h1>
            <div>
              <a
                href={activity && activity.instant_invite}
                target={"_blank"}
                rel="noreferrer"
                className="bg-[#3fb163] hover:bg-[#2e874a] text-white transition-colors px-6 py-2 text-lg font-black mt-2 rounded-lg"
              >
                Join
              </a>
            </div>
          </div>
        </div>
        <div className="grid gap-2 pt-4">
          <h2 className="text-lg font-semibold text-zinc-200/80">Online</h2>
          {activity &&
            activity.members.map((user: any) => {
              return (
                <div key={user.id} className="flex space-x-2 items-center">
                  <div className="relative">
                    <img
                      src={user.avatar_url}
                      height={"30rem"}
                      width={"30rem"}
                      className="rounded-full"
                      alt="Discord avatar"
                    ></img>
                    <div
                      className={`absolute h-2 w-2 rounded-full top-6 right-0 ${
                        user.status === "online"
                          ? "bg-green-400"
                          : "bg-orange-400"
                      } `}
                    ></div>
                  </div>
                  <p className="text-zinc-200/70 text-sm">{user.username}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DiscordActivity;
