import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArticlesList } from "./_components/articles-list";
import { LinkHeader } from "./_components/link-header";
import { PostForm } from "./_components/post-form";
import { getArticlesPost, getPost } from "./actions";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPost(postId);
  const articles = await getArticlesPost(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="container relative max-w-5xl m-auto space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/app/posts" className="">
          <Button
            size={"icon"}
            variant={"outline"}
            className="cursor-pointer rounded-full"
          >
            <ChevronLeft />
          </Button>
        </Link>
        <LinkHeader postId={post.id} />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <PostForm post={post} />
        <ArticlesList postId={post.id} articles={articles} />
      </Suspense>
    </div>
  );
}
