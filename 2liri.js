require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var CFonts = require('cfonts');
var inquirer = require("inquirer");
var moment = require('moment')
var now = moment();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb;
var entry = process.argv.slice(3).join(" ");

//Run LIRI 
function run(){
    CFonts.say('---LIRI---', {
        font: 'console',    // define the font face
        colors: ['white'],  // define all colors
    });
    if(!process.argv[2]){  //if no input run inquire q's
        inquire()
    }
    switch (process.argv[2]) {
        case "concert-this":
        //console.log("concert-this");
        concert()
            break;
        case "spotify-this-song":
            //console.log("spotify-this-song");
            spotifyThis()
            break;
        case "movie-this":
            //console.log("movie-this");
            movie()
            break;
        case "do-what-it-says":
            //console.log("do-what-it-says");
            doWhatItSays()
            break;
    };
};

//bandsintown functionality --- not working 
function concert(){
    CFonts.say('LIRI \n BANDSINTOWN!', {
        font: 'block',    // define the font face
        colors: ['#00B4B3', 'white'], // define all colors
    });
    if(!entry){
        entry="band";
        CFonts.say('you did not pick a band', {
            font: 'chrome',  // define the font face
            colors: ['white'],  // define all colors
        });
    }
    var queryUrl = "https://rest.bandsintown.com/artists/"+entry+"/events?app_id=codingbootcamp"
    axios.get(queryUrl).then(function(response){
    var concert = response.data 
    console.log("(There may be no upcoming shows for your band if no results shown, try a different band)\n")
    concert.forEach(event =>  {
        var data = "Event: "+event.venue.name+"\nLocation: "+event.venue.city+", "+event.venue.country+".\nTo be held on: "+moment(event.datetime).format("LLLL")+"\n---------------------";
        console.log("--- "+now.format("LLLL")+"\nWELCOME TO BANDSINTOWN! YOUR PLACE FOR EVERY CONCERT IN YOUR TOWN!")
        console.log(data)
        fs.appendFile("log.txt", "\n"+now.format("LLLL")+"\nBANDSINTOWN"+"\n"+data, function(err){ 
            if (err){console.log(err)}
          })
    }) 
    });
}; 

// SPOTIFY search
function spotifyThis(){
    CFonts.say('LIRI \n SPOTIFY!', {
        font: 'block', // define the font face
        colors: ['#1ED760', '#F8C444'], // define all colors
    });
    if(!entry){
        entry = "The Sign by Ace of Base"
    }
    spotify.search({ type:'track',query: entry}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      var data =  "Artist: "+data.tracks.items[0].artists[0].name+"\nTrack Name: "+data.tracks.items[0].name+"\nPreview this song: "+data.tracks.items[3].preview_url+"\nFrom album: "+data.tracks.items[0].album.name+"\n---";

      console.log("--- "+now.format("LLLL")+"\nWELCOME TO SPOTIFY! LOOK UP YOUR FAVORITE SONGS!\n---")
      console.log(data); 
      fs.appendFile("log.txt", "\n"+now.format("LLLL")+"\nSPOTIFY"+"\n"+data, function(err){ 
        if (err){console.log(err)}
      })
      });
};

//OMDB search
function movie(){
    CFonts.say('LIRI \n OMDB!', {
        font: 'block',  // define the font face
        colors: ['red', 'white'], // define all colors
    });
    if(!entry){
        entry ="kill+bill";
        console.log("If you haven't watched 'Kill Bill' then you should!: <http://www.imdb.com/title/tt0266697/> It's limb losing, skull cracking, eye gouging fun!\n---")
    }
    var queryUrl = `http://www.omdbapi.com/?t="${entry}"&y=&plot=short&apikey=${omdb.key}`;
    axios.get(queryUrl).then(  
        function(response) {
          var data = "Title: " + response.data.Title+"\nReleased on: " + response.data.Released+"\nIMDB Rating: " + response.data.Ratings[0].Value+"\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value+"\nProduced in: " + response.data.Country+"\nLanguage: " + response.data.Language+"\nPlot: " + response.data.Plot+"\nStarring: " + response.data.Actors+"\n---";

          console.log("--- "+now.format("LLLL")+"\nWELCOME TO IMDB! YOUR SOURCE FOR MOVIE INFO\n---")
          console.log(data);
          fs.appendFile("log.txt", "\n"+now.format("LLLL")+"\nOMDB"+"\n"+data, function(err){ 
            if (err){console.log(err)}
          })
        })
        .catch(function (error) {
            console.log("error occured: "+error);
        });
};

//Read random.txt and use as parameters
function doWhatItSays(){
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log("error: "+error);
        }
        console.log("READING RANDOM.TXT");
        var doWhatItSays = data.split(",");
        console.log(doWhatItSays);
        process.argv[2]=doWhatItSays[0];
        entry=doWhatItSays[1];
        run()
      });
};

//Questions to ask user
function inquire(){
    CFonts.say("hello, i'm liri", {
        font: 'simple',   // define the font face
        colors: ['white'],   // define colors
    });
    inquirer.prompt([
        {
            type: "list",
            message: "What would like you like to do today?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "function"
        },
        
    ])
    .then(function(inquirerResponse) {
        if(inquirerResponse.function !== "do-what-it-says"){
            process.argv[2]=inquirerResponse.function;
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please give me the name of the band / song / movie you would like me to look up:",
                    name: "entry"
                },
                {
                    type: "confirm",
                    message: "Are you sure?",
                    name: "confirm",
                    default: true
                }
            ])
            .then(function(inquirerResponse) {
                if (inquirerResponse.confirm) {
        
                    entry=inquirerResponse.entry;
                    console.log("Please wait one moment...");
                    run()
                }
                else{
                    console.log("I will be here waiting...")
                }
            });
        }
        else{
            process.argv[2]=inquirerResponse.function;
                    entry=inquirerResponse.entry;
                    console.log("Please wait one moment...");
                    run()
        }
    });
};

run()