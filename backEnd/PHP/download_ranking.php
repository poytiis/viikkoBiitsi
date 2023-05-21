<?php
include 'connect_to_database.php';
$conn = connect_database();
header("Access-Control-Allow-Origin: *");

$serie = $_GET["serie"];
$query= "";
if($serie == 'men') {
    $query = "SELECT * FROM kokonaistulokset_miehet  ORDER BY total DESC ";
} else {
    $query = "SELECT * FROM kokonaistulokset_naiset  ORDER BY total DESC ";
}

echo '"id";"nimi";"viikko_1";"viikko_2";"total"'. "\n";
$rankings_r = $conn->query($query);

while($row = $rankings_r->fetch_object()) {
    echo $row->id. ";". $row->nimi. ";". $row->viikko_1. ";". $row->viikko_2. ";". $row->total. "\n";
}

?>