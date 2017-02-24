#!/usr/bin/env node

// using Strict mode
'use strict';

// Constants and requirements declaration
const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const weather = require('./');

const cli = meow({
	help: [
		'Usage',
		'  $ weather <input>',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

// Convert Fahrenheit to Celsius
function _toCelcius(temp) {
	return Math.round(((temp - 32) * 5) / 9);
}

// Notifies when a new version from a npm-dependency is published
updateNotifier({ pkg}).notify();

weather(cli.input, (err, result) => {
	// Check error
	if (err) {
		console.log(chalk.bold.red(err));
		process.exit(1);
	}

	// If no error
	// We get the query result
	let condition = result.query.results.channel.item.condition.text;
	let temperature;

	// If temperature is in Celsius
	if (cli.input[2] && cli.input[2] === 'C') {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}
	else if (cli.input[2] && cli.input[2] === 'F') { // If temperature is in Fahrenheit
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} else { // If temperature is in something else
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}

	// By Default
	// City is Dhake
	// Country is Bangladesh
	let city = cli.input[0] ? cli.input[0] : 'Dhaka';
	let country = cli.input[1] ? cli.input[1] : 'Bangladesh';

	// Test
	// console.log()
	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));
	process.exit();
});
