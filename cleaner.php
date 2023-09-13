<?php
session_start();

if($_SERVER['REQUEST_METHOD'] != 'DELETE') {
    header("HTTP/1.1 405 Method Not Allowed");
    exit;
}

echo json_encode([]);
?>