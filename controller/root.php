<?php
include('mods/auth/model/Auth.php');
include('mods/codex/view/VueCodex.php');
include('mods/codex/config.php');


include('core/controller/menu.php');

$vueCodex = new VueCodex();
$vueCodex->setSiteName($nomSite);
$vueCodex->setTemplatePath($templatePath);
 

 
session_start();
$auth = new Auth();
$authBundle = $auth->checkStatut();



if($authBundle['statut']=='deco'){
	$vueCodex->etatDeconnect();
}else if($authBundle['statut']=='connect'){
	$droits = $authBundle['droits'];
	
	if(in_array($droits, CodexConfig::$readAccess)){
		$vueCodex->etatConnect();		
		if($droits =='maitre'){
			$vueCodex->configCkeditorAdmin();
		}else{			
			$vueCodex->configCkeditorBase();
		}
	}else{
		$vueCodex->etatNonDroit();
	}
}else{
	$vueCodex->etatDeconnect();
}


$head = $vueCodex->getHead();
$body= $vueCodex->getBody();
$scripts= $vueCodex->getScript();

include($templatePath.'index.php');
?>
