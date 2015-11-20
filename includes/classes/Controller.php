<?php

/**
 * Class Controller
 *
 * Наш роутер-контроллер
 *
 */
class Controller
{
    /**
     * Зарегестрированные страницы
     *
     * @var array
     */
    protected $pages = array();

    public function __construct() {
        $this->pages = array();
    }

    public function route() {

    }
}