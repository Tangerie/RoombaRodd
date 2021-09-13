import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, VoiceChannel } from "discord.js";
import { AddUserToChannel, GetRoomsByOwner, RemoveUserFromChannel } from "../roommanager";

export const data = new SlashCommandBuilder()
    .setName("removeusers")
    .setDescription("Remove users from your channel (must be owner)");

export const admin = false;

export async function execute(interaction : CommandInteraction) {
    if(GetRoomsByOwner(interaction.user).length == 0) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setTitle("You must own a room to remove users")
                .setDescription("You can create a room with /create <room_name>")
            ],

            ephemeral: true
        });

        return;
    }

    const room = GetRoomsByOwner(interaction.user)[0];
    const channel = await interaction.client.channels.fetch(room.channel) as VoiceChannel;

    interaction.reply({
        content: "Mention all the people you would like to remove", 
        ephemeral: true
    });

    const collector = interaction.channel?.createMessageCollector({
        filter: msg => msg.author.id == interaction.member?.user.id && [...msg.mentions.users.filter(u => u.id != interaction.member?.user.id && room.users.includes(u.id)).values()].length > 0,
        max: 1,
        time: 300000
    });

    collector?.on('collect', async msg => {
        const toRemove = msg.mentions.members?.filter(x => x.id != msg.author.id && room.users.includes(x.id));
        if(!toRemove) return;

        for(const [id, user] of toRemove) {
            await user.voice.disconnect();
            await RemoveUserFromChannel(user.user, channel);
        }
        
        msg.delete();

        interaction.followUp({
            ephemeral: true,
            content: `Removed ${toRemove.map(x => x.toString()).join(" ")} from ${channel.toString()}`
        });
    })
}