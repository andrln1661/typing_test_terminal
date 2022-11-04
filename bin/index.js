#!/usr/bin/env node

console.clear();

import chalk from "chalk";
import boxen from "boxen";
import randomWords from "random-words";
import readline from "readline";

const greeting = `
${chalk.cyan("Welcome to the club buddy")}

${chalk.green("->")} To start your practice press enter

${chalk.green("->")} Test will start right after your first key down

${chalk.green(
  "->"
)} To finish the test successfully all you should write all words without misspells

${chalk.green(
  "->"
)} If you wanna leave before the end of the test just use \"escape\" or Ctrl + C (Cmd + C)

${chalk.red("<==  Good Luck  ==>")}
`;
const boxOptions = {
  borderColor: "yellow",
  borderStyle: "double",
  align: "center",
  margin: 1,
  padding: 1,
  title: "Typing Test",
  titleAlignment: "center",
};

const greetingBox = boxen(greeting, boxOptions);
console.log(greetingBox);

let seconds = 0;
let textSample = randomWords(30);
let textOut = textSample.join(" ").split("");
let textLength = textOut.length;
let started = false;
let pointer = 0;
let typingBox = boxen(chalk.gray(textSample.join(" ")), boxOptions);
let misspells = 0;

const incrementSeconds = () => seconds++;
const stopwatch = setInterval(incrementSeconds, 1000);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name == "c") process.exit();
  if (key.name == "escape") process.exit();
  if (key.name == "return") {
    started = true;
  }
  if (started) {
    console.clear();

    if (key.name == "backspace") {
      textOut[pointer - 1] = textOut[pointer - 1].replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      );
      typingBox = boxen(chalk.grey(textOut.join("")), boxOptions);
      pointer--;
    }
    if (str === textOut[pointer]) {
      textOut[pointer] = chalk.white(textOut[pointer]);
      typingBox = boxen(chalk.grey(textOut.join("")), boxOptions);
      pointer++;
    } else if (
      key.name !== "return" &&
      key.name !== "backspace" &&
      str !== textOut[pointer]
    ) {
      textOut[pointer] = chalk.red(textOut[pointer]);
      typingBox = boxen(chalk.grey(textOut.join("")), boxOptions);
      pointer++;
      misspells++;
    }
    if (pointer >= textLength) {
      let result = `
${chalk.cyan("Not bad. But you can do more. Common let's go!")}
${Math.round((textLength / seconds) * 60)} CPM || ${Math.round(
        (30 / seconds) * 60
      )} WPM || ${seconds} seconds
${chalk.red(`${misspells} misspels`)}
    `;
      let resultBox = boxen(result, boxOptions);
      console.log(resultBox);
      process.exit();
    } else {
      console.log(typingBox);
    }
  }
});
