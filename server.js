import jsonServer from "json-server";
import fs from "fs";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

const DB_FILE = "db.json";

server.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    res.on("finish", () => {
      fs.writeFileSync(DB_FILE, JSON.stringify(router.db.getState(), null, 2));
    });
  }
  next();
});

server.use(router);

server.listen(process.env.PORT || 3001);
