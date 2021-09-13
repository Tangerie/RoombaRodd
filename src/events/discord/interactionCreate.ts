import { CommandInteraction, Interaction } from "discord.js";
import { GetCommands } from "../../util/deploycommands";

export const name = 'interactionCreate';
export const once = false;
export async function execute(interaction : Interaction) {
    if(interaction.isCommand()) {
        const cmdInter = interaction as CommandInteraction;

        const cmd = GetCommands().get(interaction.commandName);
        
        if(!cmd) return;

        try {
            await cmd.execute(cmdInter);
        } catch {
            await cmdInter.reply({ content: 'There was an error while executing this command', ephemeral: true })
        }
        
    } else {

    }
}