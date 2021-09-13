import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, Interaction, MessageEmbed, OverwriteResolvable, Permissions, VoiceChannel } from "discord.js";
import { CreateRoom, GetRoomsByOwner, RemoveRoom } from "../roommanager";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help");

export const admin = false;

export async function execute(interaction : CommandInteraction) {
    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor("GOLD")
            .setTitle("Commands")
            .setDescription(`${interaction.guild?.members.cache.get(interaction.client?.user?.id ?? "")?.displayName} is a bot to create private voicechat rooms
            
            **Create a room** - /create <room name>
            *Creates a private voicechat with that name*
            
            **Close a room** - /close
            *Closes your room*
            
            **Add users** - /addusers
            *Creates a prompt to add users*
            
            **Remove users** - /removeusers
            *Creates a prompt to remove users*`)
            .setFooter("Your dumb")
        ]
    });
}