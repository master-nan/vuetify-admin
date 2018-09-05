<?php
namespace app\admin\validate;

use think\Validate;

class Rule extends Validate
{
    protected $rule = [
        'name' => 'require'
    ];

    protected $message  =   [
        'name.require' => '权限名称不能为空'
    ];

    protected $scene = [

    ];
}
