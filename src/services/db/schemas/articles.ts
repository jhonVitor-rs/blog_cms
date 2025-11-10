import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { images } from "./images";
import { posts } from "./posts";

export const articles = pgTable("articles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }),
  text: text("text").notNull(),
  index: integer("index").notNull(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const articlesRelations = relations(articles, ({ one, many }) => ({
  post: one(posts, {
    fields: [articles.postId],
    references: [posts.id],
  }),
  images: many(images),
}));

export type TArticle = typeof articles.$inferSelect;
export type TNewArticle = typeof articles.$inferInsert;
