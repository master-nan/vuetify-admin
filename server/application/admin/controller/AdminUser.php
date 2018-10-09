<?php

namespace app\admin\controller;

class AdminUser extends Comm
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('AdminUser');
    }

    public function index()
    {
        if (!$this->checkRule()) {
            return msg(401, null, '您没有权限操作');
        }
        $arr = [];
        $page = 1;
        $len = 15;
        if (isset($this->param['data'])) {
            $data = json_decode($this->param['data'], true);
            foreach ($data as $key => $value) {
                if ($key == 'page') {
                    $page = $value;
                    unset($data[$key]);
                    continue;
                }
                if ($key == 'len') {
                    $len = $value;
                    unset($data[$key]);
                    continue;
                }
                if ($value != '' || $value != null) {
                    $arr['u.'.$key] = $value;
                    if ($key == 'nickname') {
                        $arr['u.'.$key] = array('like','%'.$value.'%');
                        $data[$key] = array('like','%'.$value.'%');
                    } else {
                        $arr['u.'.$key] = $value;
                    }
                }
                if ($value == '' || $value == null) {
                    unset($data[$key]);
                }
            }
        } else {
            $data = [];
        }
        $count = $this->model->count($data);
        if ($page > ceil($count / $len)) {
            $page = ceil($count / $len);
        }
        $ret = $this->model->getUsers($arr, $page, $len);
        if ($ret) {
            return msg(200, $ret, null, $count);
        } else {
            return msg(204, [], $this->model->getError());
        }
    }

    public function read()
    {
        $id = $this->param['id'];
        $ret = $this->model->getUserById($id);
        if ($ret) {
            return msg(200, $ret);
        } else {
            return msg(100, null, $this->model->getError());
        }
    }

    public function save()
    {
        if (!$this->checkRule()) {
            return msg(401, null, '您没有权限操作');
        }
        if (isset($this->param['password']) && $this->param['password'] != '') {
            $this->param['password'] = md5($this->param['password'].$this->param['username']);
        } else {
            unset($this->param['password']);
        }
        $ret = $this->model->saveUser($this->param);
        if ($ret) {
            return msg(200, null, '添加成功');
        } else {
            return msg(100, null, $this->model->getError());
        }
    }

    public function update()
    {
        if (!$this->checkRule()) {
            return msg(401, null, '您没有权限操作');
        }
        if (isset($this->param['id'])) {
            $id = $this->param['id'];
            unset($this->param['id']);
        } else {
            return msg(100, null, '参数错误');
        }
        if ($id == 1) {
            return msg(100, null, '无法操作管理员账号');
        }
        if (isset($this->param['password']) && $this->param['password'] != '') {
            $this->param['password'] = md5($this->param['password'].$this->param['username']);
        } else {
            unset($this->param['password']);
        }
        $ret = $this->model->updateUser($id, $this->param);
        if ($ret) {
            return msg(200, null, '更新成功');
        } else {
            return msg(100, null, $this->model->getError());
        }
    }

    public function delete()
    {
        if (!$this->checkRule()) {
            return msg(401, null, '您没有权限操作');
        }
        if ($this->param['id']) {
            $id = $this->param['id'];
        } else {
            return msg(100, null, '参数错误');
        }
        $ret = $this->model->del($id);
        if ($ret) {
            return msg(200, null, '删除成功');
        } else {
            return msg(100, null, $this->model->getError());
        }
    }

    public function setUserInfo()
    {
        $data = [];
        if (isset($this->param['data'])) {
            $data = json_decode($this->param['data'], true);

            foreach ($data as $key => $value) {
                if ($value == '' || $value == null) {
                    unset($data[$key]);
                }
            }
        }
        $ret = $this->model->updateUser($this->user['id'], $data, false);
        if ($ret) {
            return msg(200, null, '更新成功');
        } else {
            return msg(100, null, $this->model->getError());
        }
    }

    public function changePass()
    {
        if (!isset($this->param['oldPass']) || !isset($this->param['newPass'])) {
            return msg(100, null, '请填写内容');
        }
        $oldPass = md5($this->param['oldPass'].$this->user['username']);
        $newPass = md5($this->param['newPass'].$this->user['username']);
        $data = [
          'username' => $this->user['username'],
          'password' => $oldPass
        ];
        $ret = $this->model->getUserLogin($data);
        if (!$ret) {
            return msg(100, null, '旧密码错误');
        }
        $ret = $this->model->updateUser($this->user['id'], ['password'=>$newPass], false);
        if ($ret) {
            return msg(200, null, '更新成功');
        } else {
            return msg(100, null, $this->model->getError());
        }
    }

    public function enable()
    {
        if (isset($this->param['id'])) {
            $id = $this->param['id'];
            unset($this->param['id']);
        } else {
            return msg(100, null, '参数错误');
        }
        if ($id == 1) {
            return msg(100, null, '无法操作管理员账号');
        }
        $ret = $this->model->updateUser($id, $this->param, false);
        if ($ret) {
            return msg(200, null, '操作成功');
        } else {
            return msg(100, null, $this->model->getError());
        }
    }
}
