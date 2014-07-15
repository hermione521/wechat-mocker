$(document).ready(function() {
	// set menu
	$.getJSON("/sandbox/menu.json", function (result) {
		// add one-based index
		for (var i = 0; i < result.button.length; i++) {
			result.button[i].indexOne = i + 1;
		}

		// compile template
		var source = $("#entry-template").html();
		var template = Handlebars.compile(source);
		var newHtml = template(result);
		$("#entry-template").html(newHtml);
	});
});

function putMsg(msg){
	var source;
	switch (msg.msgType){
		case "news":
			if (msg.items.length === 1){
				source = $("#oneNews-template").html();
				msg = msg.items[0];
			}
			else{
				source = $("#manyNews-template").html();
			}
			break;
		case "text":
			source = $("#text-template").html();
			msg = msg; //msg.content
			break;
		default:
			source = $("#text-template").html();
			msg = {
				content: "received errmsg!"
			};
	}
	var template = Handlebars.compile(source);
	var newHtml = template(msg);

	$(".custom_menu_preview_content").append(newHtml);
}


function menuSubButton(cur){
	var eventKey = $(cur).attr("data-id");
	$.ajax({
		url: "/user/menuClick",
		data: { eventKey: eventKey },
		success: function (data, textStatus){
			putMsg(data);
		}
	});
}

function menuMainButton(cur){
	var prev = $(cur).prev();
	if (prev.length === 0 || prev.attr("class").search(/custom_menu_preview_item/) !== -1){
		menuSubButton(cur);
	}
	else if (prev.attr("class").search(/show/) !== -1){
		prev.toggleClass('show hide');
	}
	else{
		prev.toggleClass('hide show');
	}
}

function sendText(){
	var content = $("#input_content").val();
	console.log(content);
	if (content !== ""){
		$.ajax({
			url: "/user/text",
			data: { content: content },
			success: function (data, textStatus){
				putMsg(data);
			}
		});
	}
}

function switchDiv(type) {
	switch (type){
		case "text":
			$(".custom_menu_input_bar").attr("style", "display:inline;");
			$(".custom_menu_preview_bar").attr("style", "display:none;");
			$(".switch_button").attr("onclick", "return switchDiv('menu')");
			break;
		case "menu":
			$(".custom_menu_input_bar").attr("style", "display:none;");
			$(".custom_menu_preview_bar").attr("style", "display:inline;");
			$(".switch_button").attr("onclick", "return switchDiv('text')");
			break;
	}
}