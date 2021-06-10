<?php
// Array of the files with an unique ID
$files = array(
    'UID12345' => array(
        'content_type' => 'application/exe', 
        'suggested_name' => 'stable.exe', 
        'file_path' => 'files/stable.exe',
        'type' => 'local_file'
    ),
    //'UID67890' => array(
    //    'content_type' => 'audio/mpeg', 
    //    'suggested_name' => 'music-codex.mp3', 
    //    'file_path' => 'https://www.dropbox.com/XXXXXXX/song.mp3?dl=1',
    //    'type' => 'remote_file'
    //),
);

$token123 = GenerateString(96);//.'==';//uniqid(GenerateString(96).'==',TRUE);
define('TOKEN', $token123);
function GenerateString($length)  
{  
    $characters  = "0123456789";  
    $characters .= "abcdefghijklmnopqrstuvwxyz";  
    $characters .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";  
    //$characters .= "/";
      
    $string_generated = "";  
      
    $nmr_loops = $length;  
    while ($nmr_loops--)  
    {  
        $string_generated .= $characters[mt_rand(0, strlen($characters) - 1)];  
    }  
      
    return $string_generated;  
}
