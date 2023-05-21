<?php
include 'connect_to_database.php';
$conn = connect_database();
header("Access-Control-Allow-Origin: *");

$post_id = $_GET["post_id"];
if ($post_id == ""  || !$post_id) {
    echo "invalid post_id";
}

$delete_stmt = $conn->prepare("DELETE FROM wpzl_postmeta WHERE post_id=?");
$delete_stmt->bind_param('s', $post_id);
if(!$delete_stmt->execute()) {
    http_response_code(500);
}

?>