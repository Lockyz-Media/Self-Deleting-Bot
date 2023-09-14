const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, version: discordVersion } = require('discord.js')
const moment = require('moment');
require('moment-duration-format');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
        .setNameLocalizations({
            de: 'info',
            fr: 'info',
        })
		.setDescription('Get advanced information about the bot.')
        .setDescriptionLocalizations({
            de: 'Erhalten Sie erweiterte Informationen über den Bot.',
            fr: 'Obtenez des informations avancées sur le bot.',
        }),
	async execute(interaction) {
        const client = interaction.client
        var lan = 'en'
        const locale = require('../locale/'+lan+'.json')

        const botUptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const guildSize = client.guilds.cache.size.toString();
        const userSize = client.users.cache.size.toString();
        
        var d = new Date();
        var n = d.getFullYear();
        const embed = new EmbedBuilder()
            .setDescription(`# Self Deleting Bot
            ## What does it do?
            Basically whenever you use the /guess command, the bot generates a random number. If your guess is accurate the bot will delete all of it's files.

            ## What's in it for me?
            Whoever ends up making the bot delete itself will get 50 *Australian* dollars... It's not much but it's not nothing.
            If you get it, make sure to join our Discord Server *link below*
            `)
            .addFields(
                { name: locale.misc.support, value: "https://discord.gg/NgpN3YYbMM", inline: true },
                { name: locale.misc.developer, value: "Robin Painter", inline: true },
                { name: locale.misc.guilds, value: guildSize, inline: true },
                { name: locale.misc.users, value: userSize, inline: true },
                { name: locale.misc.uptime, value: botUptime, inline: true },
                { name: locale.misc.memory, value: `${Math.round(memUsage)} MB`, inline: true },
                { name: locale.misc.discordJS, value: `v${discordVersion}`, inline: true },
                { name: locale.misc.node, value: `${process.version}`, inline: true },
                { name: locale.misc.version, value: "v12082023.3", inline: true },
            )
            .setFooter({ text: locale.misc.copyrightText.replace('{year}', n)});
        interaction.reply({ embeds: [embed] })
	}
};