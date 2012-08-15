/*Administrador del tiempo encapsula la logica de un contador de tiempo
	@author: Rolilink(rolando.perez.dev@gmail.com)
	@name: Rolando Perez
	@attr:
		time: tiempo actual del contador
		timeinterval: variable que representa el itervalo de tiempo ah ser detenido
		handler: proceso a darse cada segundo
*/
function TiempoAdmin(){
	var time = null;
	var timeinterval = null;
	var handler = null;
	var id = null;
	/*actualiza el tiempo actual del contador */
	this.updatetime = function () {
		time++;
		handler();
	}
	/*empieza el proceso de contador de tiempo actualizandose cada segundo
		@params:
			rtime: tiempo en el cual iniciar el contadorc
		
	*/
	this.starttime = function (rtime,rid){
		id = rid;
		if (time==null) {
			time=rtime;
			timeinterval=setInterval(this.updatetime,1000);
		}
	}

	this.setHandler=function(rhandler){
		handler = rhandler;
	}
	/*detiene el proceso del contador de tiempo

	*/
	this.stoptime= function (){
		if(timeinterval!=null){
			time=null;
			clearInterval(timeinterval);
		}
	}

	this.getTime = function(){
		return time;
	}
}