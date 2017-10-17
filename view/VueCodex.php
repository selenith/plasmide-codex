<?php
class VueCodex{

	private $body ='';
	private $head ='';
	private $nomSite ='';
	private $templatePath ='';
	private $script ='<script type="text/javascript" src="tools/jquery-migrate.min.js"></script>
		<script type="text/javascript" src="/tools/jquery-ui/jquery-ui.min.js"></script>
		<script type="text/javascript" src="/tools/elfinder/js/elfinder.min.js"></script>
		<script type="text/javascript" src="/tools/elfinder/js/i18n/elfinder.fr.js"></script>
		<script type="text/javascript" src="/tools/ckeditor/ckeditor.js"></script>
		<script type="text/javascript" src="/mods/auth/view/auth.js"></script>
	';

	public function getHead(){
		return $this->head.'
		<link href="/mods/codex/style/codex-mod.css" rel="stylesheet" type="text/css" media="screen" />
		<link rel="stylesheet" href="/tools/jquery-ui/jquery-ui.theme.min.css" type="text/css" media="screen" >
		<link rel="stylesheet" href="/tools/jquery-ui/jquery-ui.min.css" type="text/css" media="screen" >
		<link rel="stylesheet" href="/tools/elfinder/css/elfinder.min.css" type="text/css" media="screen"  />';	
	}
	
	public function getScript(){
		return $this->script;
	}
	
	public function getBody(){
		return $this->body;
	}
	
	
	
	public function setSiteName($siteName){
		$this->nomSite = $siteName;
	}
	
	public function setTemplatePath($templatePath){
		$this->templatePath = $templatePath;
	}
	
	public function etatDeconnect(){
		$this->head = '<title>'.$this->nomSite.' - Codex (déconnecté)</title>';
		$this->body = '
					<div class="codex">
						<h1>Codex</h1>
						<div class="alert alert-info" role="alert">Seul les membres authentifié peuvent acceder au codex.</div>			
						<form method="post" action="/auth/connexion">
                                                    <div class="form-group row justify-content-center">
                                                         <label class="col-form-label col-2" for="login" >Login : </label>
                                                         <div class="col-5">
                                                              <input type="text" class="form-control"  id="login" name="login" />
                                                        </div>
                                                    </div>
                                                    <div class="form-group row justify-content-center">
                                                         <label class="col-form-label col-2" for="pass" >Password : </label>
                                                         <div class="col-5">
                                                              <input type="password" class="form-control"  id="pass" name="pass" />
                                                        </div>
                                                    </div>
                                                    <divv class="form-group d-flex justify-content-center">                                          
                                                        <input type="submit" class="btn btn-primary" value="Connexion" id="envoi" />
                                                    </div>  
						</form>
					</div>
			';
	}
	
	public function etatConnect(){
		$this->head = '<title>'.$this->nomSite.' - Codex</title>';
		$this->body = '<h1>Codex</h1>
				<p>bienvenue</p>';
		$this->script .='	<input type="hidden" id="defaultCodexPage" defaultPage="'.CodexConfig::$defaultPage.'" />
		<script type="text/javascript" src="mods/codex/view/codex.js"></script>'.PHP_EOL;
	}
	
	public function etatNonDroit(){
		$this->head = '<title>'.$this->nomSite.' - Codex</title>';
		$this->body = '
					<div class="codex">
						<h1>Codex</h1>
						<div class="alert alert-danger" role="alert">
							<b>Vous ne possedez pas les droits</b> pour acceder a cette page. Contacter l\'administrateur si vous souhaitez les obtenir.
						</div>			
					</div>
			';
		
	}
	
	public function configCkeditorBase(){
		//$this->script .='	<script type="text/javascript" src="tools/ckeditor/config.js"></script>'.PHP_EOL;
	}
	public function configCkeditorAdmin(){
		$this->script .='		<script type="text/javascript" src="/mods/codex/view/codexConfigAdmin.js"></script>'.PHP_EOL;
	}
}
?>
