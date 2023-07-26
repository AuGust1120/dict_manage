const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); //引入cors板块解决跨域
const app = express();
app.use(express.json()); // 解析请求体中的JSON数据
app.use(cors()); //cors板块解决跨域
const moment = require("moment");
// 创建数据库连接
const connection = mysql.createConnection({
  host: "localhost", // 数据库主机名
  user: "root", // 用户名
  password: "1234", // 密码
  port: 3306,
  database: "hele_vue2", // 数据库名
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error("数据库连接失败：", err);
    return;
  }
  console.log("已成功连接到数据库");
});

//添加数据
app.post("/createDict", (req, res) => {
  const data = req.body; // 获取请求体中的数据对象
  const currentTime = new Date().toLocaleString();
  data.update_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  // 处理数据
  data.status = data.status == "开启" ? 0 : 1;

  // 执行数据库插入操作
  connection.query(
    "INSERT INTO system_dict_type SET ?",
    data,
    (error, results) => {
      if (error) {
        console.error("插入数据失败", error);
        res.status(500).send("插入数据失败");
      } else {
        console.log("数据插入成功");
        res.send("数据插入成功");
      }
    }
  );
});


//添加数据
app.post("/createDictData", (req, res) => {
  const data = req.body; // 获取请求体中的数据对象
  const currentTime = new Date().toLocaleString();
  data.update_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  // 处理数据
  data.status = data.status == "开启" ? 0 : 1;
  // 执行数据库插入操作
  connection.query(
    "INSERT INTO system_dict_data SET ?",
    data,
    (error, results) => {
      if (error) {
        console.error("插入数据失败", error);
        res.status(500).send("插入数据失败");
      } else {
        console.log("数据插入成功");
        res.send("数据插入成功");
      }
    }
  );
});






// 通用的删除记录函数
const deleteRecord = (tableName, id) => {
  return new Promise((resolve, reject) => {
    const currentTime = new Date().toLocaleString();
    const deletedTime = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    const sql = `UPDATE ${tableName} SET deleted = 1, deleted_time = ? WHERE id = ?;`;
    const params = [deletedTime, id];

    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error('Error deleting record:', error);
        reject(error);
      } else {
        resolve(results.affectedRows);
      }
    });
  });
};

// 删除记录的路由处理程序
app.delete('/record/:tableName/:id', async (req, res) => {
  const tableName = req.params.tableName; // 获取URL中的表名参数
  const id = req.params.id; // 获取URL中的ID参数
  try {
    const deletedRows = await deleteRecord(tableName, id);
    console.log('Deleted Rows:', deletedRows);
    res.json(deletedRows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// 根据ID查询记录
const getRecordById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM system_dict_type WHERE id = ?;`;
    const params = [id];

    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error('Error getting record:', error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
};
// 根据ID查询记录
app.get('/record/:id', async (req, res) => {
  const id = req.params.id; // 获取URL中的ID参数
  try {
    const record = await getRecordById(id);
    console.log('Record:', record);
    res.json(record);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// 根据ID查询记录
const getRecordByIdDict = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM system_dict_data WHERE id = ?;`;
    const params = [id];

    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error('Error getting record:', error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// 根据ID查询记录
app.get('/recordDict/:id', async (req, res) => {
  const id = req.params.id; // 获取URL中的ID参数
  try {
    const record = await getRecordByIdDict(id);
    console.log('Record:', record);
    res.json(record);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// 更新记录
const updateRecord = (id, newData) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE system_dict_type SET ? WHERE id = ?;`;
    const currentTime = new Date().toLocaleString();
    newData.update_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    newData.status = newData.status == "开启" ? 0 : 1;
    const params=[newData,newData.id]
    connection.query(sql, params, (error, result) => {
      if (error) {
        console.error('Error updating record:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
// 更新记录
app.put('/record/:id', async (req, res) => {
  const id = req.params.id; // 获取URL中的ID参数
  const newData = req.body; // 获取请求体中的新数据

  try {
    await updateRecord(id, newData);
    console.log('Record updated');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// 更新记录
const updateDict = (id, newData) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE system_dict_data SET ? WHERE id = ?;`;
    const currentTime = new Date().toLocaleString();
    newData.update_time = moment(currentTime, "YYYY/MM/DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    newData.create_time = moment(newData.create_time, "YYYY/MM/DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    newData.status = newData.status == "开启" ? 0 : 1;
    newData.deleted=0
    const params=[newData,newData.id]
    connection.query(sql, params, (error, result) => {
      if (error) {
        console.error('Error updating record:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
// 更新记录
app.put('/updataDict/:id', async (req, res) => {
  const id = req.params.id; // 获取URL中的ID参数
  const newData = req.body; // 获取请求体中的新数据

  try {
    await updateDict(id, newData);
    console.log('Record updated');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



// 函数：根据分页参数和查询条件获取字典数据记录
const queryPageRecords = (pageN, pageS, name, type,status, create_time) => {
  return new Promise((resolve, reject) => {
    const offset = (pageN - 1) * pageS;
    const limit = pageS;

    let sql = `SELECT * FROM system_dict_type WHERE deleted = 0`; // 初始化SQL语句，只包含deleted = 0的条件
    let countSql = `SELECT COUNT(*) AS totalCount FROM system_dict_type WHERE deleted = 0`; // 用于统计记录数量的SQL语句
    const params = [];
    const countParams = [];

    // 添加name字段的条件，使用LIKE进行模糊匹配
    if (name) {
      sql += ` AND name LIKE ?`;
      countSql += ` AND name LIKE ?`;
      params.push(`%${name}%`);
      countParams.push(`%${name}%`);
    }

    // 添加type字段的条件，精确匹配
    if (type) {
      sql += ` AND type = ?`;
      countSql += ` AND type = ?`;
      params.push(type);
      countParams.push(type);
    }

    console.log(status)
    
    //添加status字段的条件，精确匹配
    if (status!=undefined&&status!=null&&status!='') {
      status=status==="开启" ? 0 : 1
      console.log("SX")
      sql += ` AND status = ?`;
      countSql += ` AND status = ?`;
      params.push(status);
      countParams.push(status);
    }

    // 添加create_time字段的条件，判断是否在时间范围内
    if (create_time[0]) {
      sql += ` AND create_time BETWEEN '${create_time[0]}' AND '${create_time[1]}'`;
      countSql += ` AND create_time BETWEEN '${create_time[0]}' AND '${create_time[1]}'`;   
    }

    // 根据id字段倒序排序，并添加LIMIT和OFFSET
    sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // 执行数据库查询
    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error('Error retrieving records:', error);
        reject(error);
      } else {
        // 执行记录数量查询
        connection.query(countSql, countParams, (countError, countResults) => {
          if (countError) {
            console.error('Error retrieving record count:', countError);
            reject(countError);
          } else {
            const totalCount = countResults[0].totalCount;
            resolve({ results, totalCount });
          }
        });
      }
    });
  });
};

// 路由：查询字典数据记录
app.post("/searchData", async (req, res) => {
  const data = req.body; // 获取请求体中的数据对象
  try {
    const { results, totalCount } = await queryPageRecords(data.pageNo, data.pageSize, data.name, data.type,data.status, data.create_time);
    res.json({ results, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


// 函数：根据分页参数和查询条件获取字典数据记录
const queryPageDict = (pageN, pageS, name, label,status) => {
  return new Promise((resolve, reject) => {
    const offset = (pageN - 1) * pageS;
    const limit = pageS;

    let sql = `SELECT * FROM system_dict_data WHERE deleted = 0`; // 初始化SQL语句，只包含deleted = 0的条件
    let countSql = `SELECT COUNT(*) AS totalCount FROM system_dict_data WHERE deleted = 0`; // 用于统计记录数量的SQL语句
    const params = [];
    const countParams = [];

    // 添加name字段的条件，使用LIKE进行模糊匹配
    if (name) {
      sql += ` AND name LIKE ?`;
      countSql += ` AND name LIKE ?`;
      params.push(`%${name}%`);
      countParams.push(`%${name}%`);
    }

    // 添加type字段的条件，精确匹配
    if (label) {
      sql += ` AND label LIKE ?`;
      countSql += ` AND label LIKE ?`;
      params.push(`%${label}%`);
      countParams.push(`%${label}%`);
    }

    //添加status字段的条件，精确匹配
    if (status!=undefined&&status!=null&&status!='') {
      status=status==="开启" ? 0 : 1
      console.log("SX")
      sql += ` AND status = ?`;
      countSql += ` AND status = ?`;
      params.push(status);
      countParams.push(status);
    }


    // 根据id字段倒序排序，并添加LIMIT和OFFSET
    sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // 执行数据库查询
    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error('Error retrieving records:', error);
        reject(error);
      } else {
        // 执行记录数量查询
        connection.query(countSql, countParams, (countError, countResults) => {
          if (countError) {
            console.error('Error retrieving record count:', countError);
            reject(countError);
          } else {
            const totalCount = countResults[0].totalCount;
            resolve({ results, totalCount });
          }
        });
      }
    });
  });
};

// 路由：查询字典数据记录
app.post("/searchDataDict", async (req, res) => {
  const data = req.body; // 获取请求体中的数据对象
  try {
    const { results, totalCount } = await queryPageDict(data.pageNo, data.pageSize, data.name, data.label,data.status);
    res.json({ results, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// 启动服务器
app.listen(3000, () => {
  console.log("服务器已启动，监听端口 3000");
});
