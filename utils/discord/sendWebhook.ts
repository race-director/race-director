import { editorContent } from "../../components/Editor";
import { post, user } from "../../types";

const sendWebhook = async (
  endpoint: string,
  post: editorContent,
  postId: string,
  user: user
) => {
  const webhook = {
    content: "Look at this article that has just been posted!",
    embeds: [
      {
        title: post.headline,
        description: post.summary,
        url: `https://racedirector.vercel.app/p/${postId}`,
        color: 16713993,
        author: {
          name: user?.displayName,
          url: `https://racedirector.vercel.app/u/${user?.uid}`,
          icon_url: user?.photoURL,
        },
        image: {
          url: post.coverImage.coverImageUrl,
        },
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(webhook),
  });

  return await response.json();
};

export default sendWebhook;
