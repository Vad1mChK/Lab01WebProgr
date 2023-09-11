<?php

session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$shots = [];
if(!isset($_SESSION["shots"])) {
    $shots = [];
    $_SESSION["shots"] = $shots;
} else {
    $shots = $_SESSION["shots"];
}

$x = $_GET['x'];
$y = $_GET['y'];
$r = $_GET['r'];

$errors = [];

/**
 * Проверяем валидность поступивших значений
 */
function validateQuery() {
    define("Y_MIN", -5);
    define("Y_MAX", 3);

    if(empty($x)) {
        $errors[] = "В запросе отсутствует координата X.";
    } elseif (!is_numeric($x)) {
        $errors[] = "Координата X &mdash; не число.";
    } elseif(!in_array($x, ['-4', '-3', '-2', '-1', '0', '-1', '-2', '-3', '-4'])) {
        $errors[] = "Координата X &mdash; не целое число в диапазоне [-4..4]";
    }
    if(empty($y)) {
        $errors[] = "В запросе отсутствует координата Y.";
    } elseif(!is_numeric($y)) {
        $errors[] = "Координата Y &mdash; не число.";
    } elseif(strlen($y) > 15) {
        $errors[] = "Вы не могли ввести такое значение в форму. Вы явно читерите.";
    } elseif($y <= Y_MIN || $y >= Y_MAX) {
        $errors[] = "Координата Y &mdash; не число на открытом интервале (".Y_MIN."..".Y_MAX.")";
    }
    if(empty($r)) {
        $errors[] = "В запросе отсутствует параметр R.";
    } elseif(!is_numeric($r)) {
        $errors[] = "Параметр R &mdash; не число.";
    } elseif(!in_array($r, ['1', '2', '3', '4', '5'])) {
        $errors[] = "Координата X &mdash; не целое число в диапазоне [1..5]";
    }
}

/**
 * Проверяем, попал ли выстрел в область
 */
function isDotWithinArea($x, $y, $r) {
    return ($x >= 0 && $y >= 0 && $x <= $r && $y <= $r) // Верхний правый квадрант
        || ($x <= 0 && $y >= 0 && $y - 2*$x <= $r) // Верхний левый квадрант
        // Нижний левый квадрант пуст
        || ($x >= 0 && $y <= 0 && $x*$x + $y*$y <= $r*$r/4); // Нижний правый квадрант
}

validateQuery();

if (empty($errors)) {
    // Собственно, стреляем и проверяем попадание
    $hit = isDotWithinArea($x, $y, $r);

    // Создаём новый выстрел
    $shot = [
        'x' => $x,
        'y' => $y,
        'r' => $r,
        'hit' => $hit,
        'datetime' => date('M d, Y - H:i:s'),
        'timeElapsed' => number_format(microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"], 6)
    ];

    // Добавляем новый выстрел в массив
    $shots[] = $shot;

    // Сохраняем массив в сессии
    $_SESSION["shots"] = $shots;
}

$response = [
    'shots' => $shots,
    'lastShot' => end($shots),
    'errors' => $errors
];

echo json_encode($response);

?>