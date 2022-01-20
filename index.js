const { Client, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client();
const mongoose = require('mongoose')
require("discord-buttons")(client);
const config = require("./config")
        
fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.commands = new Collection();

fs.readdir('./commands/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const props = require(`./commands/${file}`);
		const commandName = file.split('.')[0];
		client.commands.set(commandName, props);
	});
});

mongoose.connect(config.mongodbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

mongoose.connection.once('open', function () {
  console.log('connected')
}).on('error', function (error) {
  console.log('not connnected', error)
})

client.login(config.botToken);