var config = {
    apiKey: "AIzaSyA23pmgFZe9BPYes6N7KMLrEOuyhAwGRRI",
    authDomain: "trains-16f08.firebaseapp.com",
    databaseURL: "https://trains-16f08.firebaseio.com",
    projectId: "trains-16f08",
    storageBucket: "trains-16f08.appspot.com",
    messagingSenderId: "152757757181"
};
firebase.initializeApp(config);

var database = firebase.database();

// database.ref().once("value", function(snapshot) {
//     console.log(snapshot.val());
// });

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequency-input").val().trim();

    var trainInfo = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    };

    database.ref().push(trainInfo);

    $(".clear-class").val("");
});

    // This function runs every time a new train is added
    // Firebase event for adding a train schedule to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());

    // Store all information into a variable.

    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var firstTrainTime = snapshot.val().firstTrainTime;
    var frequency = snapshot.val().frequency;

    // Train Info

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);
    
    // Convert First time
    var convertedFirstTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");

    // Find current time
    var currentTime = moment();

    // Find the difference in minutes between the time the train started and the time now
    var diffTime = moment().diff(moment(convertedFirstTime), "minutes");

    //Find the remainder
    var tRemainder = diffTime%frequency;

    // minutes until Next Train

    var minsTil = frequency - tRemainder;

    // when is the next train?

    var nextTrain = moment().add(minsTil, "minutes").format("HH:mm");

    // Create the "New Train" Info row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minsTil),
    );

  // Append the new row to the table
  $("#trainTableBody").append(newRow);
});

    //TODO: Create HTML elements for your rows for the incoming train info
    // $("<td>") with the info for trainName then appended to a $("<tr>") which finally is
    // appended to the <tbody> we have in index.html
    // You're likely going to have to do the math to figure out next train, but we can ignore
    // that for now