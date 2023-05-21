<?php
header('Content-type: text/plain; charset=utf-8');
header("Content-Type: text/html; charset=ISO-8859-1");
$username = "";
$password = "";
$hostname = "";
$database= "";

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if(!$conn->set_charset("utf8mb4")) {
    die("Failed to set UTF-8");
}
?>
<div style="overflow-x:auto;">
  <table id='tilasto'>
    <tr>
      <th >Ranking</th>
      <th >Nimi</th>
      <th nowrap="nowrap">Viikko 1</th>
      <th nowrap="nowrap">Viikko 2</th>
      <th>Total</th>
    </tr>
    <?php

$query= "SELECT * FROM kokonaistulokset_miehet ORDER BY total DESC";

$score_res = $conn->query($query);
$rank = 1;
while($score_row = $score_res->fetch_object()) {
    echo '<tr>';
    echo ' <td>'.$rank. ' </td>';
    echo ' <td>'.$score_row->nimi. ' </td>';
    echo ' <td>'.$score_row->viikko_1. ' </td>';
    echo ' <td>'.$score_row->viikko_2. ' </td>';
    echo ' <td>'.$score_row->total. ' </td>';
    echo '<tr>';

    $rank+=1;
}

?>
  </table>
</div>