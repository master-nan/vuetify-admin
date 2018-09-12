<?php

namespace app\admin\model;

use think\Model;

class SysConfig extends Model
{
    public function getConfig($data = [])
    {
        $res = $this->where($data)->find();
        return $res;
    }

    public function update($id = null, $param = [])
    {
        $validate = validate($this->name);
        if (!$validate->check($param)) {
            $this->error = $validate->getError();
            return false;
        }
        try {
            $this->allowField(true)->save($param, [$this->getPk() => $id]);
            return true;
        } catch (\Exception $e) {
            $this->error = '更新失败';
            return false;
        }
    }
}
