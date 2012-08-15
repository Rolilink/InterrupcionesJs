function listelement(rtime,rduracion,rirq,rcode){
	this.time = rtime
	this.duracion = rduracion
	this.irq = rirq	
	this.code = rcode
	this.dispositivo = IRQ.getIRQ(rirq,rcode).dispositivo
}

function validatedigits(control){
	regex=/^[-+]?\d+$/;
	return (regex.test(control.val()) && !control.val()=="")
}

var removemode= false
var pages = []
var controls = []
var list= new ListControl()
var resultadoslist= new ListControl()
var interrupcionControl = null
var duracionprograma = 0

$(document).bind("mobileinit",function(){
	//iniciar aqui las variables
	console.log("Jquery Mobile Loaded")
})
$(document).delegate("#procesospage","pageinit",function(){
	interrupcionControl.start(duracionprograma)
})

$(document).delegate("#dialogprograma","pageinit",function(){
		$("#dialoginiciar").bind("tap",function(){
		if(validatedigits($("#prduracion"))&&parseInt($("#prduracion").val())>0){
		duracionprograma=$("#prduracion").val();
		$.mobile.changePage(pages["procesos"])
		}
	});
})

$(document).delegate("#principal","pageinit",function(){
	interrupcionControl = new InterrupcionAdmin()
	interrupcionControl.setqueues()
	list.setList(
		controls["lvlista"],
		function elementtodom(element){
			var Time = '<p class="time ui-li-desc">' + element.time + '</p>' 
			var Titulo = '<h1 class="tittle ui-li-heading">IRQ-'+element.irq+'/'+element.dispositivo+'</h1>'
			var Descripcion = '<p class="description ui-li-desc">Duracion:'+ element.duracion +'</p>'
			return '<li class="ui-li ui-li-static ui-body-b" data-index="'+ element.time +'">' + Time + Titulo + Descripcion + '</li>'
		},
		function toStringFunction(element){
			return element.time
		}
		)
	resultadoslist.setList(
		controls["lvresultados"],
		function elementtodom(element){
			var Time = '<p class="time ui-li-desc">' + element.tinicio +"-"+ element.tfinal + '</p>' 
			var Titulo = '<h1 class="tittle ui-li-heading">'+element.dispositivo+'</h1>'
			var Descripcion = '<p class="description ui-li-desc">Termino:'+ element.finalizado +'</p>'
			return '<li class="ui-li ui-li-static ui-body-b" data-index="'+ element.tinicio +'">' + Time + Titulo + Descripcion + '</li>'
		},
		function toStringFunction(element){
			return element.tinicio
		}
		)

	controls["btnagregar"].bind("tap",function(){
		$.mobile.changePage(pages["dialog"])
	})

	controls["btnremover"].bind("tap",function(){
		if(removemode){
			removemode = false
		}else{
			removemode = true
		}

	})

	controls["btniniciar"].bind("tap",function(){
		if(list.listset.size() > 0){
			var i = 0
			var alist = list.listset.toArray()
			while(i<alist.length){
				var elemento = alist[i]
				interrupcionControl.agregarInterrupcion(elemento.duracion,elemento.time,elemento.irq,elemento.code)
				i++
		}
			$.mobile.changePage($("#dialogprograma"))	
		}
		
	})

	console.log(" Principal Page Init")
})

$(document).delegate("#dialog","pageinit",function(){
	//iniciar validaciones y eventos

	controls["btnaceptar"].bind("tap",function(){
		//boton aceptar on click
		if(validatedigits(controls["txttiempo"]) && validatedigits(controls["txtduracion"])){
			var inicio = parseInt(controls["txttiempo"].val())
			var duracion = parseInt(controls["txtduracion"].val())
			var codes = checkString(controls["chkdispositivo"].val())
			if(list.add(new listelement(inicio,duracion,codes["code"],codes["disp"]))){
				$.mobile.changePage(pages["principal"])
			}
			else{

			}
		}else{
			
		}
	})

	controls["btncancelar"].bind("tap",function(){
		//boton cancelar on click
		$.mobile.changePage(pages["principal"])
	})
	console.log("Dialog Page Init")
})
$(document).ready(function(){
	console.log("DOM Inicializado")
	//DOM listo rescatar los controles
	pages["principal"]=$("#principal")
	pages["dialog"]=$("#dialog")
	pages["dialogprograma"] =$("#dialogprograma")
	pages["procesos"]=$("#procesospage")
	pages["resultado"]=$("#resultados")
	controls["btniniciar"] = $("#iniciar")
	controls["txttiempo"]=$("#time")
	controls["txtduracion"]=$("#duracion")
	controls["chkdispositivo"]=$("#dispositivo")
	controls["lvlista"]=$("#lista")
	controls["btnagregar"]=$("#agregar")
	controls["btnremover"]=$("#remover")
	controls["btnaceptar"]=$("#dialogaceptar")
	controls["btncancelar"]=$("#dialogcancelar")
	controls["lbltiempoglobal"] = $("#globaltime")
	controls["lbldispositivo"] = $("#ldispositivo")
	controls["lblrestante"] = $("#lcountdown")
	controls["lblprioridad"] = $("#lprioridad")
	controls["lblduracion"] = $("#lduracion")
	controls["lvresultados"]=$("#listaresultados")
	//se muestra la pagina 
	controls["lvlista"].delegate('li','tap',function(){
		if(removemode){
			$(this).detach()
			var index = parseInt($(this).data('index'))
			list.remove(index)
			removemode = false	
		}
	})
	pages["principal"].bind("pageshow",function(){
		console.log("se muestra la ventana principal")
	})
	// se muestra la pagina
	pages["dialog"].bind("pageshow",function(){
		console.log("se muestra la ventana de dialogo")
	})
	// se oculta la pagina principal
	pages["principal"].bind("pagehide",function(){
		console.log("se oculta la ventana principal")
	})
	// se oculta la pagina de agregar interrupcion
	pages["dialog"].bind("pagehide",function(){
		console.log("se oculta la ventana de dialogo")
	})
})
