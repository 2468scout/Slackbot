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

function findIntel(myInfo, myIntel){
	for(var i=0; i<myQueue.length; i++){
		if(myQueue[i].indexOf(myUser) === 0){
			return i;
		}
	}
	return -1;
}


//might work
bot.on("message", function(data){
	var input = data.text;
if(input === "HELLO PLZ"){
	trying.push(data.user)
	bot.postMessageToGroup("scouting_app_testing", "hi!")
}

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

else if (input === "~submitted")
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



