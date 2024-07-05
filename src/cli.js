#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import inquirer from "inquirer";
import { PathPrompt } from "inquirer-path";
import chalk from "chalk";

import { catchInputErrorsAndQuit } from "./InputError.js";
import * as lib from "./index.js";
import { version } from "./packageJson.js";

inquirer.prompt.registerPrompt("path", PathPrompt);

const defaultOutputPath = "./my_card_proxies.pdf";
const PAGE_SIZE_A4 = "210x297";

const findInputError = (input) => {
  const invalidPath = input.find((item) => !fs.existsSync(item.path));
  if (invalidPath) {
    return `"${invalidPath} does not exist"`;
  }
};

const validateImageInput = (input) => {
  const inputError = findInputError(input);
  if (inputError) {
    return Promise.reject(new Error(inputError));
  }
  return input;
};

const promptImageInput = (input = []) =>
  inquirer
    .prompt([
      {
        name: "path",
        type: "path",
        message: "Please input the path of a card you would like to print:",
      },
      {
        name: "copies",
        message: "How many copies would you like to print?",
        type: "number",
        default: 4,
      },
      {
        type: "confirm",
        name: "again",
        message: "Would you like to add another card?",
      },
    ])
    .then(({ path, copies, again }) => {
      const updatedInput = [...input, { path, copies }];
      if (!again) {
        return updatedInput;
      }
      return promptImageInput(updatedInput);
    });

const promptOutputPathInput = () =>
  inquirer
    .prompt([
      {
        name: "outputPath",
        default: defaultOutputPath,
        message:
          "Please input the path where you'd like to save your PDF file:",
      },
    ])
    .then(({ outputPath }) => outputPath);

console.log(chalk.bold(`Proxy Card Printer v${version}`));

promptImageInput()
  .then(validateImageInput)
  .then((images) =>
    promptOutputPathInput().then((outputPath) =>
      lib.print({ images, pageSize: PAGE_SIZE_A4, outputPath })
    ),
  )
  .catch(catchInputErrorsAndQuit)
  .finally(lib.close)
  .then(({ outputPath }) =>
    console.log(
      "\nYour proxy cards have been printed at:",
      "file://" + path.resolve(outputPath),
    ),
  );
