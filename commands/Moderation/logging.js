const { MessageEmbed } = require("discord.js");
const sql = require("../../utilities/database");

module.exports = {
 name: "logging",
 aliases: ["log"],
 description: "Set up logging module for guild",
 category: "Moderation",
 usage: "logging [channel]",
 run: async (client, message, args) => {
  try {
   if (!message.member.permissions.has("MANAGE_CHANNELS")) {
    return client.createError(message, `${client.bot_emojis.error} | You don't have permissions to manage logging! You need \`MANAGE_CHANNELS\` permission!`);
   }
   if (args[0]) {
    const channel = message.mentions.channels.first();
    if (!channel) {
     return client.createError(message, `${client.bot_emojis.error} | You must mention channel to set-up\n\n**Usage:** \`${client.prefix} logging [channel]\``);
    }
    const userperms = channel.permissionsFor(message.author);
    if (!userperms.has("MANAGE_CHANNEL")) {
     return client.createError(message, `${client.bot_emojis.error} | You can't set logging to this channel - you don't have permissions to do that! You need \`MANAGE_CHANNEL\` perm!\``);
    }
    const sqlquery = "SELECT channelid AS res FROM logs WHERE guildid = " + message.guild.id;
    sql.query(sqlquery, function (error, results, fields) {
     if (error) return console.log(error);
     if (results[0]) {
      const update = "UPDATE logs SET channelid = " + channel.id + " WHERE guildid = " + message.guild.id;
      sql.query(update, function (error, results, fields) {
       if (error) console.log(error);
       const success = new MessageEmbed() // Prettier
        .setDescription(`${client.bot_emojis.sparkles} | Success! Updated logs channel, new logs channel is ${channel} (ID: ${channel.id})`)
        .setColor("GREEN");
       message.reply({ embeds: [success] });
       const embed = new MessageEmbed() // Prettier
        .setColor("RANDOM")
        .setTitle("Success!")
        .setDescription(`${message.author} has set this channel for logging all events!`)
        .setFooter(
         `Requested by ${message.author.username}`,
         message.author.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
         })
        )
        .setTimestamp();
       channel.send({ embeds: [embed] });
      });
     } else {
      const insert = "INSERT INTO `logs` (`guildid`, `channelid`) VALUES (" + message.guild.id + "," + channel.id + ");";
      sql.query(insert, function (error, results, fields) {
       if (error) console.log(error);
       const success = new MessageEmbed() // Prettier
        .setDescription(`${client.bot_emojis.sparkles} | Success! New channel for logs is ${channel} (ID: ${channel.id})`)
        .setColor("GREEN");
       message.reply({ embeds: [success] });
       const embed = new MessageEmbed() // Prettier
        .setColor("RANDOM")
        .setTitle("Success!")
        .setDescription(`${message.author} has set this channel for logging all events!`)
        .setFooter(
         `Requested by ${message.author.username}`,
         message.author.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 2048,
         })
        )
        .setTimestamp();
       channel.send({ embeds: [embed] });
      });
     }
    });
   } else {
    const sqlquery = "SELECT channelid AS res FROM `logs` WHERE guildid = " + message.guild.id;
    sql.query(sqlquery, function (error, results, fields) {
     if (error) return console.log(error);
     if (results[0]) {
      const embed = new MessageEmbed() // Prettier
       .setColor("GREEN")
       .setDescription(`${client.bot_emojis.success} | Your current logs channel is: <#${results[0].res}>. You can channge channel by using \`${client.prefix} logging [channel]\`!`);
      return message.reply({ embeds: [embed] });
     } else {
      const embed = new MessageEmbed() // Prettier
       .setColor("GREEN")
       .setDescription(`${client.bot_emojis.error} | You haven't configured logs on this server yet, run \`${prefix} logging [channel]\` to configure logging!`);
      return message.reply({ embeds: [embed] });
     }
    });
   }
  } catch (err) {
   console.log(err);
   return client.createCommandError(message, err);
  }
 },
};
