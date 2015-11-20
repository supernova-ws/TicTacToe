<?php

/**
 *
 * Class TicTacToe
 *
 * God Object
 *
 */
class TicTacToe
{
    /**
     * Кэшер
     * @var null $cache
     */
    public static $cache = null;
    /**
     * Отладка и прочий фансервис
     * @var d $d
     */
    public static $d = null;
    /**
     * Конфигурация
     * @var null $config
     */
    public static $config = null;

    /**
     * Активный темплейт
     * @var template $template
     */
    public static $template = null;

    /**
     * @var Controller $controller
     */
    protected static $controller = null;

    public static function init() {
        require_once(SN_ROOT_PHYSICAL . 'includes/constants.php');
        require_once(SN_ROOT_PHYSICAL . 'includes/trash.php');

        // Пока простенькая локаль. Будет время - добавлю объект поумнее
        require_once(SN_ROOT_PHYSICAL . 'locales/ru.mo.php');
        self::$controller = new Controller();
//        self::$config = new Config();
    }

    public static function log_file($message, $spaces = 0) {
//        if(is_object(self::$debug_handler)) {
//            self::$debug_handler->log_file($message, $spaces);
//        }
    }

}
