import prismaClient from "@majoexe/database";
import { getGuildMember, getServer } from "@majoexe/util/functions";
import { getSession } from "lib/session";
import { redirect } from "next/navigation";
import { ServerStatsChart } from "@/components/blocks/client/ServerStatsChart";

export default async function Statistics({ params }) {
 const session = await getSession();
 if (!session || !session.access_token) redirect("/auth/login");
 const { server } = params;
 const serverDownload = await getServer(server);
 if (!serverDownload || serverDownload.code === 10004 || !serverDownload.bot) return redirect("/dashboard");
 const serverMember = await getGuildMember(serverDownload.id, session.access_token);
 if (!serverMember || !serverMember.permissions_names || !serverMember.permissions_names.includes("MANAGE_GUILD") || !serverMember.permissions_names.includes("ADMINISTRATOR")) return redirect("/dashboard");

 const guild = await prismaClient.guild.findFirst({
  where: {
   guildId: serverDownload.id,
  },
  select: {
   guildId: true,
   GuildJoin: {
    where: {
     date: {
      gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
     },
    },
    select: {
     date: true,
     joins: true,
    },
   },
   GuildLeave: {
    where: {
     date: {
      gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
     },
    },
    select: {
     date: true,
     leaves: true,
    },
   },
  },
 });

 const guildJoinMap = new Map();
 const guildLeaveMap = new Map();

 const parseDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? null : date.toISOString().split("T")[0];
 };

 guild.GuildJoin.forEach((guildJoinData) => {
  const dateFormatted = parseDate(guildJoinData.date);
  if (dateFormatted !== null) {
   guildJoinMap.set(dateFormatted, (guildJoinMap.get(dateFormatted) || 0) + guildJoinData.joins);
  }
 });

 guild.GuildLeave.forEach((guildLeaveData) => {
  const dateFormatted = parseDate(guildLeaveData.date);
  if (dateFormatted !== null) {
   guildLeaveMap.set(dateFormatted, (guildLeaveMap.get(dateFormatted) || 0) + guildLeaveData.leaves);
  }
 });

 const currentDate = new Date();
 const pastDays = 30;
 const guildJoin = [];
 const guildLeave = [];

 for (let i = 0; i < pastDays; i++) {
  const date = new Date(currentDate);
  date.setDate(currentDate.getDate() - i);
  const dateFormatted = parseDate(date.toISOString().split("T")[0]);

  const joins = guildJoinMap.get(dateFormatted) || 0;
  const leaves = guildLeaveMap.get(dateFormatted) || 0;

  guildJoin.unshift({ date: dateFormatted, Joins: joins });
  guildLeave.unshift({ date: dateFormatted, Leaves: leaves });
 }

 return (
  <>
   <ServerStatsChart guildJoin={guildJoin} guildLeave={guildLeave} />
  </>
 );
}
