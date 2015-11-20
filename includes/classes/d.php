<?php

/**
 * Class d
 *
 * Debug class. По факту его никто никогда не должен видеть. Rip-off из SuperNova
 *
 */

class d
{

    protected static $log_file_handler = null;
    /**
     * Логи в файл
     *
     * @param string $message
     * Сообщение
     *
     * @param int $ident_change
     * Изменение отступа
     */
    public static function log_file($message, $ident_change = 0) {
        static $ident = 0;

        if(!defined('SN_DEBUG_LOG')) {
            return;
        }

        if(self::$log_file_handler === null) {
            self::$log_file_handler = @fopen(SN_ROOT_PHYSICAL . '/.logs/supernova.log', 'a+');
            @fwrite(self::$log_file_handler, "\r\n\r\n");
        }
        $ident_change < 0 ? $ident += $ident_change * 2 : false;
        if(self::$log_file_handler) {
            @fwrite(self::$log_file_handler, date(FMT_DATE_TIME_SQL, time()) . str_repeat(' ', $ident + 1) . $message . "\r\n");
        }
        $ident_change > 0 ? $ident += $ident_change * 2 : false;
    }

    /**
     * Лучший и более безопасный дамп переменных, чем var_dump()
     *
     * @param mixed  $value - Переменная для дампа
     * @param string|null $varname - Имя, под которым её вывести
     * @param int    $level - Для вывода вложенных структур
     * @param string $dumper - Накопительная строка
     *
     * @return string
     */
    public static function dump($value, $varname = null, $level = 0, $dumper = '') {
        if(isset($varname)) {
            $varname .= " = ";
        }

        if($level == -1) {
            $trans[' '] = '&there4;';
            $trans["\t"] = '&rArr;';
            $trans["\n"] = '&para;;';
            $trans["\r"] = '&lArr;';
            $trans["\0"] = '&oplus;';

            return strtr(htmlspecialchars($value), $trans);
        }
        if($level == 0) {
            $dumper = '<pre>' . mt_rand(10, 99) . '|' . $varname;
        }

        $type = gettype($value);
        $dumper .= $type;

        if($type == 'string') {
            $dumper .= '(' . strlen($value) . ')';
            $value = self::dump($value, '', -1);
        } elseif($type == 'boolean') {
            $value = ($value ? 'true' : 'false');
        } elseif($type == 'object') {
            $props = get_class_vars(get_class($value));
            $dumper .= '(' . count($props) . ') <u>' . get_class($value) . '</u>';
            foreach($props as $key => $val) {
                $dumper .= "\n" . str_repeat("\t", $level + 1) . $key . ' => ';
                $dumper .= self::dump($value->$key, '', $level + 1);
            }
            $value = '';
        } elseif($type == 'array') {
            $dumper .= '(' . count($value) . ')';
            foreach($value as $key => $val) {
                $dumper .= "\n" . str_repeat("\t", $level + 1) . self::dump($key, '', -1) . ' => ';
                $dumper .= self::dump($val, '', $level + 1);
            }
            $value = '';
        }
        $dumper .= " <b>$value</b>";
        if($level == 0) {
            $dumper .= '</pre>';
        }

        return $dumper;
    }

    /**
     * Печатает дамп переменной - безопасно
     *
     * @param mixed $value - Переменная
     * @param string|null $varname - Имя переменной
     */
    public static function pdump($value, $varname = null) {
        // Спагетти код - потому что никому нельзя доверять! Даже себе!
        print('<div style="text-align: left; background-color: #111111; color: #0A0; font-family: Courier, monospace !important; padding: 1px 0; font-weight: 800; font-size: 14px; width: 100%;">' . self::dump($value, $varname) . '</div>');
    }

}
