<?php
$allowed_origins = ['http://localhost:3000', 'http://localhost:3001'];
$origin =  $_SERVER['HTTP_ORIGIN'];
$is_origin_valid = in_array($origin, $allowed_origins);
if ($is_origin_valid) {
  header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die;
}
?>