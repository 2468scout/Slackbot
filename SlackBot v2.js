var Bot = require('slackbots'); //lets you connect to RTM API from Slack
var request = require('request'); //for http requests

//setting up a bot
var settings = {
    token: 'xoxb-123980065522-isdHsz6aCBfcwTrT4XcIjhFb',
    name: 'robostats'
};
var bot = new Bot(settings);

//variables and arrays for overall usage
var intel = []; //for slack users to add info to an in slack list
var verified = ["U2CLWCW7L", "U2CLC69U6", "U2CL9P7QU"]; //basically those that can do advanced commands to the bot
var trying = []; //those who try using the advanced commands but can't yet
var reply = ""; //what the bot will reply with

bot.on('start', function() {
	 var params = {
        as_user: true
    }; //makes the bot post as the bot user you set it up as
    bot.postMessageToGroup('scouting_app_testing', 'hello group chat!', params);
});


//checks if user can do certain commands (basically mod status for the bot)
function isVerified(userID){
	for(var i=0; i<verified.length; i++){ //each entry in queue
		if(verified[i].toString().indexOf(userID.toString()) === 0){ //if it matches any of the items in the array
			return true;
		}
	}
	return false;
}

//checks if something exists in an array from a persons sent message
function findInArray(myArray, myMessage){
	for(var i=0; i<myArray.length; i++){ //each entry in queue
		if(myArray[i].indexOf(myMessage) === 0){ //if the message matches any entry in the array
			return i; //returns true/the index i think
		}
	}
	return -1;
}

//finds and sends the reply to the correct channel
function findChannel(channelId){ //channelId = the AlphaNumeric ID Code for a channel, not the string name.
		var params = { 
        as_user: true
        //sends message the same as the bot user it's connected to
    };
	switch(channelId){ //the case switch for each channel: Groups are Private Channels, Channel is regular channels, User is DM. Bot must be in channel to work
		case "G3MENRSHH":
		bot.postMessageToGroup('scouting_app_testing', reply, params);
		break;
		case "C3MJX9J2G":
		bot.postMessageToChannel('scouting_testing', reply, params);
		break;
		case "C23TWDTKL":
		bot.postMessageToChannel('general', reply, params);
		break;
		case "C29NGB13M":
		bot.postMessageToChannel('scouting_all', reply, params);
		break;
		case "C2CM03Z8F":
		bot.postMessageToChannel('scouting_app', reply, params);
		default:
		break;
	}
}

//when a message is sent what does the bot do? This.
bot.on("message", function(data){
	var baseInput = data.text.toString(); //takes the sent message and makes it a string
	var input = baseInput.toLowerCase(); //takes the string of the sent message and makes it all lowercase
	var r = data.channel; //I was too lazy to type data.channel every single time so it's just the channel it was sent in to use in findChannel()
   
	//basic testing phrase
if(input === "ping"){ //if the message sent is "ping"
	reply = "pong!" //the bot will reply with "pong!" wow technology plz if u need to see this you should understand at least this
	findChannel(r);
}

//main function (getting the data)
else if(input.indexOf("robostats") !== -1){
	let index = input.indexOf("robostats"); //where the person typed robostats in their message
	let pika = input.substring(index, 9999) //the rest of the message after that
	let args = pika.split(" ").slice(1); //splits the messages by spaces instead of characters and takes the first thing after "robostats"
	let statsId = Number.parseInt(args[0]); //tried to parse the command into an integer, and will be the team number
	
	function findStats(theUrl){
		request(theUrl, function (error, response, body) {
    		if (!error && response.statusCode == 200) { //successful finding!
    			console.log(body); // Show the HTML for the homepage.
   				return "" + body;
    		}
			else { //if it returns an error code
    			reply = "There's...nothing?! We either don't have information on them, or they don't exist. Spooky. Or I messed up. Oops.";
				findChannel(r);
    		}
		});
	}
			//verifies if its an integer
	if(Number.isInteger(statsId)) {
		var jsonString = findStats("http://10.107.10.14:8080/Teams/" + statsId + "/" + statsId + ".json"); //the http url thing
		var team = JSON.parse(jsonString); //parses into objectj
		reply = "Stats for Team " + statsId + " have been targeted!\n";
		reply += "Team Name: " + team.sTeamName + "\n";
		reply += "Team Number: " + team.iTeamNumber + "\n";
		reply += "Awards List: " + team.awardsList + "\n";
		reply += "Average Gears per Match: " + team.fAvgGearsPerMatch + "\n";
		reply += "Average High Fuel per Match: " + team.fAvgHighFuelPerMatch + "\n";
		reply += "Average Low Fuel per Match: " + team.fAvgLowFuelPerMatch + "\n";
		reply += "Average Ranking Points: " + team.fAvgRankingPoints + "\n";
		findChannel(r);
	} 
	else { //if they didn't say a number after robostats
		reply = "Sorry, you need to say a number.";
		findChannel(r);
	}
}

  

//fun extra features woo
else if (input.startsWith("~add info"))
	//lets users submit random info that might be useful. Basically just a test array.
{
	var information = input.substring(10,9999);
	var index = findInArray(intel," [" + information + "]\n");
	var infoId = index + 1;

			intel.push(" [" + information + "]\n");
			intel[index] = "#" + infoId + " [" + information + "]\n"
			reply = "Thanks!";
			findChannel(r);
}

else if (input === ("~intel"))
	//sends the intel array back as a message.
	{
		if (intel.length === 0)
		{
			reply = "It's empty.";
			findChannel(r);
		}
		else
		{
			var intelstring = "";
			for(var i=0; i<intel.length;i++)
			{
				var myIndex = i + 1;
				intelstring = intelstring + "#" + myIndex + ": " + intel[i] + "\n";
			}
			reply = "This is the list of things people noticed and recorded with ~add info:\n" + intelstring;
			findChannel(r);
		}
	}

else if (input === "~clear")
	//clears the intel array
	{
	if(isVerified(data.user) === 0) //if they are registered to use these commands
		{
		if(intel.length > 0) {
			intel.length = 0;
			reply = "Good job! It's empty now.";
			findChannel(r);
			}
		else //if the array is empty already
		reply = "It's already empty!!";
		findChannel(r);
		}
	else{ //if they aren't registered for using these commands
		trying.push(data.user)
		reply = "You can't right now!";
		findChannel(r);
		}
}

else if(input.startsWith("~info removal")){
	//removes a specific number in the info removal 
	let args = input.split(" ").slice(2);
			//tried to parse the command into an integer
			let intelId = Number.parseInt(args[0]);
		if(isVerified(data.user) === true)
			//verifies if its an integer
			if(Number.isInteger(intelId)) {
				//CHECKS TO SEE IF VALID NUMBER
				if (intelId <= intel.length) {
					//removes thing.
					intel.splice((intelId - 1), 1);
				reply = "Target " + intelId + " has been removed! PewPewPew!";
				findChannel(r);
				} else { //if it isn't a valid number
					reply = "That isn't valid???";
					findChannel(r);
				}
			} else { //if they didn't specify a number
						reply = "Sorry, you need to say a number to remove it.";
						findChannel(r);
					}
		else{ //if they aren't allowed to use the command
	trying.push(data.user)
	reply = "You can't right now!";
	findChannel(r);
		}
}



else if(input === "~verifying"){
	reply = "This is the list of those who tried to use a specialized command without success.\n" + trying.join("\n");
	findChannel(r);
}
});