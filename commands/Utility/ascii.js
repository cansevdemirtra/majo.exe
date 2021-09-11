const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const figlet = require("figlet");
const hastebin = require("hastebin");

module.exports = {
 name: "ascii",
 aliases: ["asciiart", "ascii-art"],
 category: "Utility",
 description: "Convert text to asci format",
 usage: "ascii <text>",
 run: async (client, message, args) => {
  try {
   if (args.join(" ").length > 1000) {
    const error = new MessageEmbed() // Prettier
     .setColor("RED")
     .setDescription(`${client.bot_emojis.error} | The max length for ascii is 1000 characters!\n\n**Usage:** \`${process.env.PREFIX} ascii <text>\``);
    return message.reply({ embeds: [error] });
   }
   if (!args[0]) {
    const error = new MessageEmbed() // Prettier
     .setDescription(`${client.bot_emojis.error} | Please enter a text to convert!\n\n**Usage:** \`${process.env.PREFIX} ascii <text>\``);
    return message.reply({ embeds: [error] });
   }
   figlet(args.join(" "), function (err, data) {
    if (err) {
     return message.reply({ embeds: [client.command_error_embed] });
    }
    hastebin
     .createPaste(
      data,
      {
       raw: true,
       contentType: "text/plain",
       server: "https://haste.zneix.eu/",
      },
      {}
     )
     .then(function (urlToPaste) {
      const embed = new MessageEmbed() // Prettier
       .setColor("RANDOM")
       .setTitle(
        `${client.bot_emojis.success} Success!`,
        message.guild.iconURL({
         dynamic: true,
         format: "png",
        })
       )
       .setDescription(`${client.bot_emojis.tada} Your ascii code is generated! \n${client.bot_emojis.link} Link to ascii code paste: ${urlToPaste}`)
       .setFooter(
        `Requested by ${message.author.username}`,
        message.author.displayAvatarURL({
         dynamic: true,
         format: "png",
         size: 2048,
        })
       )
       .setTimestamp();
      const row = new MessageActionRow() // Prettier
       .addComponents(
        new MessageButton() // Prettier
         .setURL(urlToPaste)
         .setStyle("LINK")
         .setLabel("View ascii code")
       );
      message.reply({ embeds: [embed], components: [row] });
     })
     .catch(function (requestError) {
      const error = new MessageEmbed() // Prettier
       .setColor("RED")
       .setDescription(`Something went wrong while uploading ascii code to server ${client.bot_emojis.sadness}`);
      return message.reply({ embeds: [error] });
     });
   });
  } catch (err) {
   console.log(err);
   message.reply({ embeds: [client.command_error_embed] });
  }
 },
};
