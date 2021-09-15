import { Client, GuildMember, VoiceState } from "discord.js";
import { GetRoom, GetSettingsForGuild, RemoveRoom } from "../../roommanager";

export const name = 'voiceStateUpdate';
export const once = false;
export async function execute(oldState : VoiceState, newState : VoiceState) {
    if(!oldState || !oldState.channel) return;

    if([...oldState.channel.members.values()].length == 0) {
        const room = GetRoom(oldState.channelId ?? "");
        if(!room) return;

        const settings = GetSettingsForGuild(oldState.guild.id);

        if(settings.closeRoomWhenEmpty) {
            RemoveRoom(room.channel);
    
            oldState.channel.delete();
        }
    }
}