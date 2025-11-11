"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { TPost } from "@/services/db/schemas";
import { EmptyList } from "./empty-list";

export function PostsList({ posts }: { posts: TPost[] }) {
  const [queryPosts, setQueryPosts] = useState<string>("");
  const [listPosts, setListPosts] = useState<TPost[]>(
    posts.filter((p) =>
      p.title.toLowerCase().includes(queryPosts.toLowerCase())
    )
  );

  return (
    <div>
      <form>
        <Input
          placeholder="Procurar Post..."
          onChange={(e) => setQueryPosts(e.target.value)}
        />
      </form>
      <EmptyList />
    </div>
  );
}
