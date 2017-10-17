<?php
class CodexConfig{
	
	//public static access = ['maitre','moderateur','authentif', 'standard'];
	public static $readAccess = ['maitre','moderateur','authentif'];
	
	//public static writeAccess = ['maitre','moderateur','authentif', 'standard'];
	public static $writeAccess = ['maitre','moderateur','authentif'];
	
	//page de garde du codex (apres l'attribut /?mod=codex# dans l'url)
	public static $defaultPage = 'entite?idEntite:1' ;
}
?>
