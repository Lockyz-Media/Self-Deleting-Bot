const { Events, ActivityType } = require('discord.js');
const { embedColor, ownerID, activity, status } = require('../config');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setPresence({ 
			activities: [{
				type: ActivityType.Custom,
				name: activity,
				state: activity
			}],
			status: status
		});

		console.log('Custom Status Set')
		console.log('🟢 Bit Core v4.0.0 Online! Logged in as '+ client.user.tag)
		console.log('==== Have a good day! ====');
	}
}
