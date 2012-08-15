function checkString(rString){
	var cArray = []
	var JsonObject = eval("("+rString+")")
		cArray["code"] = JsonObject["code"]
	if (JsonObject.hasOwnProperty("disp")){
		cArray["disp"] = JsonObject["disp"]
	}
	else{
		cArray["disp"] = 0
	}
	return cArray
}

function ListControl(){
	this.DOMlist = null
	this.listset = null
	this.toDom = null
	this.setList = function(li,rtoDom,relementToStr){
		this.DOMlist = li
		if(relementToStr != null){
			this.listset = new buckets.Set(relementToStr)
			var a = relementToStr
		}
		else{
			return false
		}

		if (this.listset != null && rtoDom!=null){
			this.toDom = rtoDom
		}
		else{
			return false
		}
		return true
	}

	this.add = function(element){
		var flag = this.listset.add(element)
		var domString = null;
		if(flag){
			if(this.toDom != null){
				domString = this.toDom(element);	
			}
			else{
				return false
			}
			if(this.DOMlist != null){
				this.DOMlist.append(domString)
				this.DOMlist.find('li').tsort({ data : 'index'})
			}else{
				return false
			}
		}
		return false
	}
	this.remove = function (rString){
		this.listset.remove(new listelement(rString,0,0,0))
		return true
	}
}