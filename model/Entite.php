<?php
class Entite extends Archivable{
	
	public function __construct(){
		
		$this->type = 'Entite';
		
	}
	
	public static function getDbPath(){
		
		if(preg_match("/codex\/controller/", $_SERVER['PHP_SELF'])){
			return '../data/';
		}else if(preg_match("/mods/", $_SERVER['PHP_SELF'])){
			return '../../codex/data/';
		}else if(preg_match("/index\.php/", $_SERVER['PHP_SELF'])){
			return 'mods/codex/data/';
		}else {
			return false;
		}
		
	}
	
}
?>