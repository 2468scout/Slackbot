var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'xoxb-123980065522-isdHsz6aCBfcwTrT4XcIjhFb',
    name: 'robostats'
};

var bot = new Bot(settings);
var intel = [];
var verified = ["U2CLWCW7L", "U2CLC69U6", "U2CL9P7QU"];
var trying = [];
var reply = ""

bot.on('start', function() {
   // bot.postMessageToChannel('some-channel-name', 'Hello channel!');
   // bot.postMessageToUser('some-username', 'hello bro!');
    bot.postMessageToGroup('scouting_app_testing', 'hello group chat!');
});


//STUFF
//functions
function isVerified(userID){
	for(var i=0; i<verified.length; i++){ //each entry in queue
		if(verified[i].toString().indexOf(userID.toString()) === 0){
			return true;
		}
	}
	return false;
}
//currently not used; will be the names to get stuff from server lol it doesn't actually do anything or work for anything rn.
function findStats(myInfo, myStats){
	for(var i=0; i<myQueue.length; i++){
		if(myQueue[i].indexOf(myUser) === 0){
			return i;
		}
	}
	return -1;
}
//need one to find what chat a message is posted in
function replyWhere(data){
	if(data.channels !== -1){
		let channel = data.channels
		bot.postMessageToChannel(channel.toString, reply)
	}
	else if(data.groups !== -1){
		let group = data.groups
		return typeof data.groups
		bot.postMessageToGroup(group.toString, reply)
	}

}

//testing stuff IT DOESNT WORK WPUEHWFIDSJ
bot.on("message", function(data){
	var input = data.text;
if(input === "HELLO PLZ"){
	trying.push(data.user)
	reply = "working!"
	replyWhere(data)
	
}
//main function
if(input.indexOf("robostats #") !== -1){
	let args = input.split(" ").slice(2);
			//tried to parse the command into an integer
			let statsId = Number.parseInt(args[0]);
			//verifies if its an integer
			if(Number.isInteger(statsId)) {
				//NEED TO CHANGE\/ (checks to see if the int is within the queue length) to CHECKS TO SEE IF VALID NUMBER
				if (statsId <= intel.length) {
					//removes thing. needs to change to gives the thing
					intel.splice((intelId - 1), 1);
					bot.postMessageToGroup("scouting_app_testing", "Stats for Team " + statsId + " have been targeted! katakatakata...this is it! (this is why you don't put Kate in charge of dialogue)");
				} else {
					bot.postMessageToGroup("scouting_app_testing", "There's...nothing?! We either don't have information on them or they don't exist. Spooky.");
				}
			} else {
						bot.postMessageToGroup("scouting_app_testing", "Sorry, you need to say a number to remove it.");
					}
}



//fun extra features woo
else if (input.startsWith("~add info"))
{
	var information = input.substring(10,9999);
	var index = intel.indexOf(" [" + information + "]\n");
	var infoId = index + 1;

			intel.push(" [" + information + "]\n");
			intel[index] = "#" + infoId + " [" + information + "]\n"
			bot.postMessageToGroup("scouting_app_testing", "Thanks!");
}

else if (input.indexOf("~intel") === 0)
	{
		if (intel.length === 0)
		{
			bot.postMessageToGroup("scouting_app_testing", "It's empty.");
		}
		else
		{
			var intelstring = "";
			for(var i=0; i<intel.length;i++)
			{
				var myIndex = i + 1;
				intelstring = intelstring + "#" + myIndex + ": " + intel[i] + "\n";
			}
			bot.postMessageToGroup("scouting_app_testing", "this is the correct method !!!111! here:\n" + intelstring);
		}
	}

else if (input === "~read")
	{
	if(isVerified(data.user) === 0)
		{
		if(intel.length > 0) {
			intel.length = 0;
			bot.postMessageToGroup("scouting_app_testing", "Good job! It's empty now.");
			}
		else
		bot.postMessageToGroup("scouting_app_testing", "It's already empty!!");
		}
	else{
		trying.push(data.user)
		bot.postMessageToGroup("scouting_app_testing", "You aren't verified for this role. Contact @kate_denier if you think this is a mistake.");
		}
}

else if(input.startsWith("~robostats removal")){
	let args = input.split(" ").slice(2);
			//tried to parse the command into an integer
			let intelId = Number.parseInt(args[0]);
		if(isVerified(data.user) === true)
			//verifies if its an integer
			if(Number.isInteger(intelId)) {
				//NEED TO CHANGE (checks to see if the int is within the queue length) to CHECKS TO SEE IF VALID NUMBER
				if (intelId <= intel.length) {
					//removes thing.
					intel.splice((intelId - 1), 1);
					bot.postMessageToGroup("scouting_app_testing", "Target " + intelId + " has been removed! PewPewPew!");
				} else {
					bot.postMessageToGroup("scouting_app_testing", "That isn't valid???");
				}
			} else {
						bot.postMessageToGroup("scouting_app_testing", "Sorry, you need to say a number to remove it.");
					}
		else{
	trying.push(data.user)
	bot.postMessageToGroup("scouting_app_testing", "You aren't verified for this role. Contact @kate_denier if you think this is a mistake.");
		}
}



else if(input === "~verifying"){
	bot.postMessageToGroup("scouting_app_testing", "This is the list of those who tried to use a verified only command without success.\n" + trying.join("\n"));
}
});


