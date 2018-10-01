/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : localhost:3308
 Source Schema         : vuetify_admin

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 01/10/2018 21:15:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for m_admin_user
-- ----------------------------
DROP TABLE IF EXISTS `m_admin_user`;
CREATE TABLE `m_admin_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nickname` varchar(64) DEFAULT NULL,
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `create_at` int(10) DEFAULT NULL,
  `r_id` tinyint(3) DEFAULT NULL,
  `d_id` tinyint(3) DEFAULT '0' COMMENT '部门id',
  `p_id` tinyint(3) DEFAULT '0' COMMENT '岗位',
  `last_login_at` int(10) DEFAULT '0' COMMENT '上次登录时间',
  `last_logout_at` int(10) DEFAULT NULL COMMENT '上次退出时间',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像路径',
  `status` tinyint(1) DEFAULT '1' COMMENT '当前状态0禁用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of m_admin_user
-- ----------------------------
BEGIN;
INSERT INTO `m_admin_user` VALUES (1, '管理员', 'admin', 'cea3e8e1659582206e0be32539729e9f', NULL, NULL, NULL, NULL, 1538398901, 1538399721, NULL, 1);
INSERT INTO `m_admin_user` VALUES (2, '测试11', 'dev', 'e77989ed21758e78331b20e477fc5582', 0, 1, 2, 3, 1533287732, 1533287755, '', 1);
COMMIT;

-- ----------------------------
-- Table structure for m_department
-- ----------------------------
DROP TABLE IF EXISTS `m_department`;
CREATE TABLE `m_department` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT '',
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='部门表';

-- ----------------------------
-- Records of m_department
-- ----------------------------
BEGIN;
INSERT INTO `m_department` VALUES (1, '总经办', 1);
INSERT INTO `m_department` VALUES (2, '财务部', 1);
INSERT INTO `m_department` VALUES (3, '研发部', 1);
INSERT INTO `m_department` VALUES (4, '设计部', 1);
INSERT INTO `m_department` VALUES (5, '市场部', 1);
INSERT INTO `m_department` VALUES (6, '测试部', 1);
INSERT INTO `m_department` VALUES (7, '项目部', 1);
COMMIT;

-- ----------------------------
-- Table structure for m_files
-- ----------------------------
DROP TABLE IF EXISTS `m_files`;
CREATE TABLE `m_files` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `u_id` int(10) DEFAULT '0',
  `ext` varchar(16) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `create_at` int(10) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for m_menu
-- ----------------------------
DROP TABLE IF EXISTS `m_menu`;
CREATE TABLE `m_menu` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `pid` int(10) DEFAULT '0',
  `name` varchar(64) DEFAULT NULL COMMENT '路由中可跳转name，请保持唯一值',
  `title` varchar(64) DEFAULT NULL COMMENT '显示名称',
  `icon` varchar(64) DEFAULT NULL COMMENT '显示icon class，一级菜单有效',
  `component` varchar(255) DEFAULT NULL COMMENT '引入的vue在前端代码中的位置',
  `path` varchar(255) DEFAULT NULL COMMENT '路径',
  `redirect` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '面包屑点击跳转路径',
  `show` tinyint(1) DEFAULT '1' COMMENT '是否始终在左侧显示',
  `hidden` tinyint(1) DEFAULT '0' COMMENT '是否在左侧隐藏',
  `sort` tinyint(2) DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '1',
  `op` varchar(64) DEFAULT NULL COMMENT '后台判断权限',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COMMENT='菜单';

-- ----------------------------
-- Records of m_menu
-- ----------------------------
BEGIN;
INSERT INTO `m_menu` VALUES (1, 0, 'organization', 'Organization', 'mdi-sitemap', 'home', '/organization', '', 1, 0, 8, 1, '');
INSERT INTO `m_menu` VALUES (2, 0, 'system', 'System', 'mdi-settings', 'home', '/system', '', 1, 0, 9, 1, '');
INSERT INTO `m_menu` VALUES (3, 1, 'department', 'Department', 'mdi-puzzle', 'department', 'department/index', '', 1, 0, 1, 1, '');
INSERT INTO `m_menu` VALUES (4, 1, 'position', 'Position', 'mdi-account-card-details', 'position', 'position/index', '', 1, 0, 2, 1, 'admin-Menu-save');
INSERT INTO `m_menu` VALUES (5, 1, 'user', 'User', 'mdi-account-group', 'user', 'user/index', '', 1, 0, 3, 1, 'admin-Menu-index');
INSERT INTO `m_menu` VALUES (6, 2, 'menu', 'Menu', 'mdi-format-list-bulleted', 'menu', 'menu/index', '', 1, 0, 1, 1, '');
INSERT INTO `m_menu` VALUES (7, 2, 'rule', 'Rule', 'mdi-account-key', 'rule', 'rule/index', '', 1, 0, 2, 1, 'admin-Department-index');
INSERT INTO `m_menu` VALUES (8, 2, 'addMenu', 'addMenu', '', 'addMenu', 'menu/add', '', 1, 1, 1, 1, 'admin-Department-save');
INSERT INTO `m_menu` VALUES (9, 2, 'addRule', 'addRule', '', 'addRule', 'rule/add', '', 1, 1, 2, 1, 'admin-Department-update');
INSERT INTO `m_menu` VALUES (10, 2, 'setting', 'Setting', 'mdi-circle-edit-outline', 'setting', 'setting/index', '', 1, 0, 3, 1, 'admin-Menu-update');
COMMIT;

-- ----------------------------
-- Table structure for m_position
-- ----------------------------
DROP TABLE IF EXISTS `m_position`;
CREATE TABLE `m_position` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL COMMENT '岗位名称',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态1启用,0禁用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='岗位表';

-- ----------------------------
-- Records of m_position
-- ----------------------------
BEGIN;
INSERT INTO `m_position` VALUES (1, '后端开发工程师', 1);
INSERT INTO `m_position` VALUES (2, '前端开发工程师', 1);
INSERT INTO `m_position` VALUES (3, '设计师', 1);
INSERT INTO `m_position` VALUES (4, '文案策划', 1);
INSERT INTO `m_position` VALUES (5, '产品助理', 1);
INSERT INTO `m_position` VALUES (6, '总经理', 1);
INSERT INTO `m_position` VALUES (7, '项目经理', 1);
INSERT INTO `m_position` VALUES (8, '项目助理', 1);
INSERT INTO `m_position` VALUES (9, '测试工程师', 1);
INSERT INTO `m_position` VALUES (10, '人事经理', 1);
INSERT INTO `m_position` VALUES (11, 'CEO', 1);
COMMIT;

-- ----------------------------
-- Table structure for m_rule
-- ----------------------------
DROP TABLE IF EXISTS `m_rule`;
CREATE TABLE `m_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '名称',
  `rs` varchar(4000) DEFAULT NULL COMMENT '权限id',
  `remark` varchar(256) DEFAULT NULL COMMENT '备注',
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='权限组';

-- ----------------------------
-- Records of m_rule
-- ----------------------------
BEGIN;
INSERT INTO `m_rule` VALUES (1, '部分权限', '1,5,3,4', '测试', 1);
INSERT INTO `m_rule` VALUES (2, '全部权限', '1,3,4,5,2,6,8,7,9,10', '测试', 1);
COMMIT;

-- ----------------------------
-- Table structure for m_sys_config
-- ----------------------------
DROP TABLE IF EXISTS `m_sys_config`;
CREATE TABLE `m_sys_config` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `logo` varchar(256) DEFAULT NULL,
  `remark` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='系统配置';

-- ----------------------------
-- Records of m_sys_config
-- ----------------------------
BEGIN;
INSERT INTO `m_sys_config` VALUES (1, 'Walnutech1', '', '');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
