import { notFound } from "next/navigation";
import { PostForm } from "./_components/post-form";
import { getPost } from "./actions";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPost(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="container max-w-5xl m-auto">
      <PostForm post={post} />
    </div>
  );
}
