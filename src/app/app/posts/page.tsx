import { getUserSession } from "@/lib/auth";
import { PostsList } from "./_components/posts-list";
import { getAllPosts } from "./actions";

export default async function PostsPage() {
  const user = await getUserSession();
  const posts = await getAllPosts(user.id);

  return (
    <main className="m-auto">
      <PostsList posts={posts} />
    </main>
  );
}
