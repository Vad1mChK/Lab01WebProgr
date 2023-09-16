<?php
session_start();

if($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header("HTTP/1.1 405 Method Not Allowed");
    header("Allow: GET");
    exit;
}

$shots = [];
if(!isset($_SESSION["shots"])) {
    $_SESSION["shots"] = $shots;
} else {
    $shots = $_SESSION["shots"];
}

$response = [
    'shots' => $shots
];

echo json_encode($response);
?>