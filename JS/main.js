const get_clients_php = "http://uberprototech.com/facturapp/PHP/getClients.php";
const login_php = "http://uberprototech.com/facturapp/PHP/login.php";
const clientBox_src = "./SrcHTML/clientBox_template.html";

document.addEventListener("DOMContentLoaded", function(event) {
	var jsoned = JSON.parse('{"method":"POST","url":"","data":[]}'); jsoned.url = login_php;
	jsoned.data = [{"name":"Username","value":"UTE150219H68"},{"name":"Password","value":"latiendita"}];
	req = call_page(jsoned);
	/*Proceso de Login... borrar para la versión final*/
	req.onload = function(){
		if(req.responseText.split('_')[0] == 'Scs'){
			update_clients();
		}else{
			alert('Información de login inválida');
		}
	};

	req.onerror = function(){alert('Error de conexión en login!');};
});



function add_client_listeners(){
	var cat_links = document.getElementsByClassName("wcore_clientBox"); var n = cat_links.length;
	for(i = 0;i < n;i++){
		cat_links[i].addEventListener('click',function(){
			var menu = document.getElementById('wcore_major');
			if(this.parentNode.className == "wcore_client_selected"){
				this.parentNode.className = "wcore_clientExBox";
				menu.className = "wcore_majorOptions wcore_menuInVisible";
			}else{
				var all_clients = this.parentNode.parentNode.childNodes; var n = all_clients.length;
				for(i = 0;i < n;i++){
					if(all_clients[i].className == "wcore_client_selected"){all_clients[i].className = "wcore_clientExBox";}
				}
				this.parentNode.className = "wcore_client_selected";
				menu.className = "wcore_majorOptions wcore_menuVisible";
			}
		});
	}
	return false;
}

function update_clients(){
	var jsoned = JSON.parse('{"method":"GET","url":"","data":[]}'); jsoned.url = get_clients_php;
	req = call_page(jsoned);
	/*Obtención de lista de clientes*/
	req.onload = function(){
		var json_arr = JSON.parse(req.responseText);
		var client_data = document.getElementById("fdc1");
		var n = json_arr.length;
		
		var jsoned = JSON.parse('{"method":"GET","url":"","data":[]}'); jsoned.url = clientBox_src;
		/*Obtenemos el template de clientBox*/
		req = call_page(jsoned);
		req.onload = function(){
			client_data.innerHTML = "";
			for(i = 0;i < n;i++){
				var par_div = document.createElement("div");
				par_div.className = "wcore_clientExBox"; par_div.id = json_arr[i].id;
				par_div.innerHTML = req.responseText.replace(/[\r\n\t]/g, "");
				par_div.getElementsByClassName("wcore_client_name_holder")[0].innerHTML = json_arr[i].name;
				par_div.getElementsByClassName("wcore_client_RFC")[0].innerHTML = json_arr[i].rfc;
				client_data.appendChild(par_div);
			}
			add_client_listeners();
		};
		req.onerror = function(){alert('Error al conseguir el template de clientBox');};
	};
	req.onerror = function(){alert('Error de conexión al solicitar clientes');};
	return false;
}

function call_page(jsonMsg){
	var req = new XMLHttpRequest();
	
	/*Message*/
	var method = jsonMsg.method;
	var resdata = "";
	for(i = 0; i < jsonMsg.data.length; i++){
		resdata = resdata + jsonMsg.data[i].name + "=" + jsonMsg.data[i].value + "&"; 
	}
	resdata = resdata.substring(0, resdata.length - 1);/*Remove the last &*/
	
	if(method == "GET"){
		req.open("GET", jsonMsg.url + "?" + resdata, true);
		req.send();
	}else if(method == "POST"){
		req.open("POST", jsonMsg.url, true);
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
		req.send(resdata);
	}
	
	return req;
}