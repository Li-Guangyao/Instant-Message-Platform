import User from "../models/User";

async function insert() {
  try {
    const liguangyao = await User.create({
      username: "liguangyao",
      email: "1720344233@qq.com",
      password: "123456",
    });
    console.log(liguangyao.toJSON());
    console.log("数据插入成功!");
  } catch (err) {
    console.log("fail", err);
  }
}

async function search() {
  const { count, rows } = await User.findAndCountAll({
    where: {
      username: "liguangyao",
      email: "1720344233@qq.com",
      password: "123456",
    },
  });

  return { count, rows };
}

// insert();

search().then((res) => {
  console.log("res", res.rows);
});
