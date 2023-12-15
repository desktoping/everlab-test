import cors from "cors";
import express from "express";
import upload from "express-fileupload";
import { JSONPreset } from "lowdb/node";
import { Data } from "./db-types";
import { getResults } from "./get-result";

const app = express();
app.use(cors());
app.use(upload());

app.post("/upload", async (req, res) => {
  // Input name of input element used to submit the form
  const inputKey = "file";

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const file = req.files[inputKey];

  if (Array.isArray(file)) {
    return res.status(400).send("Only supports single file upload");
  }

  const hl7message = file.data.toString();
  const db = await JSONPreset<Data>("db.json", {} as Data);

  res.send(getResults(hl7message, db));
});

app.listen(80, () => console.log("Server running"));
