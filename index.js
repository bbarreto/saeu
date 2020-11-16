const path = require("path");
const url = require("url");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const express = require("express");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

app.use("/", express.static(path.join(__dirname, "static")));

app.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Informe o RA" });
  }

  if (!password) {
    return res.status(400).send({ error: "Informe a senha" });
  }

  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--no-sandbox`, `--disable-setuid-sandbox`],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://cursos.univesp.br");
    await page.waitForSelector("#username");

    await page.evaluate(
      (username, password) => {
        document.querySelector("#username").value = username;
        document.querySelector(".step-footer button[type=button]").click();
        document.querySelector("#password").value = password;
        document.querySelector("button[type=submit]").click();
      },
      username,
      password
    );

    await page.waitForSelector(".ic-app-header__logomark-container");
    await page.goto("https://cursos.univesp.br/profile/settings");

    await page.waitForSelector("#access_tokens");

    page.on("dialog", async (dialog) => {
      if (
        dialog.message() ===
        "Tem certeza de que deseja regenerar este token?  Tudo que estiver usando este token deverá ser atualizado."
      ) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });

    await page.evaluate(() => {
      const items = document.querySelectorAll("#access_tokens td.purpose");
      let hasAlready = false;
      items.forEach((item, index) => {
        if (item.textContent === "Aplicativo SAEU") {
          hasAlready = true;
          document
            .querySelectorAll("#access_tokens a.show_token_link")
            [index].click();
          setTimeout(() => {
            document
              .querySelector("#token_details_dialog button.regenerate_token")
              .click();
          }, 500);
        }
      });

      if (!hasAlready) {
        document.querySelector("a.add_access_token_link").click();
        document.querySelector(
          "#access_token_form #access_token_purpose"
        ).value = "Aplicativo SAEU";
        document
          .querySelector("#access_token_form button.submit_button")
          .click();
      }
    });

    await page.waitForSelector("#token_details_dialog .visible_token");

    let newToken = false;
    while (!newToken || newToken.length <= 10) {
      newToken = (
        await page.evaluate(
          () =>
            document.querySelector("#token_details_dialog .visible_token")
              .textContent
        )
      ).trim();
    }

    await browser.close();

    return res.send({ newToken });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "Erro ao autenticar.", debug: err.description });
  } finally {
    await browser.close();
  }
});

app.all("/api/v1/*", async (req, res) => {
  const path = req.params[0];
  const query = req.query;

  let params = "";
  if (query) {
    params = new url.URLSearchParams(query);
  }

  // Detectar se a página já existe em cache
  // Estamos usando o banco da dados DynamoDb da AWS
  const AWS = require("aws-sdk");
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  const queryParams = {
    ExpressionAttributeValues: {
      ":at": { S: query.access_token },
      ":p": { S: path },
      ":qs": { S: query },
    },
    KeyConditionExpression: "AccessToken = :at and RequestPath > :p",
    ProjectionExpression: "CachedBody, UpdatedAt",
    FilterExpression: "contains (QueryString, :qs)",
    TableName: "UNIVESP_CACHE",
  };

  const queryResult = ddb.query(queryParams).promise();
  if (queryResult?.Items?.length > 0) {
    return res.send(queryResult.Items[0].CachedBody);
  }

  const requestObj = {
    method: req.method,
    url: `https://cursos.univesp.br/api/v1/${path}?${params.toString()}`,
  };

  if (req.method.toLocaleLowerCase() === "post") {
    requestObj.data = req.body;
  }

  axios(requestObj)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.status(err.response.status).send(err.response.data);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
