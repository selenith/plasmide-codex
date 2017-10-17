(function(window) {

var document = window.document;



function Codex(){
	
	this.accueilInit = false;		
	
        this.controller = '/mods/codex/controller/jsonCodex.php';

	// config dans tools/ckeditor/config.js
	this.ckeConfig = {};
	
	this.start = function(){
		
		//parametres de navagation
		nav.setRoot(codex.root);
		nav.addPage('find', codex.chercher);
		nav.addPage('creer', codex.creerEntite);
		nav.addPage('entite', codex.pageEntite);
		nav.addPage('suppr', codex.supprimer);		
	}
	
	
	
	this.root= function(){		
		plasmide.sequence.auth.statut(function(data){
			if(data.statut=='connect'){	
				var pageAccueil = $("#defaultCodexPage").attr('defaultPage');
				location.hash=pageAccueil;
			}else if(data.statut=='deco'){
				pageAuth();
			}
			
		});
	
	}
	
	this.chercher = function(params){
		accueil();
		$.get(codex.controller, {action:'find', val:params.val}, function(data){
			if(data.statut=='connect'){
				
				
				
				$('#zoneResult').empty();
				
				
				
				
				
				var zoneEntitesTrouvees = document.createElement('div');				
				zoneEntitesTrouvees.className = 'listeEntitesTrouves';
				
				var titre;
				var zoneStyle =  document.createElement('h1');	
				zoneStyle.className ='titreTrouves text-center';
				zoneStyle.appendChild(document.createTextNode('Pages trouvées'));
					
				if(data.entites.length == 0){
					
					var divRien =  document.createElement('div');	
					divRien.className ='alert alert-warning';
					divRien.setAttribute('role', 'altert');
					divRien.appendChild(document.createTextNode('Aucun résultat'));
					
					zoneEntitesTrouvees.appendChild(divRien);
					
				}
				
				$('#zoneResult').append(zoneStyle);				
				$('#zoneResult').append(zoneEntitesTrouvees);		
				
				
				var zoneEntite;
				var lien;
				for(var i=0 ; i<data.entites.length; i++){
					zoneEntite = document.createElement('div');
					zoneEntitesTrouvees.appendChild(zoneEntite);
					
					lien = document.createElement('a');
					lien.href ='#entite?idEntite:'+data.entites[i].idEntite;
					lien.appendChild(document.createTextNode(data.entites[i].nom));
					zoneEntite.appendChild(lien);
				}
				

				$(zoneStyle).focus();
			}else if(data.statut == 'deco'){
				ecranDeco();
			}
		}, 'json');		
	}
	
	this.creerEntite = function(params){
		
		accueil();		
		var element;
		var input;
		
		$('#zoneResult').empty();
		
		element = document.createElement('div');
		element.className='text-center';
		$('#zoneResult').append(element);
		
		if(params.isEdit){			
			element.appendChild(document.createTextNode('Edition d\'une entité existante.'));
		}else{
			element.appendChild(document.createTextNode('Création d\'une nouvelle entité.'));
		}
		
		element.appendChild(document.createElement('br'));
		element.appendChild(document.createElement('br'))
		
		element.appendChild(document.createTextNode('Nom'));
		element.appendChild(document.createElement('br'));
		input = document.createElement('input');
		input.type = 'text';
		input.id ='champEntiteNom';
		element.appendChild(input);
		
		if(params.nom){
			input.value = params.nom;
			
		}
		element.appendChild(document.createElement('br'))
		element.appendChild(document.createElement('br'));
		input = document.createElement('textarea');
		input.id = 'ckeditorZone';
		element.appendChild(input);
		
		if(params.data){
			input.value = params.data;
		}
		delete CKEDITOR.instances['ckeditorZone'];		
		CKEDITOR.replace('ckeditorZone', plasmide.sequence.codex.ckeConfig);
		
		
		
		
		element.appendChild(document.createElement('br'));
		
		
		//bouton retour
		input = document.createElement('input');
		input.type = 'button'
		input.className = 'btn btn-primary';
		input.value ='Retour';
		element.appendChild(input);
		
			
		
		if(params.isEdit){
			$(input).click(function(){				
				location.reload();
			});			
		}else{			
			$(input).click(function(){				
				history.back();
			});
		}
		
		//space between buttons
		element.appendChild(document.createTextNode(' '));
		
		//bouton valider
		input = document.createElement('input');
		input.type='button';
		input.className = 'btn btn-primary';
		input.value = 'Envoyer';
		element.appendChild(input);
		
		if(params.isEdit){
			
			$(input).click(function(){validEditEntite(params.idEntite);});
		}else{
			$(input).click(function(){validCreerEntite();});
		}
		
		
	}
	
	this.pageEntite = function(params){
		accueil();
		$.post(codex.controller, {action:'infoEntite', idEntite:params.idEntite}, function(data){
			if(data.statut=='connect'){
				
				var element;
				var input;
				var div;
				
				$('#zoneResult').empty();				
				
				
				div = document.createElement('div');
				$('#zoneResult').append(div);
				
				element = document.createElement('h1');
				element.className='text-center';
				div.appendChild(element);
				element.appendChild(document.createTextNode(data.entites.nom));
				
				
				element = document.createElement('div');
				element.className = 'zoneDataEntite';
				div.appendChild(element);
				element.innerHTML = data.entites.data + '<hr /> <div class="text-right"> <i>Par '+data.entites.userName +', le '+data.entites.date+' </i></div>';
				
				
				
				div = document.createElement('div');
				$('#zoneResult').append(div);
				
				element = document.createElement("div");
				element.className ='text-center';
				div.appendChild(element);
				
			
				
				
				input = document.createElement('input');
				input.type = 'button';
				input.className = 'btn btn-primary';
				input.value ='Supprimer';
				element.appendChild(input);
				
				$(input).click(function(){
					supprimerEntite(data.entites.nom, data.entites.idEntite);
				});
				
				element.appendChild(document.createTextNode(' '));
				
				
				input = document.createElement('input');
				input.type = 'button';
				input.className = 'btn btn-primary';
				input.value ='Editer';
				element.appendChild(input);
				
				$(input).click(function(){
					
					var params = {"isEdit":"yes", "nom":data.entites.nom,"data":data.entites.data, "idEntite":data.entites.idEntite};
					
					codex.creerEntite(params);
				});
				
			}else if(data.statut == 'deco'){
				ecranDeco();
			}
		}, 'json');
		
	
	}
	
	
	this.supprimer = function(params){
		
		
		$.get(codex.controller, {action:'supprEntite', idEntite:params.id}, function(data){
			if(data.statut=='connect'){
				accueil();				
				$('#zoneResult').empty();				
				var div = document.createElement('div');
				$('#zoneResult').append(div);
				
				div.appendChild(document.createTextNode("Suppression effectuée"));
				
			}else if(data.statut == 'deco'){
				ecranDeco();
			}
		}, 'json');
	}
	
	
	function accueil(){
		
		if(!codex.accueilInit){
			//$('#conteneurCodex').empty();
			var champ;
			var element;
			var form;
			var divStyle;
			
			
			$('#conteneurPage').empty();
			var conteneurPage = $('#conteneurPage');
			
			divStyle = document.createElement('div');
			divStyle.className = 'codex';
			conteneurPage.append(divStyle);
			
			var div = document.createElement('div');
			div.className='d-flex flex-wrap justify-content-between';
			divStyle.appendChild(div);
			
			
			
			
			element = document.createElement("div");
			element.className = "col-12 col-sm-4";
			div.appendChild(element);
			
		
			form = document.createElement('form');
			element.appendChild(form);
			$(form).on("submit", function(event){
				event.preventDefault();
				chercherEntite();
				return false;
			});
		
			champ = document.createElement('input');
			champ.type ='text';
			champ.className ='form-control';
			champ.id ='champEntite';
			champ.setAttribute('placeholder', 'Chercher');
			champ.setAttribute('autofocus', 'autofocus');
			form.appendChild(champ);
		
	/*	
			element = document.createElement("div");
			element.className = "clearfix visible-xs-block";
			div.appendChild(element);
		
			element = document.createElement("div");
			div.appendChild(element);
			element.className = "col-sm-4 col-xs-6";
	*/	
			input = document.createElement("a");
			input.className='btn btn-primary';
			input.href = '#creer';
			div.appendChild(input);
			input.appendChild(document.createTextNode("Creer une page"));
		
	/*				 
			element = document.createElement("div");
			element.className = "col-sm-3 col-xs-6 text-right";
			element.id = "zoneUser";
			div.appendChild(element);
	*/	
			input = document.createElement("a");
			input.href = '/auth/deconnexion';
			input.className="btn btn-outline-primary";
			div.appendChild(input);
			input.appendChild(document.createTextNode("Deconnexion"));
			
			
			//content zone
			element = document.createElement("div");
			divStyle.appendChild(element);
			element.className = "zoneResult";
			element.id = 'zoneResult';
			element.appendChild(document.createTextNode("Bienvenue"));
		
			//optional message zone
			element = document.createElement("div");
			element.className = "zoneMessage";
			element.id = "zoneMessage";
			divStyle.appendChild(element);
		}
		
		codex.accueilInit = true;

		
	}
	
	function chercherEntite(){
		
		//var choix = $("input[type='radio'][name='typeRecherche']:checked").val();
		var recherche = $('#champEntite').val();
		$('#champEntite').val('');
		$('#champEntite').blur();
		//window.location.hash = '#find?type:'+choix+'&val:'+recherche;
		window.location.hash = '#find?val:'+recherche;
	}
	
	function validCreerEntite(){
		
		
		var nom  = $('#champEntiteNom').val();
		
		if(nom){
			var data = CKEDITOR.instances.ckeditorZone.getData();
			$.post(codex.controller, {action:'creerEntite', nom:nom, data:data}, function(data){
				if(data.statut=='connect'){
				
					location.href ='#entite?idEntite:'+data.idEntite;
				
				}else if(data.statut == 'deco'){
					ecranDeco();
				}
			}, 'json');
		}else{
			alert('Veuillez mettre un titre a votre page.');
		}
		
			
	}
	
	function validEditEntite(idEntite){
		
		
		var nom  = $('#champEntiteNom').val();
		if(nom){
			var data = CKEDITOR.instances.ckeditorZone.getData();
			$.post(codex.controller, {action:'editEntite', nom:nom, idEntite:idEntite, data:data}, function(data){
				if(data.statut=='connect'){
				
				
					var params ={"idEntite":data.idEntite};				
					codex.pageEntite(params);
				
				}else if(data.statut == 'deco'){
					ecranDeco();
				}
			}, 'json');
		}else{
			alert('Veuillez mettre un titre a votre page.');
		}	
	}
	
	
	function supprimerEntite(nom, idEntite){
		var suppress = confirm('vous etes sur le point de supprimer la page sur '+ nom);
		
		if(suppress){
			
			location.href='#suppr?id:'+idEntite;
		}
	
	}
	
	function ecranDeco(){
		 
		
		var element = document.createElement('div');
		element.className='alert alert-warning';
		element.setAttribute('role', 'alert');
		$('#zoneMessage').append(element);
		
		var href = document.createElement('a');
		href.href = document.location.href; 
		href.appendChild(document.createTextNode("Accueil"));
		
		element.appendChild(document.createTextNode("Votre session a expirée. Pour une nouvelle authentification retournez a l'"));
		element.appendChild(href);
		
		$(href).click(function(){
			location.reload();
		});
		
	}
	
	
}



var codex = new Codex();
plasmide.addSequence(codex, 'codex');

})(window);
