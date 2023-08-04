<?php
  $hourMin =  (int)date('W');
  include 'connect_to_database.php';
  $conn = connect_database();
  $username = 'viikkobiitsi';
  $auth_stmt = $conn->prepare("SELECT hallinta_arvo FROM viikko_biitsi_hallinta WHERE hallinta_avain = ?");
  $auth_stmt->bind_param('s', $username);
  $auth_stmt->execute();
  $auth_stmt->bind_result($password_in_db);
  $auth_stmt->fetch();
  $auth_stmt->close();
  echo $password_in_db;
?>