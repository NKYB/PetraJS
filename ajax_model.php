<?php
/**
 * Model storage  
 */

// TODO: add security here++
$action = $_POST['action'];
$model_name = $_POST['model_name'];
$model = json_decode($_POST['model']);

// TODO: show example for MySql db

// session example for storing model
session_start();
switch($action){
    case 'GET_MODEL':
        if (isset($_SESSION['models'][$model_name]))
            echo $_SESSION['models'][$model_name];
        else
            echo '{}';
        break;
    case 'SET_MODEL':
        if (!isset($_SESSION['models']))
            $_SESSION['models'] = array();
        if (!isset($_SESSION['models'][$model_name]))
            $_SESSION['models'][$model_name] = array();
        $_SESSION['models'][$model_name] = str_replace("'","`",json_encode($model));
        echo '0';
        break;
}
