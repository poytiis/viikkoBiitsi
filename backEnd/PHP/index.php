<?php
  include 'connect_to_database.php';
  session_start();
  echo 'hello';
  echo $_COOKIE["ViikkoBiitsiSession"];
  $conn = connect_database();
?>