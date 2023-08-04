<?php
include 'add_cors_headers.php';
// include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();
$conn->begin_transaction();

$query= "SELECT * FROM syotetyt_tulokset_varmuuskopio";

echo '"id";"meta_id";"post_id";"meta_key";"meta_value";"insert_date"'. "\n";
$rankings_r = $conn->query($query);

while($row = $rankings_r->fetch_object()) {
    echo $row->id. ";". $row->meta_id. ";". $row->post_id. ";". $row->meta_key. ";". $row->meta_value. ";". $row->insert_date. "\n";
}

$conn->commit();
?>