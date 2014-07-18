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

function subscribe(){
	$.ajax({
		url: "/user/subscribe",
		error: function (data, textStatus, xhr) {
			if (xhr === "Conflict"){
				alert("重复关注！");
				$("#login_container").hide();
				$(".mc_content").attr("style", "display: inline;");
			}
			else{
				alert("关注失败！" + data.responseText);
			}
		},
		success: function (data, textStatus) {
			$("#login_container").hide();
			$(".mc_content").attr("style", "display: inline;");
			putMsg(data);
		}
	});
}

function unsubscribe(){
	$.ajax({
		url: "/user/unsubscribe",
		error: function (data, textStatus, xhr) {
			if (xhr === "Conflict"){
				alert("还未关注！");
				$("#login_container").show();
				$(".mc_content").attr("style", "display: none;");
			}
			else{
				alert("取消关注失败！" + data.responseText);
			}
		},
		success: function (data, textStatus, xhr) {
			$("#login_container").show();
			$(".mc_content").attr("style", "display: none;");
		}
	});
}

function switchDiv(type) {
	switch (type){
		case "text":
			$(".custom_menu_input_bar").show();
			$(".custom_menu_preview_bar").hide();
			$(".switch_button").attr("onclick", "return switchDiv('menu')");
			break;
		case "menu":
			$(".custom_menu_input_bar").hide();
			$(".custom_menu_preview_bar").show();
			$(".switch_button").attr("onclick", "return switchDiv('text')");
			break;
	}
}