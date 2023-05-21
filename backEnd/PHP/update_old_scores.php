<?php
include 'connect_to_database.php';
header("Access-Control-Allow-Origin: *");
$conn = connect_database();
$conn->begin_transaction();

function handle_error(mysqli $conn): void {
    $conn->rollback();
    die;
}

$json = file_get_contents('php://input');
$post_data = json_decode($json); 



$conn->commit();
?>