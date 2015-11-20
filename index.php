<?php

require_once('includes/init.php');

$template = new template('body');

for($i = 0; $i < 3; $i ++) {
    $template->assign_block_vars('row', array(
        'Y' => $i,
    ));
    for($j = 0; $j < 3; $j ++) {
        $template->assign_block_vars('row.column', array(
          'X' => $j,
        ));
    }
}

$template->displayPageFull();
