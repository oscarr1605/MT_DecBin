var machine_to_delete;

function delete_machine(name, id){
	machine_to_delete = id;
	confirm_deletion(name);
}

function confirm_deletion(name){
	document.getElementById('remove_machine_name').innerHTML = 'Delete ' + name + '?';
	$('#delete_modal').modal({
      onApprove : function() {
        remove();
      }
    }).modal('show');
}

function remove(){
	$('#editor_container').addClass('loading');
	$.ajax({
	    type:"POST",
	    url:"/remove_machine/",
	    data:{
        'id': machine_to_delete,
        'csrfmiddlewaretoken': $.cookie('csrftoken'),
	    },
	    dataType: 'json',
    	success: function(data){
	    	if(data['ok']){
	    		$('#user_machine_' + data['id']).remove();
	    		if( $("div[id*='user_machine_']").length == 0){
	    			$('#no_machines').show();
	    		}
	    		delete user_machines[user_machines.indexOf(data['name'])];
	    	}
	    	else{
	    		show_messages(data['errmsg']);
	    	}
    	},
	    complete: function(){
	      $('#editor_container').removeClass('loading');
	    }
	});
}

function toggle_contact_form(){
	$("#contact").slideToggle('slow', function() {});
}

function contact(){
	sendMail(document.getElementById("email").value);
}

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

function load_machine_code(machine_id){
	$('#editor_container').addClass('loading');
	$.get( "/get_machine_code/" + machine_id, function( data ) {
		if(data['ok']){
	  		myCodeMirror.setValue(data['code']);
	  		$('#loader').trigger('click');
		}
	  	else{
	  		show_messages(data['errmsg']);
	  	}
	  	$('#editor_container').removeClass('loading');
	});
}

function load_example_code(machine_id){
	$('#editor_container').addClass('loading');
	$.get( "/get_example_code/" + machine_id, function( data ) {
		if(data['ok']){
	  		myCodeMirror.setValue(data['code']);
	  		$('#loader').trigger('click');
		}
	  	else{
	  		show_messages(data['errmsg']);
	  	}
	  	$('#editor_container').removeClass('loading');
	});
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

function current_to_link(){
	$('#editor_container').addClass('loading');
	if(loadMachine()){
		$.ajax({
		    type:"POST",
		    url:"/submit_link/",
		    data:{
	        'machine_code': myCodeMirror.getValue(),
		    },
		    dataType: 'json',
		    success: function(data){
		    	if(data['ok']){
		    		$("#log_container").slideUp('slow', function(){
			    		$("#shared_link").text('http://' + data['url']);
			    		$('#saved_as_link_modal').modal('show');
					});
		    	}
		    	else{
		    		alert('There was a problem saving the machine');
		    	}
		    },
		    complete: function(){
		      $('#editor_container').removeClass('loading');
		    }
		});
	}
}

function save_current_machine(overwrite){
	if(loadMachine()){
		if(user_machines.indexOf(machine_name) >= 0){
			confirm_overwrite(machine_name);
		}
		else{
			_save_machine();
		}
	}
}

function confirm_overwrite(name){
	$('#overwrite_machine_name').html('Overwrite ' + name + '?');
	$('#overwrite_modal').modal({
      onApprove : function() {
        _save_machine();
      }
    }).modal('show');
}

function _save_machine(){
	$('#editor_container').addClass('loading');
	$.ajax({
	    type:"POST",
	    url:"/submit_user_machine/",
	    data:{
	        'machine_code': myCodeMirror.getValue(),
	        'name': machine_name,
	        'csrfmiddlewaretoken': $.cookie('csrftoken'),
	    },
	    dataType: 'json',
	    success: function(data){
	    	if(data['ok']){
	    		$('#no_machines').hide();
	    		user_machines.push(data['name']);
	    		if(data['new']){
	    			$('#user_machines').append(get_content_for_machine(data['name'], data['id']));
	    		}
	    		$('#user_saved_modal').modal('show');
	    	}
	    	else if(data['ask_overwrite']){
	    		document.getElementById('overwrite_machine_name').innerHTML = 'You already have a machine with this name. Do you want to overwrite it?';
	    		$('#overwriteModal').modal('show');
	    	}
	    	else{
	    		show_messages(data['errmsg']);
	    	}
	    },
	    complete: function(){
	      $('#editor_container').removeClass('loading');
	    }
	});
}

function get_content_for_machine(name, id){
	content = '<div class="item" id="user_machine_' + id + '">';
	content += '<i class="remove link icon" onclick="delete_machine(';
	content += "'" + name + "','" + id + "');\"></i>";
	content += '<a class="text" onclick="load_machine_code('
	content += "'" + id + "');\"> " + name + "</a>";
	return content;
}

function glow_my_machines(){
	var loops = 0;
	function loop(){
	  if(loops < 3){
	  	loops += 1;
	    $('#user_machines_dropdown').fadeOut(300, function(){
	      $(this).fadeIn(100, loop);
	    });
	  }
	  else{
	  	loops = 0;
	  }
	}
	loop();
}
