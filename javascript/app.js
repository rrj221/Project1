var addToFB = true;
var searchCount = 0;
var recentSearchesHidden = true;

$('.recentSearchesArea').hide();

var config = {
	apiKey: "AIzaSyDI3iY0pqME0WKatwGYdSINUWejRu1YSjM",
	authDomain: "project-8743018060077641250.firebaseapp.com",
	databaseURL: "https://project-8743018060077641250.firebaseio.com",
	storageBucket: "project-8743018060077641250.appspot.com",
	};
firebase.initializeApp(config);

//create ref to database
var dbRef = firebase.database().ref();
	
$('#searchForm').on('submit', function() {

	var searchTerm = $('#artistInput').val();
	var zipCode = $('#zipInput').val();

	if (addToFB) {
		recentSearchesToFB(searchTerm, zipCode);
	}

	$('#songsTableBody').empty();
	$('#concertsTableBody').empty();

	//hide message Div
	$('.concertsMessage').hide();
	$('.songsMessage').hide();

	if (searchTerm === '') {
		$('.songsMessage').show().text('Please type in an artist');
		emptyInputs();
	}

	//API call to Deezer
	$.ajax({
		url: 'https://deezerdevs-deezer.p.mashape.com/search&q='+searchTerm,
		method: 'GET', 
		headers: {
			'X-Mashape-Key': "wdAXJIZfwhmshvvWuwFtIokrsF8xp1qke3QjsnVCw6dpdiqlbT"
		}
	}).done(function (response) {
		console.log(response);
		var songsDataArray = response.data;
		if (songsDataArray.length === 0) {
			$('.songsMessage').show().text('No songs found');
		} else if (songsDataArray.length <= 5) {
			for (var i = 0; i < songsDataArray.length; i++) {
				songsTable(i, songsDataArray);
			}
		} else if (songsDataArray.length > 5) {
			for (var i = 0; i < 5; i++) {
				songsTable(i, songsDataArray);
			}
		}
	});

	if (zipCode.length != 5) {
		$('.concertsMessage').show().text('please enter a 5 digit zip code');
		emptyInputs();
		return false;
	}


	var ticketMasterKey = 'MNvdxNymEMKGoJIBvSRWhYxz602IGIZB'
	var tmUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?'+
				'classificationName=music&'+
				'keyword='+searchTerm+'&'+
				'apikey='+ticketMasterKey+'&'+
				'postalCode='+zipCode+'&'+
				'radius=100';

	//API call to ticketmaster
	$.ajax({
		url: tmUrl,
		method: 'GET'
	}).done(function (response) {
		console.log(response);
		var eventsStuff = response._embedded;
		if (!eventsStuff) {
			$('.concertsMessage').show().text('No concerts found');
		} else {
			// $('.message').show().text('concerts found');
			var eventsArray = response._embedded.events;
			if (eventsArray.length <= 5) {
				for (var i = 0; i < eventsArray.length; i++) {
					concertsTable(i, eventsArray);
				}
			} else if (eventsArray.length > 5) {
				for (var i = 0; i < 5; i++) {
					concertsTable(i, eventsArray);
				}
			}
		}
	});

	emptyInputs();
	return false;
});

function concertsTable (i, eventsArray) {
	var date = eventsArray[i].dates.start.localDate;
	console.log(date);
	var time = eventsArray[i].dates.start.localTime;
	console.log(time);
	var name = eventsArray[i].name;
	console.log(name);
	var priceMin = false;
	var priceMax = false;
	if (eventsArray[i].priceRanges) {
		priceMin = eventsArray[i].priceRanges[0].min;
		console.log(priceMin);
		priceMax = eventsArray[i].priceRanges[0].max;
		console.log(priceMax);	
	}
	var ticketsUrl = eventsArray[i].url;
	console.log(ticketsUrl);

	var formattedDate = moment(date).format("MMM Do YY");
	console.log(formattedDate);

	var formattedTime = formatTime(time);
	console.log(formattedTime);

	var priceRange = false;
	if (priceMin && priceMax) {
		var priceRange = "$"+priceMin+" - $"+priceMax;
	}

	var link = $('<a>', {
		href: ticketsUrl,
		target: "_blank",
		text: 'Tickets'
	});

	var tableRow = $('<tr>');
	$('<th>', {
		scope: 'row', 
		text: i + 1
	}).appendTo(tableRow);
	appendIfFound(formattedTime, tableRow);
	appendIfFound(formattedDate, tableRow);
	appendIfFound(name, tableRow);
	appendIfFound(priceRange, tableRow);
	$('<td>').append(link).appendTo(tableRow);

	tableRow.appendTo('#concertsTableBody');
};

function appendIfFound(thingToAppend, tableRow) {
	if (thingToAppend !== false) {
		$('<td>').text(thingToAppend).appendTo(tableRow);
	} else {
		$('<td>').text('N/A').appendTo(tableRow);
	}
}

function formatTime(time) {

	// http://stackoverflow.com/questions/29206453/best-way-to-convert-military-time-to-standard-time-in-javascript

	var time = time.split(':'); // convert to array

	// fetch
	var hours = Number(time[0]);
	var minutes = Number(time[1]);
	var seconds = Number(time[2]);

	// calculate
	var timeValue = "" + ((hours >12) ? hours - 12 : hours);  // get hours
	timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
	timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

	return timeValue;
};


function songsTable(i, songsDataArray) {
	var name = songsDataArray[i].title;
	console.log(name);
	var album = songsDataArray[i].album.title;
	console.log(album);
	var previewUrl = songsDataArray[i].preview;
	console.log(previewUrl);

	var link = $('<a>', {
		href: previewUrl,
		target: "_blank",
		text: 'Preview'
	});

	var tableRow = $('<tr>');
	$('<th>', {
		scope: 'row', 
		text: i + 1
	}).appendTo(tableRow);
	$('<td>').text(name).appendTo(tableRow);
	$('<td>').text(album).appendTo(tableRow);
	$('<td>').append(link).appendTo(tableRow);

	tableRow.appendTo($('#songsTableBody'));
};

function emptyInputs() {
	$('#artistInput').val('');
	$('#zipInput').val('');
};

function recentSearchesToFB(searchTerm, zipCode) {
	var newSearch = {
		searchTerm: searchTerm,
		zipCode: zipCode
	};

	dbRef.push(newSearch);
};

dbRef.on('child_added', function (snapshot) {
	console.log(snapshot.val());
	console.log(snapshot.key);
	var searchTerm = snapshot.val().searchTerm;
	var zipCode = snapshot.val().zipCode;

	var searchAgainButton = $('<button>', {
		class: 'btn btn-primary searchAgain', 
		text: 'Search Again',
		'data-artist': searchTerm,
		'data-zip': zipCode,
	});

	var key = snapshot.key;
	var deleteButton = $('<button>', {
		class: 'btn btn-danger deleteButton',
		text: 'x',
		'data-id': searchCount,
		'data-key': key
	});

	var tableRow = $('<tr>', {
		class: 'recentSearchRow',
		'data-id': searchCount
	});
	$('<td>').text(searchTerm).appendTo(tableRow);
	$('<td>').text(zipCode).appendTo(tableRow);
	$('<td>').append(searchAgainButton).appendTo(tableRow);
	$('<td>').append(deleteButton).appendTo(tableRow);

	tableRow.prependTo($('#recentSearchesTableBody'));

	deleteFifthRow();
	searchCount++;
});

$('#recentSearchesTableBody').on('click', '.searchAgain', function() {
	$('#artistInput').val($(this).data('artist'));
	$('#zipInput').val($(this).data('zip'));
	addToFB = false;
	$('#searchForm').trigger('submit');
	addToFB = true;
});

$('#recentSearchesTableBody').on('click', '.deleteButton', function() {
	$(this).closest('tr').remove();
	var key = $(this).context.dataset.key;
	dbRef.child(key).remove();
});	

function deleteFifthRow() {
	$('#recentSearchesTableBody tr').each(function() {
		// console.log($(this).context.dataset.id);
		var id = $(this).context.dataset.id;
		if (id < searchCount - 4) {
			$(this).remove();
		}

	});
};

$('.recentSearchesButton').on('click', function () {
	if (recentSearchesHidden) {
		$('.recentSearchesArea').show();
		recentSearchesHidden = false;
	} else {
		$('.recentSearchesArea').hide();
		recentSearchesHidden = true;
	}
});