export type Favorite = {
  title: string;
  cover: string;
};

/** My all-time list, shown as its own channel in the last menu slot. */
export const favorites = {
  title: "My 9 Games",
  tagline: "The 9 games that shaped who I am",
  games: [
    {
      title: "Counter-Strike: Global Offensive",
      cover: "/favorites/csgo.jpg",
    },
    { title: "Minecraft: Java Edition", cover: "/favorites/minecraft.jpg" },
    { title: "Super Smash Bros. Ultimate", cover: "/favorites/smash.jpg" },
    { title: "Super Mario Galaxy", cover: "/favorites/galaxy.jpg" },
    { title: "Hollow Knight", cover: "/favorites/hollow-knight.jpg" },
    { title: "Animal Crossing: New Leaf", cover: "/favorites/acnl.jpg" },
    { title: "Raft", cover: "/favorites/raft.jpg" },
    { title: "Terraria", cover: "/favorites/terraria.jpg" },
    { title: "Grounded", cover: "/favorites/grounded.jpg" },
  ] satisfies Favorite[],
};
