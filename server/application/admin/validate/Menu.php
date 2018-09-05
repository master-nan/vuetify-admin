<?php
namespace app\admin\validate;

use think\Validate;

class Menu extends Validate
{
    protected $rule = [
        'title' => 'require',
        'name' => 'require|alphaNum',
    ];

    protected $message  =   [
        'title.require' => '显示标题不能为空',
        'name.require' => 'name不能为空',
        'name.alphaNum' => 'name只能为字母数字',
    ];

    protected $scene = [

    ];
}
