<?php
include 'connect_to_database.php';

function check_log_in(): bool {
  return isset($_SESSION) && $_SESSION["loggedin"];  
}
?>