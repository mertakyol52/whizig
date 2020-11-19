'use strict'
const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const inquirer = require('inquirer');
var moment = require("moment");
var colors = require('colors');
var userHome = require('user-home');

//DETECT IP *START!
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
//DETECT IP *END!

const questionTools = [{
    type: "list",
    name: "Tools",
    message: "Araç Seç:\n",
    choices: [
        "❆ Instagram Gönderi Sil",
        "\n"
    ]
}]
const main = async () => {
    try {
        var toolChoise = await inquirer.prompt(questionTools);
        toolChoise = toolChoise.Tools;
        switch (toolChoise) {


            case "❆ Instagram Gönderi Sil":
                const dellallphoto = require('./tools/dellallphoto.js');
                await dellallphoto();
                break;

            default:
                console.log("\n ERROR:".red.bold, "Aw, Snap! Something went wrong while displaying this tool!\n".green.bold, "Bulunamadı! Lütden Dosyaları Kontrol Edin!".yellow.bold);
        }
    } catch (e) {}
}

console.log(chalk `{bold.green
  Ξ TITLE  : Whiz Instagram Araci
  Ξ CODEBY : Whiz
  = INSTAGRAM : https://www.instagram.com/whiz.x2
  Ξ FILES  : https://github.com/officialputuid/toolsig
  }`);
console.log(chalk `{bold.red   •••••••••••••••••••••••••••••••••••••••••}`);
console.log("  Ξ DOSYA YOLU  : ".bold.red + userHome);
console.log("  Ξ IP  : ".bold.red + addresses);
console.log(chalk `{bold.red   •••••••••••••••••••••••••••••••••••••••••}`);
console.log('\n')
main();
//by 1dcea8095a18ac73b764c19e40644b5