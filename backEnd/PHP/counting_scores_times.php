<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $query = "SELECT hallinta_arvo FROM viikko_biitsi_hallinta WHERE hallinta_avain='laskettavat_kerrat_pisteisiin'";
  $res = $conn->query($query);
  $counting_times = $res->fetch_object()->hallinta_arvo;
  echo '{"data": ['. $counting_times. "]}";
}

else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $post_data = json_decode($json); 
  $counting_times =  $post_data->countingTimes;
  echo $counting_times;
  $stmt = $conn->prepare("UPDATE viikko_biitsi_hallinta SET hallinta_arvo=? WHERE hallinta_avain='laskettavat_kerrat_pisteisiin'");
  $stmt->bind_param('s', $counting_times);
  if(!$stmt->execute()) {
      http_response_code(500);
  }
}

?>