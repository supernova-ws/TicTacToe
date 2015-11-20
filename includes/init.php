<?php

if(defined('INSIDE')) {
    return;
}

define('INSIDE', true);

// Замеряем здесь, пока выполнено минимум кода
define('MEM_START', memory_get_usage());
define('TIME_NOW_MICRO', microtime(true));

global $phpbb_root_path; // Это нужно для работы phpBB template engine
$phpbb_root_path = str_replace('\\', '/', realpath(__FILE__));
$phpbb_root_path = str_replace('includes/init.php', '', $phpbb_root_path);
define('SN_ROOT_PHYSICAL', $phpbb_root_path); // Для работы автолоадера
$phpbb_root_path .= 'design/';

$sn_root_relative = str_replace('\\', '/', getcwd());
$sn_root_relative .= $sn_root_relative[strlen($sn_root_relative) - 1] == '/' ? '' : '/';
$sn_root_relative = str_replace(SN_ROOT_PHYSICAL, '', $sn_root_relative);
$sn_root_relative .= basename($_SERVER['SCRIPT_NAME']);
$sn_root_relative = str_replace($sn_root_relative, '', $_SERVER['SCRIPT_NAME']);
define('SN_ROOT_RELATIVE', $sn_root_relative);

define('SN_ROOT_VIRTUAL' , 'http' . (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] . SN_ROOT_RELATIVE);
define('SN_ROOT_VIRTUAL_PARENT' , str_replace('//google.', '//', SN_ROOT_VIRTUAL));


/**
 * Autoloader
 *
 * @param string $class
 * @return void
 */
spl_autoload_register(function ($class) {
    $file = SN_ROOT_PHYSICAL . 'includes/classes/' . str_replace('\\', '/', $class) . '.php';

    if (file_exists($file)) {
        require_once($file);
        if(method_exists($class, 'init') && $class !== 'TicTacToe') {
            $class::init();
        }
    }
});

TicTacToe::init();
