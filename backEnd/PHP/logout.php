<?php
include 'add_cors_headers.php';
$session_id = $_COOKIE["ViikkoBiitsiSession"];
session_id($session_id);
session_start();
session_unset();
session_destroy();
?>