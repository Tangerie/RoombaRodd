import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, Interaction, MessageEmbed, OverwriteResolvable, Permissions, VoiceChannel } from "discord.js";
import { CreateRoom, GetRoomsByOwner, GetSettingsForGuild, RemoveRoom, SetGuildSettings } from "../roommanager";

export const data = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Change guild settings")
    .addBooleanOption(option => option.setName("closewhenempty").setDescription("Close rooms when empty"))
    .addChannelOption(option => option.setName("parentchannel").setDescription("Parent category for new rooms"))

export const admin = true;

export async function execute(interaction : CommandInteraction) {
    if(!interaction.guild) return;

    const settings = GetSettingsForGuild(interaction.guild.id);

    settings.closeRoomWhenEmpty = interaction.options.getBoolean("closewhenempty") ?? settings.closeRoomWhenEmpty;

    const chan = interaction.options.getChannel("parentchannel");

    if(chan) {
        if(chan.type != "GUILD_CATEGORY") {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Invalid Channel")
                        .setColor("RED")
                        .setDescription("Channel must be a category")
                ],
    
                ephemeral: true
            })
    
            return;
        }
    
        settings.parentCategory = chan.id;
    }
    

    SetGuildSettings(interaction.guild.id, settings);

    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setTitle("Settings changed")
                .setColor("GREEN")
        ],

        ephemeral: true
    });
}