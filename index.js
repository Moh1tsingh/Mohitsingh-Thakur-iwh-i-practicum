require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_ID = "2-171825780";

app.get("/", async (req, res) => {
  const valorantAgents = `https://api.hubspot.com/crm/v3/objects/${OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(valorantAgents, {
      headers,
      params: { properties: "name,agent_type,ultimate" },
    });
    const agents = resp.data.results || [];
    res.render("homepage", { title: "Valorant Agents", agents });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching agents");
  }
});

app.get("/update-cobj", async (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  const { name, agent_type, ultimate } = req.body;
  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`,
      {
        properties: { name, agent_type, ultimate },
      },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating agent");
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
