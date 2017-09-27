<?php

include('../../../core/model/Archivable.php');
include('../../../core/model/Archiviste.php');
include('../../../core/model/Ribosome.php');
include('../../auth/model/Auth.php');
include('../model/Entite.php');




 function convertDataSent($texte){

	$texte = str_replace('%gronk', '&', $texte);
	$texte = str_replace('%grank', '+', $texte);
	$texte = str_replace("\'", "'", $texte);
	$texte = str_replace('\"', '"', $texte);
	//$texte = nl2br($texte);
	//$texte = str_replace(CHR(10), "<br>", $texte);

	return $texte;
}


function recherche(){
	
	$retour = array();
	$retour['entites'] =array();
	
	
	$valeur =  $_GET['val'];;
	
	$arch = new Archiviste();
	$entite = new Entite();
	
	$entite->set('data', $valeur);
	$entite->set('nom', $valeur);
	
	$entites = $arch->rechercher($entite);
	
	$entites = $arch->trier($entites, 'nom', true);
	
	$nbEntite = count($entites);
	
	for($i=0; $i<$nbEntite; $i++){
		
		$retour['entites'][$i]['idEntite'] = $entites[$i]->get('id');
		$retour['entites'][$i]['nom'] = $entites[$i]->get('nom');
	}
	
	
	
	return $retour;
}


function creerEntite($login){
	
	$idEntite ="rien";
	
	$nom = $_POST['nom'];
	$data = $_POST['data'];	
	$arch = new Archiviste();	
	$entite = new Entite();

	$entite->set('nom', $nom);
	$entite->set('data', $data);
	$entite->set('userName', $login);
	$entite->set('date', time());
	
	if($nom && $nom !=""){
		$idEntite = $arch->archiver($entite);	
	}
	
	return array('idEntite'=>$idEntite);
}


function editEntite($login){
	$idEntite ="rien";
	
	$nom = $_POST['nom'];
	$data = $_POST['data'];
	$id = $_POST['idEntite'];	
	$arch = new Archiviste();	
	
	
	$entite = new Entite();
	$entite->set('nom', $nom);
	$entite->set('data', $data);
	$entite->set('userName', $login);
	$entite->set('date', time());
	
	$entiteOld = new Entite();
	$entiteOld->set('id', $id);
	
	if($id && $id !="" && $nom && $nom !=""){
		$arch->modifier($entiteOld, $entite);	
	}
	
	return array('idEntite'=>$id);
}

function infoEntite(){
	include('../../../core/model/TimeLib.php');
	
	$results = array();
	$results['entites'] = array();
	$id = $_POST['idEntite'];
	$arch = new Archiviste();	
	$entite = new Entite();

	$entite->set('id', $id);	
	$entites = $arch->restituer($entite);
	
	if(count($entites)>0){
		$results['entites']['nom'] = $entites[0]->get('nom');
		$results['entites']['data'] = $entites[0]->get('data');
		$results['entites']['idEntite'] = $entites[0]->get('id');
		$results['entites']['date'] = TimeLib::timeToDate($entites[0]->get('date'));
		$results['entites']['userName'] = $entites[0]->get('userName');
	}
	
	
	return $results;
}


function supprEntite(){
	
	$id = $_GET['idEntite'];
	
	$arch = new Archiviste();	
	$entite = new Entite();

	$entite->set('id', $id);	
	$entites = $arch->supprimer($entite);
	
	
}

//---------main----------------
session_start();
$auth = new Auth();
$authBundle = $auth->checkStatut();
$action = $_REQUEST['action'];
$reponse = array();



if($authBundle['statut'] == "connect"){	
	
	if ($action == 'find'){
		$reponse = recherche();
		
	}else if($action == 'creerEntite'){
		$reponse = creerEntite($authBundle['login']);
	
	}else if($action == 'editEntite'){
		$reponse = editEntite($authBundle['login']);
	
	}else if($action == 'infoEntite'){
		$reponse = infoEntite();
	
	}else if($action == 'supprEntite'){
		supprEntite();
	}	
}


$reponse['statut'] = $authBundle['statut'];
echo(json_encode($reponse));

?>