/*Administrador de interrupciones se encarga del proceso
	@author: Rolilink(rolando.perez.dev@gmail.com)
	@name: Rolando Perez
	@attr:
		interrupciones: lista de interrupciones priorizadas por tiempo de la libreria buckets (buckets.PriorityQueue)
		idle: lista de interrupciones priorizadas por prioridad de IRQ de la libreria buckets (buckets.PriorityQueue)
		localTimeAdmin: Administrador del Tiempo del proceso principal de interrupciones
*/
function InterrupcionAdmin(){
	interrupciones = null;
	idle = null;
	localTimeAdmin = null;
	interrupcionActual = null;
	var updateui=function(){
		if(localTimeAdmin != null){
			controls["lbltiempoglobal"].text("Tiempo:"+localTimeAdmin.getTime())
		}
		if(interrupcionActual!=null){
			controls["lbldispositivo"].text(interrupcionActual.irq.dispositivo)
			controls["lblrestante"].text("Tiempo Restante:"+interrupcionActual.getTiempo())
			controls["lblprioridad"].text("Prioridad:"+interrupcionActual.irq.prioridad)
			controls["lblduracion"].text("Duracion:"+interrupcionActual.getDuracion())
		} 
	}
	/* prepara las colas con prioridad con sus funciones de comparacion
	*/
	this.setqueues= function (){
		interrupciones = new buckets.PriorityQueue(function compare(a,b){
			if (a.inicio>b.inicio){
				return -1;
			}
			if (a.inicio<b.inicio){
				return 1;
			}
			if (a.inicio==b.inicio){
				return 0;
			}
		});
		idle = new buckets.PriorityQueue(function compare(a,b){
			if (a.irq.prioridad>b.irq.prioridad){
				return -1;
			}
			if (a.irq.prioridad<b.irq.prioridad){
				return 1;
			}
			if (a.irq.prioridad==b.irq.prioridad){
				return 0;
			}
		});
	}
	/* Detiene el contador principal e inicia la interrupcion actual antes que el contador
	   para permitir el flujo correcto del tiempo.
	*/
	this.startactual = function (){
		var i =localTimeAdmin.getTime();
		localTimeAdmin.stopTime();
		interrupcionActual.startexec();
		localTimeAdmin.starttime(i,"principal");
	}

	this.agregarInterrupcion = function(rduracion,rinicio,code,disp){
		if(interrupciones != null){	
			irq1 = IRQ.getIRQ(code,disp);
			if(irq1!= null){
				int1 = Interrupcion.getInterrupcion(rduracion,rinicio,irq1);
				if (int1 != null) {	
				interrupciones.add(int1);
				return true;
				}
			}
			return false;
		}
		return false
	}

	this.proceso = function (){
		var i =localTimeAdmin.getTime();
		updateui();
		if(localTimeAdmin==null){
			$.mobile.changePage(pages["resultado"]);
		}
		if (interrupcionActual == null){// free time
			var a = (interrupciones.size()>0);
			var b = (idle.size()>0);

			if(a){
				var intA = interrupciones.peek();
				var i =localTimeAdmin.getTime();
				if(intA.inicio == i){// interrupcion nula y una interrupcion en cola
					//do wathever you want with free time
					interrupcionActual = interrupciones.dequeue();
					interrupcionActual.tinicio= i;
					interrupcionActual.exec();
					interrupcionActual.startexec();
					return;
				}
			}
			if(b){// interrupcion nula no hay interrupciones en cola hacer tiempos pendientes
					//do wathever you want with free time
					var i =localTimeAdmin.getTime();
					interrupcionActual = idle.dequeue();
					interrupcionActual.tinicio= i;
					interrupcionActual.exec();
					interrupcionActual.startexec();
					return;
			}
			if(!a&&!b){
			localTimeAdmin.stoptime();
			localTimeAdmin=null;
			}
			//acabo el proceso
			return;
		}
		/*
			Al pasar de aqui significa que existe una interrupcion en el sistema puede estar en proceso
			o esta a punto de terminar
		*/
		var t = interrupcionActual.getTiempo();
		if(t==0){// interrupcion actual termino
			var a = (interrupciones.size()>0);
			var b = (idle.size()>0);
			var i =localTimeAdmin.getTime();
			resultadoslist.add({
				tinicio: interrupcionActual.tinicio,
				tfinal: i,
				dispositivo: interrupcionActual.irq.dispositivo,
				finalizado:"Si"
			});
			if(a){
				var intA = interrupciones.peek();
				var i =localTimeAdmin.getTime();
				if(intA.inicio == i){// no hay interrupcion nula y una interrupcion en cola
					interrupcionActual = interrupciones.dequeue();
					interrupcionActual.tinicio= i;
					interrupcionActual.exec();
					interrupcionActual.startexec();
					return;
				}
			}
			if(b){// interrupcion nula no hay interrupciones en cola hacer tiempos pendientes
					interrupcionActual = idle.dequeue();
					interrupcionActual.tinicio= i;
					interrupcionActual.exec();
					interrupcionActual.startexec();
					return;
			}
			interrupcionActual = null;
			if(!a&&!b){
			localTimeAdmin.stoptime();
			localTimeAdmin=null;
			$.mobile.changePage(pages["resultado"]);
			}
			//entra en free time
			return;
		}
		else
		{// interrupcion actual no ah terminado 
			var a = (interrupciones.size()>0);
			if(a){
				var intA = interrupciones.peek();
				var i =localTimeAdmin.getTime();
				if(intA.inicio == i){// interrupcion no nula y una interrupcion en cola
					if(intA.irq.prioridad < interrupcionActual.irq.prioridad){
						idle.add(interrupcionActual);
						resultadoslist.add({
							tinicio: interrupcionActual.tinicio,
							tfinal: i,
							dispositivo: interrupcionActual.irq.dispositivo,
							finalizado:"No"
						});
						interrupcionActual.stopexec();
						interrupcionActual = interrupciones.dequeue();
						interrupcionActual.tinicio= i;
						interrupcionActual.exec();
						interrupcionActual.startexec();
					}
					else{
						idle.add(interrupciones.dequeue())
					}					
					return;
				}
			}
			
			return;
		}

	}

	this.start = function(ptime){
		if(this.agregarInterrupcion(ptime,0,404,0)){	
		localTimeAdmin = new TiempoAdmin();
		localTimeAdmin.setHandler(this.proceso);
		interrupcionActual = interrupciones.dequeue();
		interrupcionActual.tinicio = 0;
		interrupcionActual.startexec();
		localTimeAdmin.starttime(0);
		}
	}

	/*dummy methods
------------------------------------------
	*/
	this.interrupciones=function(){
		return interrupciones;
	} 
	this.idle=function(){
		return idle;
	}
}