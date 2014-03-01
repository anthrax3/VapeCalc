<?php

$decoded = base64_decode($_POST['json']);
$current_date = time();
$jsonFile = fopen('../data/'.$current_date.'.json','w+');
fwrite($jsonFile,$decoded);
fclose($jsonFile);

?>