const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, version: discordVersion } = require('discord.js')
const { startDelete, getNumber, getRandomInt, setNumber } = require("../bit.js");
const fs = require('node:fs');
const moment = require('moment');
const numberJson = "./data.json"
require('moment-duration-format');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('Make your guess and see if you can delete the bot.')
        .addIntegerOption(option => 
            option.setName("number")
                .setNameLocalizations({
                    de: 'nummer',
                    fr: 'nombre',
                })
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5000)
                .setDescription("What number would you like to guess?")),
	async execute(interaction) {
        const client = interaction.client
        const guess = interaction.options.getInteger("number")
        //var ran = getNumber();
        var ran

        fs.readFile(numberJson, (error, data) => {
			if(error) {
				console.error(error);
				throw error;
			}

			const dataJson = JSON.parse(data);

			console.log("Current Data is: "+data)
			console.log("Current Number is: "+dataJson.curNumber)

			ran = parseInt(dataJson.curNumber);
		})

        var lan = 'en'
        const locale = require('../locale/'+lan+'.json')
        console.log("Guess is: "+ guess)

        setTimeout(() => {
            console.log(ran);
            if(guess === ran) {
                client.guilds.cache.get("595881103672475665").channels.cache.get("910352256937885727").send({ content: locale.responses.correctStart.replace("{userID}", interaction.user.id) })
                interaction.reply({ content: locale.responses.correctReply })
                setTimeout(() => {
                    interaction.followUp({ content: locale.responses.correctFollowup.replace("{userID}", interaction.user.id)})
                }, 1000)
                setTimeout(() => {
                    startDelete();
                }, 3000)
            } else {
                if(guess === 420) {
                    interaction.reply({ content: locale.responses[420] })
                    return;
                } else if(guess === 69) {
                    interaction.reply({ content: locale.responses[69] })
                    return;
                } else if(guess === 666) {
                    interaction.reply({ content: locale.responses[666] })
                    return;
                }
                const random = getRandomInt(locale.randomResponses.count)
                interaction.reply({ content: locale.randomResponses[random] });
                var randomChance = 10;
                var chance = Math.floor(Math.random() * 100+1);

                if(chance <= randomChance) {
                    setNumber();
                }
            }
        }, 2000 )
    }
};