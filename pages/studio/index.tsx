import React from "react";

interface StudioPageProps {}

const StudioPage: React.FC<StudioPageProps> = () => {
  return (
    <div className="dark:bg-zinc-900 min-h-screen w-full grid justify-center">
      <div className="pt-12 px-4 max-w-5xl w-screen prose dark:prose-invert">
        <h1>This is the editor</h1>
      </div>
    </div>
  );
};

export default StudioPage;
