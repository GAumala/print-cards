import chalk from "chalk";

export default class InputError extends Error {}

export const catchInputErrorsAndQuit = (error) => {
  if (error instanceof InputError) {
    console.error(chalk.bold.red("Error:"), chalk.red(error.message));
    process.exit(1);
  } else {
    throw error;
  }
};
