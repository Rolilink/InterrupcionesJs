/* Estructura del objeto IRQ para almacenar la prioridad y el dispositivo
	@author: Rolilink(rolando.perez.dev@gmail.com)
	@name: Rolando Perez
	@attr:
		dispositivo: dispositivo del irq
		prioridad: prioridad del dispositivo
		id: codigo del irq ejem: "IRQ-0"
*/

function IRQ(){
	this.dispositivo=null;
	this.prioridad=null;
	this.id=null;
}

/* Implementa la logica para la creacion de un Objeto IRQ
	@params:
		code: Codigo irq de la interrupcion
		disp: En algunos casos la linea irq alberga disintos dispositivos este es un valor externo
	@return:
		Regresa un objeto irq que contiene todos los datos necesarios 
*/
IRQ.getIRQ = function(code,disp){
	retornar = null;
	switch(code){
		case 0 :
		retornar = new IRQ();
		retornar.dispositivo ="Reloj del Sistema";
		retornar.prioridad = 1;
		retornar.id = code;
		break;

		case 1 :
		retornar = new IRQ();
		retornar.dispositivo ="Teclado";
		retornar.prioridad = 2;
		retornar.id = code;
		break;

		case 3 :
		retornar = new IRQ();
		if(disp==2){			
			retornar.dispositivo ="Com2";
		}
		if(disp==4){
			retornar.dispositivo ="Com4";
		}
		retornar.prioridad = 11;
		retornar.id = code;
		break;

		case 4 :
		retornar = new IRQ();
		if(disp==3){			
			retornar.dispositivo ="Com3";
		}
		if(disp==1){
			retornar.dispositivo ="Com1";
		}
		retornar.prioridad = 12;
		retornar.id = code;
		break;

		case 6 :
		retornar = new IRQ();
		retornar.dispositivo ="Floppy";
		retornar.prioridad = 14;
		retornar.id = code;
		break;

		case 7 :
		retornar = new IRQ();
		retornar.dispositivo ="Impresora";
		retornar.prioridad = 15;
		retornar.id = code;
		break;

		case 8 :
		retornar = new IRQ();
		retornar.dispositivo ="CMOS";
		retornar.prioridad = 3;
		retornar.id = code;
		break;

		case 9 :
		retornar = new IRQ();
		if(disp==0){			
			retornar.dispositivo ="Tarjeta de Red";
		}
		if(disp==1){
			retornar.dispositivo ="Tarjeta de Sonido";
		}
		retornar.prioridad = 4;
		retornar.id = code;
		break;

		case 12 :
		retornar = new IRQ();
		retornar.dispositivo ="Mouse";
		retornar.prioridad = 7;
		retornar.id = code;
		break;

		case 13 :
		retornar = new IRQ();
		retornar.dispositivo ="Co-Procesador Matematico";
		retornar.prioridad = 8;
		retornar.id = code;
		break;

		case 14 :
		retornar = new IRQ();
		retornar.dispositivo ="Disco";
		retornar.prioridad = 9;
		retornar.id = code;
		break;

		case 404 :
		retornar = new IRQ();
		retornar.dispositivo ="Programa";
		retornar.prioridad = 404;
		retornar.id = code;
		break;
	}
	return retornar;
}