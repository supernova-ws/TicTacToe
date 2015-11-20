<?php

defined('INSIDE') or die('Hacking attempt');

define('TIME_NOW', intval(TIME_NOW_MICRO));
define('FMT_DATE_TIME_SQL', 'Y-m-d H:i:s');
define('TIME_NOW_SQL', date(FMT_DATE_TIME_SQL, TIME_NOW));

define('DEFAULT_TEMPLATE', 'original');
define('DEFAULT_LANG', 'ru');

define('TEMPLATE_EXTENSION', '.tpl.html');
define('TEMPLATE_PATH', 'design/templates/' . DEFAULT_TEMPLATE . '/');
define('TEMPLATE_DIR', SN_ROOT_PHYSICAL . 'design/templates/' . DEFAULT_TEMPLATE); // Fallback for PTL

$phpEx = strpos($phpEx = substr(strrchr(__FILE__, '.'), 1), '/') === false ? $phpEx : '';
define('PHP_EX', $phpEx); // PHP extension on this server
// TODO - remove
define('DOT_PHP_EX', '.' . PHP_EX); // PHP extension on this server
