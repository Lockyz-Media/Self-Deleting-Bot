const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token, clientSecret } = require('./config.json');
const numberJson = "./data.json"
//const path = require("path");

const directory = "./";
const commandsDirect = "./commands";
const eventsDirect = "./events";
const localeDirect = "./locale";
var cmdsDel = false;
var evntsDel = false;
var localeDel = false;

function setNoomba() {
	var randumb = Math.floor(Math.random() * 5001);
	var oldTimestamp
	var num
	fs.readFile(numberJson, (error, data) => {
		if(error) {
			console.error(error);
			throw error;
		}

		//oldTimestamp =
		const numJson = JSON.parse(data);
		oldTimestamp = numJson.curTimestamp;
		num = numJson.curNumber;
	})
	//var oldTimestamp = numberJson.curTimestamp;

	let date = new Date();
	let cuTimestamp = date/1;

	setTimeout(() => {

		if(cuTimestamp >= oldTimestamp+10800000) {
			const newJson = {
				curNumber: randumb,
				curTimestamp: cuTimestamp
			}

			const data = JSON.stringify(newJson);

			fs.writeFile(numberJson, data, (error) => {
				if(error) {
					console.error(error);

					throw error;
				}
			})
		}
	}, 5000);
}

module.exports = {
	startDelete: function startDelete() {
		console.log("It has started!!!!");
		console.log("Deletion is currently unavailable!")
		//deleteCmds();
	},

	getRandomInt: function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	},

	setNumber: function setNumber() {
		setNoomba();
	},

	getNumber: function getNumber() {
		fs.readFile(numberJson, (error, data) => {
			if(error) {
				console.error(error);
				throw error;
			}

			const dataJson = JSON.parse(data);

			return dataJson.curNumber;
		})
	},
}

timerId = setTimeout(function tick() {
	console.log("Changing Number");
	this.setNumber()

	timerId = setTimeout(tick, 10800000)
}, 10800000)

function deleteCmds() {
	fs.readdir(commandsDirect, (err, files) => {
		if (err) throw err;
	
		for(const file of files) {
			fs.unlink(path.join(commandsDirect, file), (err) => {
				if(err) throw err;
			})
		}

		cmdsDel = true;
		console.log("Commands Deleted, deleting Events")
		delEvents()
	})
}

function delEvents() {
	if(cmdsDel === true && evntsDel === false) {
		fs.readdir(eventsDirect, (err, files) => {
			if (err) throw err;
		
			for(const file of files) {
				fs.unlink(path.join(eventsDirect, file), (err) => {
					if(err) throw err;
				})
			}
	
			evntsDel = true;
			console.log("Events Deleted, deleting Localisations")
			delLocale()
		})
	}
}

function delLocale() {
	if(evntsDel === true && localeDel === false) {
		fs.readdir(localeDirect, (err, files) => {
			if (err) throw err;
		
			for(const file of files) {
				fs.unlink(path.join(localeDirect, file), (err) => {
					if(err) throw err;
				})
			}
	
			localeDel = true;
			console.log("Localisations Deleted, deleting Logging Functions")
			deleteRest();
		})	
	}
}

function deleteRest() {
	fs.readdir(directory, (err, files) => {
		if (err) throw err;

		for(const file of files) {
			fs.unlink(path.join(directory, file), (err) => {
				if(err) throw err;
			})
		}

		logDel = true;
		console.log("Everything else was Deleted, Done")
	})	
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
    ]
})

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
})

client.commands = new Collection();
client.cooldowns = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
console.log("Loading "+commandFiles.length+" commands")

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if(event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
console.log("Loading "+eventFiles.length+" events")

client.login(token);