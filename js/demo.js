var lookup = new TreeLookup();
function searchNode(node){
	function startSearch(paths) {
		paths = Array.isArray(paths)?paths:[paths];
		if(!paths.length){
			return Promise.resolve("None");
		}
		var path = paths.shift();
		return new Promise(function(resolve,reject){
			lookup
			.getChildrenAsPromise(path)
			.then(function(children) {
				for(var iIndex=0;iIndex<children.length;iIndex++){
						var child = children[iIndex];
						var curPath =  path+child+'/';
						console.log(curPath);
						if(child == node){
							paths = [];
							return resolve(curPath);
						}
						paths.push(curPath);
				}
				return resolve(startSearch(paths));
			})
			.catch(function(err){
				reject(err);
			});
		});
	}
	startSearch("/")
	.then(function(found){
		console.log("Found at",found);
	})
	.catch(function(err){
				console.log("Error at",err);
	});
}

