import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, Interaction, MessageEmbed, OverwriteResolvable, Permissions, VoiceChannel } from "discord.js";
import { CreateRoom, GetRoomsByOwner, RemoveRoom } from "../roommanager";

export const data = new SlashCommandBuilder()
    .setName("close")
    .setDescription("Close your private room (must be owner)");

export const admin = false;

export async function execute(interaction : CommandInteraction) {
    if(GetRoomsByOwner(interaction.user).length == 0) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setTitle("You dont own a room")
            ],

            ephemeral: true
        });

        return;
    }

    const room = GetRoomsByOwner(interaction.user)[0];

    RemoveRoom(room.channel);

    const channel = await interaction.client.channels.fetch(room.channel) as VoiceChannel;


    interaction.reply({
        content: `Closed ${channel.name}`, 
        ephemeral: true
    });
    
    if(channel) {
        channel.delete();
    }
}