<?php
session_start();
$username = $_COOKIE["ViikkoBiitsiUser"];
if($username == '' || $_SESSION["username"] != $username) {
    http_response_code(401);
    die;  
}
?>