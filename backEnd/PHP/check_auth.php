<?php
$session_id = $_COOKIE["ViikkoBiitsiSession"];
if($session_id == '') {
    http_response_code(401);
    die;  
}
session_id($session_id);
session_start();
$username = $_COOKIE["ViikkoBiitsiUser"];
if($username == '' || $_SESSION["username"] != $username) {
    http_response_code(401);
    die;  
}
?>