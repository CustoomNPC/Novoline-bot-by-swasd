<?php
require_once 'config.php';

//$token = base64_decode(trim($_GET['token']));
$token2 = trim($_GET['token']);

$currentTime = time();
if(file_exists("Tokens/".$token2)) {
    $fp = fopen("Tokens/".$token2, "r");
} else {
    $responsecode = '400';
    $response = '<i>Bad Request</i> - Invalid token';
    echo "<html>
    <body>
    <h3 style=\"margin-bottom: 1px\">HTTP ERROR - $responsecode</h3>
    $response
    </body>
    </html>";
    header("HTTP/1.0 400 Invalid token");
    return;
};
$tokenTime = fgets($fp);
//$token2Time = explode('-',$token2);
fclose($fp);


//examples: +1 year, +1 month, +5 days, +10 hours
$expTime = strtotime("+5 minutes", $tokenTime);
echo $expTime;
echo "||||||||||||";
echo $currentTime;

$tokens = file("Tokens".'/tokens');
$match = false;

// Loop through the keys to find a match
// When the match is found, remove it
foreach($tokens as &$one){
    if(rtrim($one)==$token2){
        $match = true;
        $one = '';
    }
}

file_put_contents("Tokens".'/tokens',$tokens);

// If match found and the link is not expired
if($match !== false && $currentTime <= $expTime){
    // If the file is found in the file's array
    if(!empty($files["UID12345"])){
        // Get the file data
        $contentType = $files["UID12345"]['content_type'];
        $fileName = $files["UID12345"]['suggested_name'];
        $filePath = $files["UID12345"]['file_path'];
        
        // Force the browser to download the file
        if($files["UID12345"]['type'] == 'remote_file'){
            $file = fopen($filePath, 'r');
            header("Content-Type:text/plain");
            header("Content-Disposition: attachment; filename=\"{$fileName}\"");
            fpassthru($file);
        }else{
            header("Content-Description: File Transfer");
            header("Content-type: {$contentType}");
            header("Content-Disposition: attachment; filename=\"{$fileName}\"");
            header("Content-Length: " . filesize($filePath));
            header('Pragma: public');
            header("Expires: 0");
            readfile($filePath);
        }
        exit;
    }else{
        $responsecode = '400';
        $response = '<i>Bad Request</i> - Invalid token';
        header("HTTP/1.0 400 Invalid token");
    }
}else{
    // If the file has been downloaded already or time expired
    $responsecode = '404';
    $response = '<i>Not Found</i> - The link has expired';
    header("HTTP/1.0 404 Not found");   
}
?>

<html>
    <head>

    </head>
    <body>
    <h3 style="margin-bottom: 1px">HTTP ERROR - <?php echo $responsecode ?></h3>
    <?php echo $response ?>
    </body>
</html>