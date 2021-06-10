<?php
require_once 'config.php';

$oauthPass = trim($_SERVER['QUERY_STRING']);

if($oauthPass != "customnpcgay"){
    header("HTTP/1.0 404 Not Found");
    exit;
}else{    
    // Create a list of links to display the download files
    $download_links = array();
    
    // If the files exist
    if(is_array($files)){
        foreach($files as $token => $file){
            // Encode the file ID
            $token = base64_encode($token);
            
            // Generate download link
            //define('BASE_URL','http://'. $_SERVER['HTTP_HOST'].'/api/v1/');
            $download_link = 'http://'. $_SERVER['HTTP_HOST'].'/api/v1/download.php?token='.TOKEN; 

            $file123 = fopen("Tokens/".TOKEN, 'w') or die("Unable to open file!");
            fwrite($file123, time());
            fclose($file123);
            
            // Add download link to the list
            $download_links[] = array(
                'link' => $download_link
            );
            
            // Create a protected directory to store keys
            if(!is_dir("Tokens")) {
                mkdir("Tokens");
                $file = fopen("Tokens".'/.htaccess','w');
                fwrite($file,"Order allow,deny\nDeny from all");
                fclose($file);
            }
            
            // Write the key to the keys list
            $file = fopen("Tokens".'/tokens','a');
            fwrite($file, "{TOKEN}\n");
            fclose($file);
        }
    }
};    
?>

<!-- List all the download links -->
<?php if(!empty($download_links)){ ?>
    <ul>
    <?php foreach($download_links as $download){ ?>            
        <li><a href="<?php echo $download['link']; ?>"><?php echo  $download['link']; ?></a></li>
    <?php } ?>
    </ul>
<?php }else{ ?>
    <p>Links are not found...</p>
<?php } ?>