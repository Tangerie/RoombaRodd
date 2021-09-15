import { Guild, User, Permissions, OverwriteResolvable, UserFlags, VoiceChannel, Channel, CategoryChannel } from 'discord.js';
import fs from 'fs';
import { GuildSettings } from './models/guildsettings';
import Room from './models/room';
import { LoadMapFromJson, SaveMapToJson } from './util/json';

const dataFile = "rooms.json";

const roomMap = LoadMapFromJson<string, Room>(`./data/${dataFile}`);

const guildSettingsMap = LoadMapFromJson<string, GuildSettings>(`./data/guilds.json`);

export async function CreateRoom(name : string, guild : Guild, owner : User, others : User[]) : Promise<Room> {
    const settings = GetSettingsForGuild(guild.id);

    const chan = await guild?.channels.create(name, {
        type: "GUILD_VOICE",
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                id: owner.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            ...others.map(x => {
                return {
                    id: x.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL]
                } as OverwriteResolvable;
            })
        ],
        parent: guild.channels.cache.get(settings.parentCategory) as CategoryChannel
    });

    const room : Room = {
        channel: chan.id,
        owner: owner.id,
        users: others.map(x => x.id)
    }

    roomMap.set(chan.id, room);
    SaveRooms();

    return room;
}

export function GetRoom(channel : string) {
    return roomMap.get(channel);
}

export function RemoveRoom(channel : string) {
    roomMap.delete(channel);

    SaveRooms();
}

export async function AddUserToChannel(user : User, channel : VoiceChannel) : Promise<Room | undefined> {
    const room = GetRoom(channel.id);

    if(!room || room.owner == user.id || room?.users.includes(user.id)) return room;

    await channel.permissionOverwrites.create(user, {VIEW_CHANNEL: true});

    room.users.push(user.id);

    roomMap.set(channel.id, room);

    SaveRooms();

    return room;
}

export async function RemoveUserFromChannel(user : User, channel : VoiceChannel) : Promise<Room | undefined> {
    const room = GetRoom(channel.id);

    if(!room || room.owner == user.id || !room?.users.includes(user.id)) return room;

    await channel.permissionOverwrites.delete(user);

    room.users = room.users.filter(x => x != user.id);

    roomMap.set(channel.id, room);

    SaveRooms();

    return room;
}

export function GetRoomsByOwner(owner : User) {
    return [...roomMap.values()].filter(room => room.owner == owner.id);
}

function SaveRooms() {
    SaveMapToJson(`./data/${dataFile}`, roomMap);
}

export function GetSettingsForGuild(id : string) {
    const settings = guildSettingsMap.get(id);
    if(settings) return settings;
    return {
        closeRoomWhenEmpty: true,
        parentCategory: ""
    } as GuildSettings;
}

export function SetGuildSettings(id : string, settings : GuildSettings) {
    guildSettingsMap.set(id, settings);
    SaveGuildSettings();
}

function SaveGuildSettings() {
    SaveMapToJson(`./data/guilds.json`, guildSettingsMap);
}