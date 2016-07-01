	
$('.btn').on('click', function() {

	var searchTerm = $('.search-query').val();

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

	//API call to ticketmaster
	$.ajax({
		url: 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&keyword='+searchTerm+'&apikey='+ticketMasterKey,
		method: 'GET'
	}).done(function (response) {
		console.log(response);
	});
});

