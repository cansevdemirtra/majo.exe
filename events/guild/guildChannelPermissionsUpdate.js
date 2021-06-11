const Discord = require("discord.js");
const config = require("../../config");
const sql = require("../../utilities/database");

module.exports = async (client, channel, oldPermissions, newPermissions) => {
 try {
  console.log("This");
  const sqlquery = "SELECT channelid AS res FROM logs WHERE guildid = " + channel.guild.id;
  sql.query(sqlquery, function (error, results, fields) {
   if (error) console.log(error);
   if (!results || results.length == 0) {
    return;
   }
   console.log("This");
   (async () => {
    const logsetup = await results[0].res;
    const log = await channel.guild.channels.cache.find((c) => c.id == logsetup && c.type == "text");
    if (!log) return;
    console.log("This");
    const newtopic = new Discord.MessageEmbed()
     .setTitle("📝 Channel premissions changed!", channel.guild.iconURL())
     .addField("Channel name", `${channel.name}`)
     .addField("Channel type", `${channel.type}`)
     .addField("Channel ID", `${channel.id}`)
     //.addField("Channel type", `${type}`)
     .addField("Created at", `${channel.createdAt}`)
     .setColor("RANDOM")
     .setTimestamp()
     .setFooter(channel.guild.name, channel.guild.iconURL());
    await log.send(newtopic);
   })();
  });
 } catch (err) {
  console.log(err);
 }
};
