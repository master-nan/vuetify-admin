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

    public function updateConfig($id = null, $param = [])
    {
        try {
            $this->allowField(true)->save($param, [$this->getPk() => $id]);
            return true;
        } catch (\Exception $e) {
            $this->error = '更新失败';
            return false;
        }
    }
}
