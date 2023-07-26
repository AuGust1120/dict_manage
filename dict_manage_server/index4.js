const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const moment = require("moment");

// 配置数据库连接信息
const config = {
  user: "sa", // update me
  password: "august", // update me
  server: "DESKTOP-6E6HSFS", // update me
  database: "DB_HELE", // update me
  options: {
    encrypt: true, // Use this only if you're on Windows Azure
    trustServerCertificate: true, // Add this line to trust self-signed certificates
  },
};
console.log("当前数据库服务器：" + config.server); // 打印输出 server 属性的值

// 连接到数据库
sql
  .connect(config)
  .then(() => console.log("已成功连接到数据库"))
  .catch((err) => console.error("数据库连接失败：", err));

// 添加数据到 system_dict_type 表
app.post("/createDict", (req, res) => {
  const data = req.body;
  const currentTime = new Date().toLocaleString();
  data.create_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  data.status = data.status == "开启" ? 0 : 1;

  // 构建 SQL 查询语句和参数
  const sqlQuery = `INSERT INTO system_dict_type (name, type, status, create_time,remark) VALUES ('${data.name}','${data.type}','${data.status}','${data.create_time}','${data.remark}')`;
  const params = {
    name: data.name,
    type: data.type,
    status: data.status,
    create_time: data.create_time,
  };
  console.log(params);
  // 执行数据库插入操作
  sql
    .query(sqlQuery)
    .then(() => {
      console.log("数据插入成功");
      res.send("数据插入成功");
    })
    .catch((error) => {
      console.error("插入数据失败", error);
      res.status(500).send("插入数据失败");
    });
});

// 添加数据到 system_dict_data 表
app.post("/createDictData", (req, res) => {
  const data = req.body;
  const currentTime = new Date().toLocaleString();
  console.log(data);
  data.create_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  data.status = data.status == "开启" ? 0 : 1;

  // 构建 SQL 查询语句和参数
  //修改name

  const sqlQuery = `INSERT INTO system_dict_data (dict_type,value, label, status, create_time,param_id,sort,css_class,remark) 
  VALUES ('${data.dict_type}','${data.value}','${data.label}','${data.status}','${data.create_time}','${data.param_id}','${data.sort}','${data.css_class}','${data.remark}')`;

  // 执行数据库插入操作
  sql
    .query(sqlQuery)
    .then(() => {
      console.log("数据插入成功");
      res.send("数据插入成功");
    })
    .catch((error) => {
      console.error("插入数据失败", error);
      res.status(500).send("插入数据失败");
    });
});

// 通用的删除记录函数
const deleteRecord = async (tableName, id) => {
  const currentTime = new Date().toLocaleString();
  const deletedTime = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );

  const sqlQuery = `UPDATE ${tableName} SET deleted = 1, deleted_time = @deletedTime WHERE id = @id;`;

  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("deletedTime", sql.DateTime, deletedTime)
    .input("id", sql.Int, id)
    .query(sqlQuery);

  return result.rowsAffected[0];
};

// 删除记录的路由处理程序
app.delete("/record/:tableName/:id", async (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
  try {
    const deletedRows = await deleteRecord(tableName, id);
    console.log("Deleted Rows:", deletedRows);
    res.json(deletedRows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// 根据ID查询记录
const getRecordById = async (id) => {
  const sqlQuery = `SELECT * FROM system_dict_type WHERE id = @id;`;

  const pool = await sql.connect(config);
  const result = await pool.request().input("id", sql.Int, id).query(sqlQuery);

  return result.recordset[0];
};

// 根据ID查询记录
app.get("/record/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const record = await getRecordById(id);
    console.log("Record:", record);
    res.json(record);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// 根据ID查询记录
const getRecordByIdDict = async (id) => {
  const sqlQuery = `SELECT * FROM system_dict_data WHERE id = @id;`;

  const pool = await sql.connect(config);
  const result = await pool.request().input("id", sql.Int, id).query(sqlQuery);

  return result.recordset[0];
};

// 根据ID查询记录
app.get("/recordDict/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const record = await getRecordByIdDict(id);
    console.log("Record:", record);
    res.json(record);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// 更新记录
const updateRecord = async (id, newData) => {
  const currentTime = new Date().toLocaleString();
  newData.update_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  newData.status = newData.status == "开启" ? 0 : 1;

  const sqlQuery = `UPDATE system_dict_type SET name = @name, type = @type, status = @status, update_time = @update_time,remark=@remark WHERE id = @id;`;

  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("name", sql.VarChar, newData.name)
    .input("type", sql.VarChar, newData.type)
    .input("status", sql.Int, newData.status)
    .input("remark", sql.VarChar, newData.remark)
    .input("update_time", sql.DateTime, newData.update_time)
    .input("id", sql.Int, id)
    .query(sqlQuery);

  return result.rowsAffected[0];
};

// 更新记录
app.put("/record/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    await updateRecord(id, newData);
    console.log("type Record updated");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// 更新记录
const updateDict = async (id, newData) => {
  const currentTime = new Date().toLocaleString();
  newData.update_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  newData.create_time = moment(
    newData.create_time,
    "YYYY/MM/DD HH:mm:ss"
  ).format("YYYY-MM-DD HH:mm:ss");
  newData.status = newData.status == "开启" ? 0 : 1;
  newData.deleted = 0;
  //dict_type,value, label, status, create_time,param_id,sort,css_class,remark
  const sqlQuery = `UPDATE system_dict_data SET dict_type = @dict_type,value = @value, label = @label, status = @status, remark = @remark,
  update_time = @update_time, deleted = @deleted,sort = @sort,css_class = @css_class WHERE id = @id;`;

  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("dict_type", sql.VarChar, newData.dict_type)
    .input("value", sql.VarChar, newData.value)
    .input("label", sql.VarChar, newData.label)
    .input("status", sql.Int, newData.status)
    .input("remark", sql.VarChar, newData.label)
    .input("update_time", sql.DateTime, newData.update_time)
    .input("deleted", sql.Int, newData.deleted)
    .input("sort", sql.Int, newData.sort)
    .input("css_class", sql.VarChar, newData.css_class)
    .input("id", sql.Int, id)
    .query(sqlQuery);

  return result.rowsAffected[0];
};

// 更新记录
app.put("/updict/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    await updateDict(id, newData);
    console.log("data Record updated");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// 函数：根据分页参数和查询条件获取字典数据记录
const queryPageRecords = async (
  pageN,
  pageS,
  name,
  type,
  status,
  create_time
) => {
  const offset = (pageN - 1) * pageS;
  const limit = pageS;

  let sqlQuery = `SELECT * FROM system_dict_type WHERE deleted = 0`;
  let countSql = `SELECT COUNT(*) AS totalCount FROM system_dict_type WHERE deleted = 0`;
  const params = [];
  const countParams = [];

  if (name) {
    console.log(name);
    sqlQuery += ` AND name LIKE '%${name}%'`;
    countSql += ` AND name LIKE '%${name}%'`;
  }

  if (type) {
    console.log(type);
    sqlQuery += ` AND type LIKE '%${type}%'`;
    countSql += ` AND type LIKE '%${type}%'`;
  }
  //添加status字段的条件，精确匹配
  if (status != undefined && status != null && status != "") {
    status = status === "开启" ? 0 : 1;
    sqlQuery += ` AND status = '${status}'`;
    countSql += ` AND status = '${status}'`;
  }

  if (create_time[0]) {
    console.log(create_time[0]);
    console.log("dao");
    console.log(create_time[1]);
    sqlQuery += ` AND '${create_time[0]}'<=create_time AND'${create_time[1]}'>=create_time`;
    countSql += ` AND '${create_time[0]}'<=create_time AND'${create_time[1]}'>=create_time`;
  }

  sqlQuery += ` ORDER BY id DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`;
  params.push(limit, offset);

  const pool = await sql.connect(config);

  // 执行数据库查询
  const result = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("type", sql.VarChar, type)
    .input("status", sql.Int, status)
    .input("startTime", sql.DateTime, create_time[0])
    .input("endTime", sql.DateTime, create_time[1])
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(sqlQuery);

  // 执行记录数量查询
  const countResult = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("type", sql.VarChar, type)
    .input("status", sql.Int, status)
    .input("startTime", sql.DateTime, create_time[0])
    .input("endTime", sql.DateTime, create_time[1])
    .query(countSql);

  const totalCount = countResult.recordset[0].totalCount;
  return { results: result.recordset, totalCount };
};

// 路由：查询字典数据记录
app.post("/searchData", async (req, res) => {
  const data = req.body;
  try {
    const { results, totalCount } = await queryPageRecords(
      data.pageNo,
      data.pageSize,
      data.name,
      data.type,
      data.status,
      data.create_time
    );
    res.json({ results, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// 函数：根据分页参数和查询条件获取字典数据记录
const queryPageDict = async (pageN, pageS, name, label, status, type) => {
  const offset = (pageN - 1) * pageS;
  const limit = pageS;
  console.log(type);
  let sqlQuery = `SELECT * FROM system_dict_data WHERE deleted = 0 AND dict_type ='${type}'`;
  let countSql = `SELECT COUNT(*) AS totalCount FROM system_dict_data WHERE deleted = 0 AND dict_type ='${type}'`;
  let parentQuery = `SELECT * FROM system_dict_type WHERE deleted = 0 AND type ='${type}' ORDER BY id DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`;
  let allParentQuery = `SELECT * FROM system_dict_type WHERE deleted = 0`;
  let treeQuery = `SELECT
  CASE
      WHEN id_level = 2 THEN 2
      ELSE 1
  END AS result
FROM system_dict_type WHERE deleted = 0`;
  const params = [];
  const countParams = [];

  if (name) {
    console.log(name);
    sqlQuery += ` AND name LIKE '%${name}%'`;
    countSql += ` AND name LIKE '%${name}%'`;
  }

  if (label) {
    sqlQuery += ` AND label LIKE '%${label}%'`;
    countSql += ` AND label LIKE '%${label}%'`;
  }

  if (status != undefined && status != null && status != "") {
    status = status === "开启" ? 0 : 1;
    sqlQuery += ` AND status = '${status}'`;
    countSql += ` AND status = '${status}'`;
  }

  sqlQuery += ` ORDER BY id DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`;
  params.push(limit, offset);

  const pool = await sql.connect(config);

  // 执行数据库查询
  const result = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("label", sql.VarChar, label)
    .input("status", sql.Int, status)
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(sqlQuery);
  const parentResult = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("label", sql.VarChar, label)
    .input("status", sql.Int, status)
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(parentQuery);
  const allParentResult = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("label", sql.VarChar, label)
    .input("status", sql.Int, status)
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(allParentQuery);
  // 执行记录数量查询
  const countResult = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("label", sql.VarChar, label)
    .input("status", sql.Int, status)
    .query(countSql);

  const totalCount = countResult.recordset[0].totalCount;
  return {
    results: result.recordset,
    totalCount,
    parentResult,
    allParentResult,
  };
};

// 路由：查询字典数据记录
app.post("/searchDataDict", async (req, res) => {
  const data = req.body;
  try {
    const { results, totalCount, parentResult, allParentResult } =
      await queryPageDict(
        data.pageNo,
        data.pageSize,
        data.name,
        data.label,
        data.status,
        data.type
      );
    res.json({ results, totalCount, parentResult, allParentResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// 启动服务器
app.listen(3000, () => {
  console.log("服务器已启动，监听端口 3000");
});
