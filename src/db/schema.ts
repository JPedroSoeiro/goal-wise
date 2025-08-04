import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  teamId: serial("team_id").references(() => teams.id),
  position: varchar("position", { length: 256 }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));
