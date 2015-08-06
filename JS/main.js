const get_clients_php = "http://uberprototech.com/facturapp/PHP/getClients.php";
const login_php = "http://uberprototech.com/facturapp/PHP/login.php";
const clientBox_src = "./SrcHTML/clientBox_template.html";

document.addEventListener("DOMContentLoaded", function(event) {
	var jsoned = JSON.parse('{"method":"POST","url":"","data":[]}'); jsoned.url = login_php;
	jsoned.data = [{"name":"Username","value":"UTE150219H68"},{"name":"Password","value":"latiendita"}];
	req = call_page(jsoned);
	req.onload = function(){
		if(req.responseText.split('_')[0] == 'Scs'){
			var jsoned = JSON.parse('{"method":"GET","url":"","data":[]}'); jsoned.url = get_clients_php;
			req = call_page(jsoned);
			req.onload = function(){
				var json_arr = JSON.parse(req.responseText);
				var client_data = document.getElementById("fdc1");
				var n = json_arr.length;
				
				var jsoned = JSON.parse('{"method":"GET","url":"","data":[]}'); jsoned.url = clientBox_src;
				req = call_page(jsoned);
				req.onload = function(){
					client_data.innerHTML = "";
					for(i = 0;i < n;i++){
						var par_div = document.createElement("div");
						par_div.className = "wcore_clientBox"; par_div.id = json_arr[i].id;
						par_div.innerHTML = req.responseText.replace(/[\r\n\t]/g, "");
						par_div.getElementsByClassName("wcore_client_name_holder")[0].innerHTML = json_arr[i].name;
						par_div.getElementsByClassName("wcore_client_RFC")[0].innerHTML = json_arr[i].rfc;
						client_data.appendChild(par_div);
					}
				};
				req.onerror = function(){alert('Error al conseguir el template de clientBox');};
			};
			req.onerror = function(){alert('Error de conexión al solicitar clientes');};
		}else{
			alert('Información de login inválida');
		}
	};
	req.onerror = function(){alert('Error de conexión en login!');};
});

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
