<?php

function connect_database(): mysqli {
    $server_name = "database";
    $user_name = "root";
    $password = "root";
    $database_name = "viikkobiitsi";

    $conn = new mysqli($server_name, $user_name, $password, $database_name);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    if(!$conn->set_charset("utf8mb4")) {
        die("Failed to set UTF-8");
    }

    return $conn;
}

?>