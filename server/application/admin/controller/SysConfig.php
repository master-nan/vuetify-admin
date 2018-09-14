<?php

namespace app\admin\controller;

class SysConfig extends Comm
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('SysConfig');
    }

    public function index()
    {
        $ret = $this->model->getConfig();
        if ($ret) {
            return msg(200, $ret);
        } else {
            return msg(204, [], $this->model->getError());
        }
    }
    
    public function update()
    {
        if (!$this->checkRule()) {
            return msg(401, null, '您没有权限操作');
        }
        if ($this->param['id']) {
            $id = $this->param['id'];
            unset($this->param['id']);
        } else {
            return msg(100, null, '参数错误');
        }
        $ret = $this->model->updateConfig($id, $this->param);
        if ($ret) {
            return msg(200, null, '更新成功');
        } else {
            return msg(100, null, $this->model->getError());
        }
    }

}
