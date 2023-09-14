const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        var lan = 'en'
        const locale = require('../locale/'+lan+'.json')
        if(interaction.isChatInputCommand()) {
            const { cooldowns } = interaction.client;
            const command = interaction.client.commands.get(interaction.commandName);

            if(!command) {
                console.error(locale.error.noCommandFound.replace('{command}', interaction.commandName));
                interaction.reply({ content: locale.error.noCommandFound.replace('{command}', interaction.commandName) });
                return;
            }

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

            if(timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	            if (now < expirationTime) {
		            const expiredTimestamp = Math.round(expirationTime / 1000);
                    if(command.data.name === "guess") {
                        return interaction.reply({ content: `HA, I can't die yet, you're still under cooldown.` });  
                    } else {
                        return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                    }
	            }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                if(!interaction.guild) {
                    interaction.reply({ content: locale.error.notGuild })
                    return;
                } else {
                    await command.execute(interaction);
                }
            } catch (error) {
                console.error(error);

                if(interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: locale.error.commandError, ephemeral: true });
                } else {
                    await interaction.reply({ content: locale.error.commandError, ephemeral: true });
                }
            }
        } else if(interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(locale.error.noCommandFound.replace('{command}', interaction.commandName));
                interaction.reply({ content: locale.error.noCommandFound.replace('{command}', interaction.commandName) });
                return;
            }
    
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
