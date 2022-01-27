import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Backdrop, Modal } from "../Menus";

interface ChangeLogProps {}

const ChangeLog: React.FC<ChangeLogProps> = () => {
  const [isShown, setIsShown] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsShown(!hasSeenChangelog());
  });

  useEffect(() => {
    if (isShown) {
      // @ts-ignore
      scrollRef.current?.onscroll = () => {
        if (
          // @ts-ignore
          scrollRef.current?.scrollTop + scrollRef.current?.clientHeight >=
          // @ts-ignore
          scrollRef.current?.scrollHeight
        ) {
          setHasRead(true);
        }
      };
    }
  }, [isShown]);

  const hasSeenChangelog = () => {
    return localStorage.getItem("hasSeenChangelog") === "true";
  };

  const closeChangelog = () => {
    localStorage.setItem("hasSeenChangelog", "true");
    setIsShown(false);
  };

  return (
    <AnimatePresence>
      {isShown && (
        <Backdrop onClick={() => {}}>
          <Modal>
            <div className="p-8 grid gap-4">
              <h1 className="text-2xl text-zinc-200/90 font-bold uppercase">
                Welcome to the Race Director beta!
              </h1>
              <div className="max-h-96 overflow-y-scroll py-3" ref={scrollRef}>
                <div className="grid gap-3">
                  <p className="text-zinc-200/70">
                    Hi! I&apos;m Axel Padilla, the creator of Race Director.
                    Following the announcement of DriveTribe&apos;s shutdown, I
                    have been working incredibly hard in order to get this up
                    and running as quickly as possible.
                  </p>
                  <p className="text-zinc-200/70">
                    Building a platform like this is no easy task, which is why
                    I know there is plenty of work to do. Race Director is
                    currently in a really early stage, where only the very basic
                    things are working.
                  </p>
                </div>
                <div className="grid gap-3 pt-4">
                  <h2 className="text-xl text-zinc-200/90 font-bold uppercase">
                    Things you should know
                  </h2>
                  <p className="text-zinc-200/70">
                    As this is a really early beta, major changes are likely to
                    happen and databases may be reset in order to add new
                    features incompatible with the existing ones. In case
                    something like this happens, I will back up posts to my
                    local machine as markdown files. However, I would strongly
                    advise for you to keep valuable information in your local
                    machine
                  </p>
                  <p className="text-zinc-200/70">
                    By using this website you are accepting the use of your data
                    to offer a better experience. Please refer to the{" "}
                    <Link href={"/legal/privacy"}>
                      <a className="underline">privacy policy</a>
                    </Link>{" "}
                    to learn more
                  </p>
                </div>
                <div className="grid gap-3 pt-4">
                  <h2 className="text-xl text-zinc-200/90 font-bold uppercase">
                    Contributing
                  </h2>
                  <p className="text-zinc-200/70">
                    There are a lot of bugs and features missing, but I can only
                    work on so many things. If you think something should be
                    worked on, please add it{" "}
                    <a
                      className="underline"
                      href="https://github.com/FadedController/race-director/issues"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      here.
                    </a>
                  </p>
                  <p className="text-zinc-200/70">
                    If you are a developer, you can also work on any issue
                    yourself on the{" "}
                    <a
                      className="underline"
                      href="https://github.com/FadedController/race-director"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      github repo.
                    </a>
                  </p>
                </div>
                <div className="grid gap-3 pt-4">
                  <h2 className="text-xl text-zinc-200/90 font-bold uppercase">
                    Contact
                  </h2>
                  <p className="text-zinc-200/70">
                    Finally, if you have any questions, feel free to contact me
                    on Discord (FadedController#3912), or via{" "}
                    <a
                      className="underline"
                      href="mailto:adpadillar25@gmail.com"
                    >
                      email.
                    </a>
                  </p>
                  <b className="text-zinc-200/90">Have fun everybody!</b>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-2 text-zinc-200">
                <button
                  disabled={!hasRead}
                  onClick={closeChangelog}
                  className="bg-red-600 disabled:opacity-60 disabled:hover:bg-red-600 disabled:cursor-not-allowed text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                >
                  I have read, and agree to the terms
                </button>
              </div>
            </div>
          </Modal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default ChangeLog;
