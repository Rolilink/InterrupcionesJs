/*Recrea una interrupcion del dispositivo del computador
  @author: Rolilink(rolando.perez.dev@gmail.com)
  @name: Rolando Perez
  @attr:
  	duracion: duracion de la interrupcion
  	inicio: tiempo de inicio
  	irq: codigo irq 
  	id: id de la interrupcion usada para identificarlas en el timeline
  	interrumpida: valor booleano para saber si fue interrumpida
    gid: id global para evitar interrupciones repetidas
*/

function Interrupcion (){
	var duracion = null;
	this.inicio = null;
	this.irq = null;
  var tiempo=0;
  var timeadmin = null;
	this.id = null;
	this.interrumpida = false;
  this.termino = false;
  this.tinicio = null;

  this.exec = function(){
    if(0==tiempo){
      timeadmin.stoptime();
      timeadmin = null;
    }else{
      tiempo--;
    }
  }

  this.startexec = function(){
    timeadmin = new TiempoAdmin();
    timeadmin.setHandler(this.exec);
    timeadmin.starttime(0,this.id);
  }

  this.stopexec = function(){
    timeadmin.stoptime();
    timeadmin=null;
  }

  this.getTiempo = function(){
    return tiempo;
  }

  this.setTiempo = function (val){
    tiempo = val;
  }

   this.getDuracion = function(){
    return duracion;
  }

  this.setDuracion = function (val){
    duracion = val;
  }


}
Interrupcion.gid = 0;

/* Implementa la logica para la creacion de una Interrupcion
  @params:
    rduracion: duracion de la interrupcion
    rinicio: momento en el tiempo en que inicia la interrupcion
    rirq: IRQ desde cual fue lanzada la interrupcion 
  @return:
    Regresa un objeto Interrupcion que contiene todos los datos necesarios 
*/
Interrupcion.getInterrupcion= function(rduracion,rinicio,rirq){
  var retorna = null;
  if(rduracion>0 && rirq!=null){
    retorna = new Interrupcion();
    retorna.setDuracion(rduracion);
    retorna.setTiempo(rduracion);
    retorna.inicio = rinicio;
    retorna.irq = rirq;
    retorna.id = Interrupcion.gid;
    Interrupcion.gid++;
  }
  return retorna;
}

/* Implementa la logica para la creacion de un Proceso de Programa
  @params:
    rduracion: duracion de la interrupcion
  @return:
    Regresa un objeto Interrupcion que contiene todos los datos necesarios para simular al programa
*/
Interrupcion.getPrograma= function(rduracion){
  var retorna = null;
  if(rduracion>0){
    retorna = new Interrupcion();
    retorna.setDuracion(rduracion);
    retorna.setTiempo(rduracion);
    retorna.inicio = 0;
    retorna.irq = IRQ.getIRQ(404);
    retorna.id = Interrupcion.gid;
    Interrupcion.gid++;
  }
  return retorna;
}

