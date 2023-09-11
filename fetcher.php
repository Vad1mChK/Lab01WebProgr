<?php
session_start();

$shots = [];
if(!isset($_SESSION["shots"])) {
    $shots = [];
    $_SESSION["shots"] = $shots;
} else {
    $shots = $_SESSION["shots"];
}

$response = [
    'shots' => $shots
];

echo json_encode($response);
?>