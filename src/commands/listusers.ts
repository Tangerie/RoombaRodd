import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, VoiceChannel } from "discord.js";
import { AddUserToChannel, GetRoomsByOwner } from "../roommanager";

export const data = new SlashCommandBuilder()
    .setName("listusers")
    .setDescription("List the users allowed in your private channel");

export const admin = false;

export async function execute(interaction : CommandInteraction) {
    if(GetRoomsByOwner(interaction.user).length == 0) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setTitle("You must own a room")
                .setDescription("You can create a room with /create <room_name>")
            ],

            ephemeral: true
        });

        return;
    }

    const room = GetRoomsByOwner(interaction.user)[0];
    const channel = await interaction.client.channels.fetch(room.channel) as VoiceChannel;

    const lines = [];

    for(const id of [room.owner, ...room.users]) {
        const user = await channel.guild.members.fetch(id);

        console.log(user.voice.channelId, channel.id);

        lines.push(`${user.displayName}`);
    }

    interaction.reply({
        ephemeral: true,
        embeds: [
            new MessageEmbed()
            .setColor("GOLD")
            .setTitle("Allowed in room")
            .setDescription(lines.join("\n"))
        ]
    });
}