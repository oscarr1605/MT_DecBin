function hide_log(){
	$("#log_container").slideUp('slow', function(){});
}

function show_messages(msg){
	$("#log_container").slideUp('slow', function(){
			document.getElementById("log").innerHTML = msg;
			$("#log_container").slideDown('slow', function(){});
		});
}

function hide_messages(){
	$("#log_container").slideUp('slow', function(){});
}

function show_alerts(msg){
	$("#alerts_container").slideUp('slow', function(){
			document.getElementById("alert").innerHTML = msg;
			$("#alerts_container").slideDown('slow', function(){});
		});
}

function hide_alerts(){
	$("#alerts_container").slideUp('slow', function(){});
}

function hide_messages(){
	$("#messages_container").slideUp('slow', function(){});
}

function change_ncells(n){
	document.getElementById('num_cells').innerHTML = n;
	new_ncells = n + 2;
}

function load_code(code){
	if(code.length >= 10){
		myCodeMirror.setValue(code);
	}
	else{
		jQuery.get('transiciones.txt', function(data){
			myCodeMirror.setValue(data);
		});
	}
}
