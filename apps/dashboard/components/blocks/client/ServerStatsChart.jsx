"use client";

import { Block } from "@/components/blocks/Block";
import AreaChart from "@/components/blocks/client/AreaChart";
import { Header4 } from "@/components/blocks/Headers";

export function ServerStatsChart({ guildJoin, guildLeave }) {
 const numberFormatter = (value) => Intl.NumberFormat("us").format(value).toString();
 function sumArray(array, metric) {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue[metric], 0);
 }

 return (
  <div className="flex flex-col gap-6">
   <Block>
    <Header4 className="mb-4 !items-start !justify-normal">
     <span className="opacity-80">Members Joined</span> <span className="text-accent-primary">(+{sumArray(guildJoin, "Joins")})</span>
    </Header4>
    <AreaChart className="mt-10 h-80" data={guildJoin} index="date" categories={["Joins"]} yAxisWidth={50} valueFormatter={numberFormatter} curveType="monotone" />
   </Block>
   <Block>
    <Header4 className="mb-4 !items-start !justify-normal">
     <span className="opacity-80">Members Left</span> <span className="text-accent-primary">(+{sumArray(guildLeave, "Leaves")})</span>
    </Header4>
    <AreaChart className="mt-10 h-80" data={guildLeave} index="date" categories={["Leaves"]} yAxisWidth={50} valueFormatter={numberFormatter} curveType="monotone" />
   </Block>
  </div>
 );
}
