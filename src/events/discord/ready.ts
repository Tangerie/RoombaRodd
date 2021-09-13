import { Client } from "discord.js";
import { RegisterCommandsForAllGuilds } from "../../util/deploycommands";

export const name = 'ready';
export const once = true;
export function execute(client : Client) {
    console.log("Bot Ready");
    
    client.user?.setPresence({
        status: "online",
        activities: [{
            type: "PLAYING",
            name: "with your mum"
        }]
    });

    RegisterCommandsForAllGuilds(client);
}