// $('.navbar-collapse-1').collapse();

$(document).ready(function () {
	// console.log('hey');
	var socket = io('//localhost:3000');
	socket.emit('hi','hi from client');
	socket.on('socketToMe', function (data) {
		console.log(data);
	});
});
