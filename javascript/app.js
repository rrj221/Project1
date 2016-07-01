	
$('#searchForm').on('submit', function() {

	var searchTerm = $('#artistInput').val();
	var zipCode = $('#zipInput').val();

	//API call to Deezer
	$.ajax({
		url: 'https://deezerdevs-deezer.p.mashape.com/search&q='+searchTerm,
		method: 'GET', 
		headers: {
			'X-Mashape-Key': "wdAXJIZfwhmshvvWuwFtIokrsF8xp1qke3QjsnVCw6dpdiqlbT"
		}
	}).done(function (response) {
		console.log(response);
	});

	var ticketMasterKey = 'MNvdxNymEMKGoJIBvSRWhYxz602IGIZB'
	var url = 	'https://app.ticketmaster.com/discovery/v2/events.json?'
				+'classificationName=music&'+
				'keyword='+searchTerm+'&'+
				'apikey='+ticketMasterKey+'&'+
				'postalCode='+zipCode+'&'+
				'radius=100';

	//API call to ticketmaster
	$.ajax({
		url: url,
		method: 'GET'
	}).done(function (response) {
		console.log(response);
	});


	return false;
});

