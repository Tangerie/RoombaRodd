import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, Interaction, MessageEmbed, OverwriteResolvable, Permissions, VoiceChannel } from "discord.js";
import { CreateRoom, GetRoomsByOwner } from "../roommanager";

export const data = new SlashCommandBuilder()
    .setName("create")
    .setDescription("Create a private room")
    .addStringOption(option => option.setName("name").setDescription("Room name").setRequired(true));

export const admin = false;

export async function execute(interaction : CommandInteraction) {
    if(GetRoomsByOwner(interaction.user).length > 0) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setTitle("Only one room per owner")
                .setDescription("You can close your room with /close")
            ],

            ephemeral: true
        });

        return;
    }

    interaction.reply({
        content: "Mention all the people you would like to add", 
        ephemeral: true
    });

    const collector = interaction.channel?.createMessageCollector({
        filter: msg => msg.author.id == interaction.member?.user.id 
            && [...msg.mentions.users.filter(u => u.id != interaction.member?.user.id).values()].length > 0,
        max: 1,
        time: 300000
    });

    collector?.on("collect", async msg => {
        if(!msg.guild) return;

        const room = await CreateRoom(interaction.options.getString("name") ?? "noname", msg.guild, msg.author, [...msg.mentions.users.values()]);
        
        const channel = await msg.client.channels.fetch(room.channel) as VoiceChannel;

        interaction.followUp({
            ephemeral: true,
            content: `Created ${channel.toString()} with ${msg.mentions.members?.filter(x => x.id != msg.author.id).map(x => x.toString()).join(" ")}`
        });

        msg.delete();
    });
}