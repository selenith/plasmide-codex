<?php
class Entite extends Archivable{
	
	public function __construct(){
		
		$this->type = 'Entite';
		
	}
	
	public static function getDbPath(){
		
		if(preg_match("/router\.php/", $_SERVER['PHP_SELF'])){
			return 'data/';
		}else {
			return '../../../data/';
		}
		
	}
	
}
?>
