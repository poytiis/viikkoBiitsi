<?php
include 'connect_to_database.php';

$name = $_GET["nimi"];
if ($name == ""  || !$name) {
    echo "invalid post_id";
}
$conn = connect_database();
$year = date('y');
$insert_stmt = $conn->prepare("INSERT INTO kausikortit VALUES (DEFAULT, ?, ?)");
$insert_stmt->bind_param('is', $year, $name);
if(!$insert_stmt->execute()) {
    http_response_code(500);
}

?>