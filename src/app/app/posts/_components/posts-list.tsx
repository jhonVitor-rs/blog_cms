"use client";

import { Image as LucideImage, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlMenu } from "@/components/url-menu";
import type { TPost } from "@/services/db/schemas";
import { EmptyList } from "./empty-list";
import { NewPostForm } from "./new-post-form";

export function PostsList({ posts }: { posts: TPost[] }) {
  const [listPosts, setListPosts] = useState<TPost[]>(posts);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <form>
        <Input
          placeholder="Procurar Post..."
          onChange={(e) =>
            setListPosts(
              posts.filter((p) =>
                p.title.toLowerCase().includes(e.target.value.toLowerCase())
              )
            )
          }
        />
      </form>
      <div className="px-2 py-4 gap-4">
        {listPosts.length <= 0 ? (
          <EmptyList />
        ) : (
          <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listPosts.map((post) => (
              <Card
                key={post.id}
                className="relative bg-muted overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => router.push(`/app/posts/${post.id}`)}
              >
                <CardContent className="p-0 min-h-[200px] flex items-center justify-center bg-muted">
                  {post.banner ? (
                    <Image
                      src={post.banner}
                      width={400}
                      height={200}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LucideImage className="w-16 h-16 text-muted-foreground" />
                  )}
                </CardContent>
                <CardFooter className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-background via-background/80 to-transparent">
                  <CardTitle className="text-foreground drop-shadow-lg">
                    {post.title}
                  </CardTitle>
                  <UrlMenu url={`posts/${post.id}`} />
                </CardFooter>
              </Card>
            ))}
            <div className="fixed bottom-10 right-10">
              <NewPostForm className="rounded-lg p-4">
                <Plus className="size-8" />
              </NewPostForm>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
