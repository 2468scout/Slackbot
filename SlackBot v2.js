var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'xoxb-123980065522-isdHsz6aCBfcwTrT4XcIjhFb',
    name: 'robostats'
};

var bot = new Bot(settings);
var intel = ["place", "holding", "stuff", "hi"];
var verified = ["U2CLWCW7L", "U2CLC69U6", "U2CL9P7QU"];
var trying = [];
var reply = "";

bot.on('start', function() {
	 var params = {
        as_user: true
    };

   // bot.postMessageToChannel('some-channel-name', 'Hello channel!');
   	//bot.postMessageToUser('kate_denier', "message");
    bot.postMessageToGroup('scouting_app_testing', 'hello group chat!', params);
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

function findInArray(myArray, myMessage){
	for(var i=0; i<myArray.length; i++){
		if(myArray[i].indexOf(myMessage) === 0){
			return i;
		}
	}
	return -1;
}



//not working or not tested
//GET REQUEST FUNCTION




//working now
function findChannel(channelId){
		var params = {
        as_user: true
    };
	switch(channelId){
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


bot.on("message", function(data){
	var baseInput = data.text.toString(); 
	var input = baseInput.toLowerCase();
	var r = data.channel;
   
	//basic testing phrase
if(input === "hello"){
	reply = "ni hao!"
	findChannel(r);
}

//testing
if(input === "t"){
	findStats("https://httpbin.org/ip");
	findChannel(r);

}


//main function
else if(input.indexOf("robostats") !== -1){
	let index = input.indexOf("robostats");
	let pika = input.substring(index, 9999)
	let args = pika.split(" ").slice(1);
			//tried to parse the command into an integer
			let statsId = Number.parseInt(args[0]);
			var subUrl = "/ip" + statsId;

			function findStats(theUrl){
	var request = require('request');
	request(theUrl, function (error, response, body) {
    	if (!error && response.statusCode == 200) {
        	console.log(body); // Show the HTML for the homepage.
        	reply = "Stats for Team " + statsId + " have been targeted! katakatakata...this is it! (this is why you don't put Kate in charge of dialogue)\n" + body;
        		findChannel(r);
    	}
    	else {
    		reply = "There's...nothing?! We either don't have information on them, or they don't exist. Spooky. Or the most likely, Kate messed up the code again. Oops.";
					findChannel(r);
    				}
				});
			}
			//verifies if its an integer
			if(Number.isInteger(statsId)) {
					findStats("https://httpbin.org" + subUrl);
				} 
			else {
					reply = "Sorry, you need to say a number.";
					findChannel(r);
					}
}

  

//fun extra features woo
else if (input.startsWith("~add info"))
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

else if (input === "~read")
	{
	if(isVerified(data.user) === 0)
		{
		if(intel.length > 0) {
			intel.length = 0;
			reply = "Good job! It's empty now.";
			findChannel(r);
			}
		else
		reply = "It's already empty!!";
		findChannel(r);
		}
	else{
		trying.push(data.user)
		reply = "You aren't verified for this role. Contact @kate_denier if you think this is a mistake.";
		findChannel(r);
		}
}

else if(input.startsWith("~info removal")){
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
				reply = "Target " + intelId + " has been removed! PewPewPew!";
				findChannel(r);
				} else {
					reply = "That isn't valid???";
					findChannel(r);
				}
			} else {
						reply = "Sorry, you need to say a number to remove it.";
						findChannel(r);
					}
		else{
	trying.push(data.user)
	reply = "You aren't verified for this role. Contact @kate_denier if you think this is a mistake.";
	findChannel(r);
		}
}



else if(input === "~verifying"){
	reply = "This is the list of those who tried to use a verified only command without success.\n" + trying.join("\n");
	findChannel(r);
}
});

