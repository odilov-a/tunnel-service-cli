import WebSocket from "ws";
import axios from "axios";
import yargs from "yargs";
import chalk from "chalk";
import figlet from "figlet";
import ora from "ora";
import clear from "clear";
import { hideBin } from "yargs/helpers";

clear();
console.log(
  chalk.cyan(figlet.textSync("MyTunnel", { horizontalLayout: "full" }))
);
const spinner = ora("Connecting to tunnel server...").start();

const argv = yargs(hideBin(process.argv))
  .option("subdomain", {
    alias: "s",
    describe: "Unique subdomain",
    demandOption: true,
    type: "string",
  })
  .option("port", {
    alias: "p",
    describe: "Local port to forward to",
    demandOption: true,
    type: "number",
  })
  .option("token", {
    alias: "t",
    describe: "JWT or API token for authentication",
    demandOption: true,
    type: "string",
  })
  .parse();

const { subdomain, port, token } = argv;

const ws = new WebSocket("ws://localhost:7000");

ws.on("open", () => {
  const publicUrl = `http://localhost:7000/api/tunnels/${subdomain}/`;
  spinner.succeed(chalk.green("Connected to tunnel server"));
  console.log(chalk.yellow(`[🌐] Your public URL:`), chalk.cyan(publicUrl));
  ws.send(
    JSON.stringify({
      type: "register",
      subdomain,
      token,
    })
  );
});

ws.on("message", async (msg) => {
  const data = JSON.parse(msg);

  if (data.type === "error") {
    console.log(chalk.red(`[✗] Not Auth: ${data.message}`));
    process.exit(1);
  }

  if (data.type === "request") {
    const { method, url, headers, body } = data.payload;

    const tunnelPrefix = `/api/tunnels/${subdomain}`;
    let cleanPath = url.startsWith(tunnelPrefix)
      ? url.slice(tunnelPrefix.length)
      : "/";
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    const fullUrl = `http://localhost:${port}${cleanPath}`;

    console.log(chalk.magenta(`[→] Forwarding ${method} ${url} ⟶ ${fullUrl}`));

    try {
      const response = await axios({
        method,
        url: fullUrl,
        headers,
        data: body,
      });

      ws.send(
        JSON.stringify({
          type: "response",
          requestId: data.requestId,
          payload: {
            status: response.status,
            data: response.data,
          },
        })
      );
    } catch (err) {
      ws.send(
        JSON.stringify({
          type: "response",
          requestId: data.requestId,
          payload: {
            status: 500,
            data: {
              error: "Local server error",
              details: err.message,
            },
          },
        })
      );

      console.log(
        chalk.red(`[✗] Error forwarding to ${fullUrl}: ${err.message}`)
      );
    }
  }
});
