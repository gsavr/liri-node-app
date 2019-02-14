require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var figlet = require('figlet');
var inquirer = require("inquirer");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb;
var entry = process.argv.slice(3).join(" ");

function run(){
    if(!process.argv[2]){
        figlet('LIRI', function(err, data) {
        
            console.log(data)
        });
        inquire()
    }
    switch (process.argv[2]) {
        case "concert-this":
        console.log("concert-this");
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

/* function concert(){
    var queryUrl = `https://rest.bandsintown.com/artists/"${entry}"/events.json?callback=?&app_id=codingbootcamp`;
    axios.get(queryUrl).then(  
        function(response,body) {
        var result  =  JSON.parse(body);
        console.log("Venue name " + result.venue.name);
        console.log("Venue location " + result.venue.city);
        console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY"));

        });
}; */

function spotifyThis(){
    if(!entry){
        entry = "The Sign by Ace of Base"
    }
    figlet('LIRI - SPOTIFY tracks!', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            return;
        }
        console.log(data)
    });
    spotify.search({ type:'track',query: entry}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      console.log("Artist: "+data.tracks.items[0].artists[0].name+"\n"+"Track Name: "+data.tracks.items[0].name+"\n"+"Preview this song: "+data.tracks.items[3].preview_url+"\n"+"From album: "+data.tracks.items[0].album.name); 
      });
};

function movie(){
    if(!entry){
        entry ="kill+bill";
        console.log("If you haven't watched 'Kill Bill' then you should: <http://www.imdb.com/title/tt0266697/> It's limb losing, skull cracking, eye gouging fun!")
    }
    figlet('LIRI - OMDB movies!', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            return;
        }
        console.log(data)
    });
    var queryUrl = `http://www.omdbapi.com/?t="${entry}"&y=&plot=short&apikey=${omdb.key}`;
    axios.get(queryUrl).then(  
        function(response) {
          console.log("WELCOME TO IMDB! YOUR SOURCE FOR MOVIE INFO")
          console.log("Title: " + response.data.Title+"\n"+"Released on: " + response.data.Released+"\n"+"IMDB Rating: " + response.data.Ratings[0].Value+"\n"+"Rotten Tomatoes Rating: " + response.data.Ratings[1].Value+"\n"+"Produced in: " + response.data.Country+"\n"+"Language: " + response.data.Language+"\n"+"Plot: " + response.data.Plot+"\n"+"Starring: " + response.data.Actors);
        });
};

function doWhatItSays(){
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        //console.log(data);
        var doWhatItSays = data.split(",");
        console.log(doWhatItSays);
        process.argv[2]=doWhatItSays[0];
        entry=doWhatItSays[1];
        run()
        /* process.argv[2]=doWhatItSays[2];
        entry=doWhatItSays[3];
        run() */
      });
};

function inquire(){
    inquirer.prompt([
        {
            type: "list",
            message: "Hello, I'm LIRI, what would like you like to do today?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "function"
        },
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
};

run()