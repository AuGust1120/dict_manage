CREATE TABLE system_dict_type (
id bigint NOT NULL AUTO_INCREMENT COMMENT '字典主键',
name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
DEFAULT '' COMMENT '字典名称',
type varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
DEFAULT '' COMMENT '字典类型',
status tinyint NOT NULL DEFAULT 0 COMMENT '状态（0正常 1停⽤）',
remark varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT
NULL COMMENT '备注',
creator varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT
'' COMMENT '创建者',
create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
updater varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT
'' COMMENT '更新者',
update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP COMMENT '更新时间',
deleted bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
deleted_time datetime NULL DEFAULT NULL COMMENT '删除时间',
PRIMARY KEY (id) USING BTREE,
UNIQUE INDEX dict_type(type ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 169 CHARACTER SET = utf8mb4 COLLATE =
utf8mb4_unicode_ci COMMENT = '字典类型表';
CREATE TABLE system_dict_data (
id bigint NOT NULL AUTO_INCREMENT COMMENT '字典编码',
sort int NOT NULL DEFAULT 0 COMMENT '字典排序',
label varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
DEFAULT '' COMMENT '字典标签',
value varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
DEFAULT '' COMMENT '字典键值',
dict_type varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
DEFAULT '' COMMENT '字典类型',
status tinyint NOT NULL DEFAULT 0 COMMENT '状态（0正常 1停⽤）',
color_type varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL
DEFAULT '' COMMENT '颜⾊类型',
css_class varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL
DEFAULT '' COMMENT 'css 样式',
remark varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT
NULL COMMENT '备注',
creator varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT
'' COMMENT '创建者',
create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
updater varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT
'' COMMENT '更新者',
update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP COMMENT '更新时间',
deleted bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
PRIMARY KEY (id) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1234 CHARACTER SET = utf8mb4 COLLATE =
utf8mb4_unicode_ci COMMENT = '字典数据表';