//api 사용해서 createdownload 보내고 람다 post get어쩌고
const {
    Client,
    MessageEmbed
} = require('discord.js');
const client = new Client(); //Privileged Gateway Intents all on
var AWS = require('aws-sdk'); //aws sdk
var s3 = new AWS.S3();
const fs = require('fs');
var path = require('path');
require('dotenv').config();
const config = require('./config.json');
let defaultjsondata = `{ "KRW": "0", "first":true,"redeemed":false,"haveconfirm": { "hwid": false },"UserName":null,"HWID":null,"MacAdress":null,"status":"Not-Registered","UID":null,`;//"DiscordID"message.author.id
let invisible = "឵឵";
const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
//var http = require('http');
//const express = require('express');
//var app = express();
/*
let port = 1212;
var app = http.createServer(function(request, response, error) {
    if (error) return console.log(`[ERROR] ${error}`);
    var url = request.url;
    if (request.url.startsWith('/')) {
        url = `/web_server/${request.url.split('/').slice(1, 10000000000000) .replace(",", "")}`;
    }
    if (request.url == '/favicon.ico') {
        return response.writeHead(404);
    }
    const ip123123 = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const ip = ip123123.replace("::ffff:", "IP: ");

    response.writeHead(200);
    console.log(`${ip} | ${url}`);
    response.end(fs.readFileSync(__dirname + url));

});
*/
//app.listen(port).on("listening", () => {
//    console.log(`Auth Server is Running port: ${port}`)
//});

const { Builder, By, Key, until, EC } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const { ProcessCredentials } = require('aws-sdk');
//return console.log(!isNaN('123'))
async function login(id, password) {
    let driver = await new Builder()
    .forBrowser('chrome')
    .build();
    if(id == "" || password == "") {
        console.log("컬쳐랜드 아이디또는 비밀번호를 입력 해주세요.");
        process.exit(0);
    };
    await driver.get('https://m.cultureland.co.kr/mmb/loginMain.do?agent_url=/index.do');
    (await driver.findElement(By.id("txtUserId"))).sendKeys(id);
    (await driver.findElement(By.id("passwd"))).click();
    let rst = [];
    for (var i = 0; i < password.length; i++) {
        let x = password.charAt(i)
        rst = rst.concat(x);
    };
    try {
        for (var i = 0; i < password.length; i++) {
            if(!isNaN(rst[i])) {
                (await driver.findElement(By.xpath('//img[@alt=\"' + rst[i] + '\"]'))).click(); 
            } else if (isUpperCase(rst[i])) {
                
            }
        }
    } catch (e) {
        console.error(`컬쳐랜드 로그인중 오류가 발생하였습니다\n[ERROR] ${e}`);
        driver.quit();
        process.exit(1);
    };
    console.log('running');
    await sleep(10000);
    driver.quit();
    console.log("test success");

};

let starthelp = "```!start - Start using this bot```",
confirmhelp = "```!confirm <yes/no> - Assists in HWID management```",
helphelp = "```!help - No description```",
downloadhelp = "```!download - Sends you the latest version of CustoomNPC```",
redeemhelp = "```xml\n!redeem <order-id> - Redeems the purchased client via an order ID```",
hwidhelp = "```xml\n!hwid <hwid> - HWID management```",
invitehelp = "```!invite - Invites you to the customer server```",
statushelp = "```!status - Your user info```",
usernamehelp = "```xml\n!username <new-username> - Changes your username```";
//===========================================Owner===========================================
let managerhelp = {
    "main": "```xml\n!manager help - User, License manager ```",
    "createlicense": "```xml\n!manager createlicense - Create license code ```",
    "createcustomlicense": "```xml\n!manager createcustomlicense <license-code> - Create license code```",
    "removelicense": "```xml\n!manager removelicense <license-code> - Remove Unused license code ```",
    "setbeta": "```xml\n!manager set beta <user-id> <true/false> - Add/Remove Beta for user```",
    "codelist": "```!manager codelist - Display unused license codes```",
    "clearchat": "```!clearchat - Clear chat using invisible character```",
    "removeuser": "```!manager removeuser <user-id> - Remove user from data"
};

client.login(process.env.TOKEN);

let useDB = config.usedatabase;

client.on("ready", () => {
    console.log(`${client.user.tag} ready!`);
    if(useDB == undefined || useDB == null) console.log(`!usedb true/false`);
    login(process.env.culturelandid, process.env.culturelandpass);
});

client.on("guildMemberAdd", (member) => {
    if(member.guild.id == config.customerdiscord.id) {
        if(useDB) {
            
        } else {
            fs.readdir("./users/", (error, files) => {
                if (error) return console.log(error);
                files.forEach(x => {
                    let a = JSON.parse(fs.readFileSync(`./users/${x}`));
                    if(a.DiscordID == member.id && a.redeemed == true) {
                        client.guilds.cache.get(config.customerdiscord.id).members.cache.find(member123 => member123.id == member.id).roles.add(client.guilds.cache.get(config.customerdiscord.id).roles.cache.find(role123 => role123.id == config.customerdiscord.customerroldid));
                    }
                })
                //let files2 = files123.replace(".json", "");
            });
        }
    } else {
        //some events
    };
});
let hwid = "";


client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.content.includes("./" || "../" || "/" || "\\" || "..\\" || ".\\")) return;
    if (useDB == undefined || useDB == null) {
        if(!message.channel.type == "dm") return;
        if(!config.owners.includes(message.author.id)) return;
        if(message.content.startsWith("!usedb")) {
            let asd = message.content.split(" ")[1];
            if(asd == "true") { asd = true } else if (asd == "false") { asd = false } else { return message.author.send("!usedb true/false") };
            useDB = asd;
            config.usedatabase = asd;
            fs.writeFileSync('./config.json', JSON.stringify(config));
            console.log(`SETTINGS: UseDatabase: ${useDB}`);
            message.author.send(`SETTINGS: UseDatabase: ${useDB}`);
        } else return message.author.send("!usedb true/false");
    } else if(message.content.startsWith("!usedb")) {
        if(!config.owners.includes(message.author.id)) return;

        let asd = message.content.split(" ")[1];
        if(asd == "true") { asd = true } else if (asd == "false") { asd = false } else { return message.reply("!usedb true/false") };
        useDB = asd;
        config.usedatabase = asd;
        fs.writeFileSync('./config.json', JSON.stringify(config));
        console.log(`SETTINGS: UseDatabase: ${useDB}`);
        message.author.send(`SETTINGS: UseDatabase: ${useDB}`);
    };

    if(message.content.startsWith("!자충")) {
        let code = message.content.split("자충 ")[1];
        if(code == undefined || code == null || code == "") {

        }
    };

    if(useDB) {
        if(message.channel.type === "dm") return;
        console.log("Connecting to Database...").then(() => {

        });
    } else {
        fs.exists(`./users/${message.author.id}.json`, (exists123123123123123) => {
            if (!exists123123123123123) {
                console.log(`New User Detected! Creating userfile... || INFO | UserID: ${message.author.id} | NAME: ${message.author.tag}`);
                fs.writeFile(`./users/${message.author.id}.json`, defaultjsondata + `"DiscordID": ${message.author.id}}`, (error) => {
                    console.log(`[ERROR] ${error}`);
                });
            };
    
            if (message.content.startsWith("!")) {
                let cmd = message.content.split("!")[1];
                console.log(`USER: ${message.author.tag}(${message.author.id})\nCMD: ${cmd}\nRETURN: ?\n`);
                if (cmd == "" || cmd == undefined || cmd == null) return message.author.send("Unknown command. Type `!help` for help");
        
                if (cmd == "test") {
                    return// client.guilds.cache.get(config.customerdiscord.id).channels.cache.get("839291158257336390").send("test success!");
                    const server = message.guild;
                    if (server.members.cache.find(message.author.id)) { //Returns true if present in the guild
                        message.reply("너 커스터머 서버에 있음 ㅋ")
                    } else {
                        message.reply("너 없음 ㅋ")
                    }
                } else if (cmd == "clearchat") {
                    return message.author.send(`${invisible}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n${invisible}`)
                };
            };
        
            if (message.channel.type != "dm") return;    
        
            if (message.content.startsWith("!")) {
                let cmd = message.content.split("!").slice(1, 2).toString();
                if (cmd == "" || cmd == undefined || cmd == null) {
                    return message.author.send("Unknown command. Type `!help` for help");
                } else {
                    fs.readFile(`./users/${message.author.id}.json`, 'utf8', async (error, data) => {
                        if (error) return console.log(`[ERROR] ${error}`);
                        let aausrjson12312312312 = JSON.parse(data);
                        let userredeemed = aausrjson12312312312.redeemed;
    
                        //if (!userredeemed) {
                        //    if (!cmd.includes("help" && "redeem" && "confirm" && "codelist" && "removecode" && "download" && "username" && "invite" && "hwid" && "status")) { return message.author.send("Unknown command. Type `!help` for help"); } else { return message.author.send("You are not authorized to use this bot. Contact the admins"); };
                        //};
                        if (cmd == "help") {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
        
                            message.author.send(`Command help: \n${starthelp}${confirmhelp}${helphelp}${downloadhelp}${redeemhelp}${hwidhelp}${invitehelp}${statushelp}${usernamehelp}`);
                            if (config.owners.includes(message.author.id)) {
                                message.author.send(`Command help(MOD): \n${managerhelp.main}${managerhelp.clearchat}${managerhelp.createcustomlicense}${managerhelp.createlicense}${managerhelp.removelicense}${managerhelp.setbeta}${managerhelp.codelist}`);
                                return
                            };
                        } else if (cmd == "start") {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
                            let userjson = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));
                            if(userjson.first) {
                                message.author.send("Seems like you're not set up. You need to download this file to get your Hardware ID. Then do \`!hwid <hardware id>\`\nHWID Grabber: https://assets.novoline.wtf/hwid-grabber\nPlease report this file as safe if you are using MS Edge :)");
                            } else {
                                message.author.send("You are already set up. Run `!download` to get the client")
                            }
                            
                        } else if (cmd.startsWith("confirm")) {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
                            let userjson = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));
                            if(userjson.haveconfirm.hwid) {
                                let answer = cmd.split("confirm ")[1];
                                if(answer == "yes") {
                                    if(!userjson.first) {
                                        userjson.HWID = hwid;
                                        userjson.haveconfirm.hwid = false;
                                        fs.writeFileSync(`./users/${message.author.id}.json`, JSON.stringify(userjson));
                                        message.author.send("HWID updated successfully.");
                                    } else {
                                        userjson.HWID = hwid;
                                        userjson.haveconfirm.hwid = false;
                                        fs.writeFileSync(`./users/${message.author.id}.json`, JSON.stringify(userjson));
                                        message.author.send("HWID updated successfully. Run `!username <username>` to finish the setup");
                                    }
                                } else {
                                    message.author.send("HWID update cancelled.");
                                    userjson.haveconfirm.hwid = false;
                                    fs.writeFileSync(`./users/${message.author.id}.json`, JSON.stringify(userjson));
                                }
                            } else if(!userjson.haveconfirm.hwid || !userjson.haveconfirm.etc) {
                                message.author.send("You don't have any active confirmations");
                            }
                        } else if (cmd == "status") {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
                            let usrjson = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));
                            if(usrjson.first) {
                                return message.author.send("Please complete the setup.");
                            } else {
                                message.author.send(`User information: \`\`\`xml\nUID: ${usrjson.UID}\nUsername: ${usrjson.UserName}\nTime until next HWID reset: !hwid <new-hwid>\`\`\``);
                            }
                        } else if (cmd.startsWith("redeem")) {
                            let usrjson = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));

                            if (usrjson.redeemed) {
                                return message.author.send("You are already a CustoomNPC user. What are you trying to achieve?");
                            };
                            let code123 = message.content.split(" ")[1];
                            //console.log(code123);
                            if (code123 == null || code123 == undefined || code123 == "") {
                                return message.author.send(`Incorrect usage.\nUsage: ${redeemhelp}`);
                            };
                            let code = code123 + ".custoomnpc"
                            fs.exists(`./used/${code}`, (exists) => {
                                fs.exists(`./licenses/${code}`, async (exists2) => {
                                    if (exists) {
                                        if (exists2) {
                                            let invite123 = remove_http_or_https(await createcustomerinvite());
                                            fs.rename(`./licenses/${code}`, `./used/${code}`, (error) => {
                                                if (error) return console.log(error);
                                            });
                            
                                            usrjson.redeemed = true;
                                            fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(usrjson), function writeJSON(err) {
                                                if (err) return console.log(`[ERROR] ${err}`);
                                                return message.author.send(`Redeemed successfully.\nCustomer Discord: ${invite123}`);
                                            });
                                        };
                                        return message.author.send('Nice try. This order ID is already redeemed'); //'해당 라이센스는 이미 사용된 라이센스입니다!');
                                    };
                                    if (!exists2) {
                                        return message.author.send('invalid order ID');
                                    } else {
                                        let invite123 = remove_http_or_https(await createcustomerinvite());
                                        fs.renameSync(`./licenses/${code}`, `./used/${code}`);
                            
                                        console.log()
                                        usrjson.redeemed = true;
                                        fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(usrjson), function writeJSON(err) {
                                            if (err) return console.log(`[ERROR] ${err}`);
                                            return message.author.send(`Redeemed successfully.\nCustomer Discord: ${invite123}`);
                                        });
                                    };
                                });
                            });
                        } else if (cmd.startsWith("hwid")) {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
        
                            hwid = message.content.split(" ")[1];
                            if (hwid == "" || hwid == undefined || hwid == null) {
                                return message.author.send(`Incorrect usage.\nUsage: ${hwidhelp}`);
                            };
                            if (!hwid) return;
                            if (hwid) {
                                let timeerr;
                                let answer = "";
                                message.author.send(`HWID: \`${hwid}\`.\nIs that correct? (\`!confirm yes/no\`). You can't change your HWID until next 7 days.`);0
                                let userjson = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));
                                userjson.haveconfirm.hwid = true;
                                fs.writeFileSync(`./users/${message.author.id}.json`, JSON.stringify(userjson));
                                /*
                                await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (answer = m.content), {
                                    max: 1,
                                    time: 30000,
                                    errors: ["time"]
                                }).catch((err) => {
                                    timeerr = true;
                                });
                                if (timeerr) return message.author.send("시간초과! 다시시도해 주세요.");
                                if (answer == "!confirm yes") {
                                    const usrjson = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));
                                    usrjson.HWID = hwid;
                                    fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(usrjson), function writeJSON(err) {
                                        if (err) return console.log(`[ERROR] ${err}`);
                                    });
                                    message.author.send("HWID updated successfully. Run \`!username <username>\` to finish the setup");
                                    fs.readFile(`./users/${message.author.id}.json`, 'utf8', (error, data) => {
                                        if (error) return console.log(`[ERROR] ${error}`);
                                        let usrjson2 = JSON.parse(data);
                                    });
                                } else if (answer == "!confirm no") {
                                    message.author.send("Set HWID cancelled");
                                } else {
                                    return;
                                    //return message.author.send("다시시도해 주세요!");
                                };
                                */
                            };
                        } else if (cmd.startsWith("username")) {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
        
                            let username = message.content.split("!username ")[1];
                            if (username == "" || username == undefined || username == null) {
                                return message.author.send(`Incorrect usage.\nUsage: ${usernamehelp}`);
                            };
                            if (!username) return;

                            let usersfile = fs.readdirSync(`./users/`);
                            usersfile.forEach(x => {
                                let userjson = JSON.parse(fs.readFileSync(`./users/${x}`, 'utf8'));
                                if(username == userjson.UserName) {
                                    username = null;
                                };
                            });
                            if(username == null) {
                                return message.author.send("This username is already taken");
                            } else {
                                const usrjson = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));
                                let first = usrjson.first;
                                if(first) {
                                    fs.readdir('./users/', "utf8", function(err, files123123123123){
                                        if (err) {
                                           //res.status(500);
                                           throw err;
                                        };
                                     
                                        let uid = 0;
                                        files123123123123.forEach(function(filename){
                                           //파일을 순서(동기)대로 읽는다.(readFileSync)
                                           var data123123123 = require(`./users/${filename}`);
                                           if(data123123123.redeemed) {
                                               uid++
                                           };
                                        });
    
                                        console.log(`AUTO UID: ${uid}`);
    
                                        usrjson.first = false;
                                        usrjson.UID = uid;
                                        usrjson.UserName = username;
                                        fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(usrjson), function writeJSON(err) {
                                            if (err) return console.log(`[ERROR] ${err}`);
                                            message.author.send(`Username was set to \`${username}\`.\nYour UID is: \`${uid}\`. Use it to login`);
                                        });
                                    });
                                } else {
                                    usrjson.UserName = username;
                                    fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(usrjson), function writeJSON(err) {
                                        if (err) return console.log(`[ERROR] ${err}`);
                                        message.author.send(`Username changed to ${username}`);
                                    });
                                };
                            };
                        } else if (cmd == "invite") {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
        
                            if (client.guilds.cache.get(config.customerdiscord.id).members.cache.find(x => x.id == message.author.id)) {
                                return message.author.send("You are already in the customer server");
                            } else {
                                let invite123 = remove_http_or_https(await createcustomerinvite());
                                message.author.send(`Here's your invite: ${invite123}`);
                            };
                        } else if (cmd.startsWith("download")) {
                            if (!userredeemed) {
                                return message.author.send("You are not authorized to use this bot. Contact the admins")
                            };
                            
                            let downloadmode = message.content.split(" ")[1];
                            message.author.send("Please wait...");
                            let sentdownloadmsg = message.author.send(`${client.emojis.cache.get("851352674791325747")} Working on it...`);
                            if (downloadmode == "beta") {
                                let usrjson123 = JSON.parse(fs.readFileSync(`./users/${message.author.id}.json`, 'utf8'));
                                if(usrjson123.beta) {
                                    let downloadlink = "https://discordapp.com/";
                                    sentdownloadmsg.edit(`:white_check_mark: CustoomNPC download (beta) link: ${downloadlink}. Expires in 5 minutes.\nMake sure to follow <#${config.customerdiscord.tutorialchannel}> or else you won't be able to log in. Your ID is \`${usrjson123.UID}\`. Use it to authenticate. \n<@${message.author.id}>`);
                                } else {
                                    message.author.send(`You do not have access to the channel "BETA"`);
                                };
                            } else {
                                let downloadlink = "https://discordapp.com/";
                                //노말 다운로드
                            };
                        } else if (cmd == "codelist") {
                            if (!config.owners.includes(message.author.id)) return;
                            fs.readdir("./licenses", function(error, filelist) {
                                let send = 'License codes:\n';
                                filelist.forEach(x => {
                                    send = send.concat(x.replace('.custoomnpc', '\n'));
                                });
                                message.author.send(`\`\`\`${send}\`\`\``);
                            });
                        } else if (cmd.startsWith("manager")) {
                            if (!config.owners.includes(message.author.id)) return;
                            let option123 = message.content.split("manager ")[1];
                            if(option123 == "createlicense") {
                                let code = Genlicense();
                                fs.writeFile("./licenses/" + code, "", (error) => {
                                    if (error) {
                                        console.log(`[ERROR] ${error}`);
                                        return message.author.send(`Unknown ERROR!`);
                                    }
        
                                    message.author.send(`Code was successfully created! (license code: ${code.replace('.custoomnpc', '')})`);
                                });
                            } else if (option123.startsWith("createcustomlicense")) {
                                if (!config.owners.includes(message.author.id)) return;
                                let code123 = message.content.split("createcustomlicense ")[1]; // or .slice(1, 2);
                                //console.log(code123);
                                if (code123 == "" || code123 == null || code123 == undefined) {
                                    return message.author.send('생성할 코드를 입력해 주세요.');
                                };
                                if (!code123) {
                                    return;
                                };
                                let code = code123 + ".custoomnpc";
                                fs.exists(`./licenses/${code}`, (exists) => {
                                    if (exists) {
                                        return message.author.send(`이미 \`${code123}\`라이센스 코드가 존재합니다.`);
                                    };
            
                                    fs.writeFile("./licenses/" + code, "", (error) => {
                                        if (error) {
                                            console.log(`[ERROR] ${error}`);
                                            return message.author.send(`Unknown ERROR!`);
                                        }
            
                                        message.author.send(`Code was successfully created!`);
                                    });
                                });
                            } else if (option123.startsWith("removelicense")) {
                            if (!config.owners.includes(message.author.id)) return;
                            let code123 = message.content.split(" ")[1];
                            //console.log(code123);
                            if (code123 == "" || code123 == undefined || code123 == null) {
                                return message.author.send('삭제할 라이센스 코드를 입력해 주세요. (!codelist)');
                            };
                            if (!code123) {
                                return;
                            };
                            let code = code123 + ".custoomnpc";
        
                            fs.exists(`./used/${code}`, (exists11) => {
                                if (!exists11) {
                                    fs.exists(`./licenses/${code}`, (exists2) => {
                                        if (!exists2) {
                                            return message.author.send(`\`${code123}\`라이센스 코드는 존재하지 않습니다.`);
                                        };
        
                                        fs.rename(`./licenses/${code}`, `./removed/${code}`, (error) => {
                                            if (error) {
                                                console.log(`[ERROR] ${error}`);
                                                return message.author.send(`Unknown ERROR!`);
                                            };
        
                                            message.author.send(`License Code was successfully removed!`);
                                        });
                                    });
                                } else {
                                    fs.exists(`./used/${code}`, (exists112) => {
                                        if (!exists112) {
                                            return message.author.send(`\`${code123}\`라이센스 코드는 존재하지 않습니다.`);
                                        };
        
                                        fs.rename(`./used/${code}`, `./removed/${code}`, (error) => {
                                            if (error) {
                                                console.log(`[ERROR] ${error}`);
                                                return message.author.send(`Unknown ERROR!`);
                                            };
        
                                            message.author.send(`Used License Code was successfully removed!`);
                                        });
                                    });
                                };
                            });
                            } else if (option123.startsWith("setbeta")) {
                                let customnpciq0 = option123.split("setbeta ")[1];
                                let userid = customnpciq0.split(" ")[0];
                                let tf = customnpciq0.split(" ")[1];
                                //return message.author.send(tf);
                                fs.exists(`./users/${userid}.json`, (exists12) => {
                                    if (!exists12) return message.author.send("해당 유저는 존재하지 않습니다.");
                                    fs.readFile(`./users/${userid}.json`, 'utf8', (err, data) => {
                                        if(err) return console.log(`[ERROR] ${err}`);
                                        const usrjson = JSON.parse(data);
                                        //return console.log(usrjson);
                                        if(tf == "true") {
                                            usrjson.beta = true;
                                            fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(usrjson), function writeJSON(err) {
                                                if (err) return console.log(`[ERROR] ${err}`);
                                                client.guilds.cache.get(config.customerdiscord.id).members.cache.find(member => member.id == userid).roles.add(client.guilds.cache.get(config.customerdiscord.id).roles.cache.find(role => role.id == config.customerdiscord.betaroleid));
                                                let username = "";
                                                try {
                                                    username = client.users.cache.find(userr => userr.id == userid).tag;
                                                } catch {
                                                    username = "Unknown";
                                                }
                                                return message.author.send(`${username}(id: ${userid}) Beta Added!`);
                                            });
                                        } else {
                                            usrjson.beta = false;
                                            fs.writeFile(`./users/${message.author.id}.json`, JSON.stringify(usrjson), function writeJSON(err) {
                                                if (err) return console.log(`[ERROR] ${err}`);
                                                client.guilds.cache.get(config.customerdiscord.id).members.cache.find(member => member.id == userid).roles.remove(client.guilds.cache.get(config.customerdiscord.id).roles.cache.find(role => role.id == config.customerdiscord.betaroleid));
                                                let username = "";
                                                try {
                                                    username = client.users.cache.find(userr => userr.id == userid).tag;
                                                } catch {
                                                    username = "Unknown";
                                                }
                                                return message.author.send(`${username}(id: ${userid}) Beta Removed!`);
                                            });
                                        };
                                    });
                                });
                            } else {
                                return message.author.send(`Incorrect usage.\nUsage: ${managerhelp.main}`);
                            }
                        } else if (cmd.startsWith("usedb")) {} else {
                            message.author.send("Unknown command. Type `!help` for help");
                        };
                    });
                };
            };
        });
    };
});
//=========================================functions=========================================
async function createcustomerinvite(expireaftter = 3600, maxuses = 1) {
    let returnvalue = "Unknown error!";
    await client.guilds.cache.get(config.customerdiscord.id).channels.cache.find(ch => ch.type == "text").createInvite({
        maxAge: 300,
        maxUses: 1
    }).then(invite => {
        returnvalue = invite.url;
    }).catch(err => {
        console.log(err);
        returnvalue = "Unknown error!";
    });
    return returnvalue;
};

(async function () {
    let driver = await new Builder()
    .forBrowser('firefox')
    .build();
    try {
        // 네이버 실행
        await driver.get('https://m.cultureland.co.kr/mmb/loginMain.do?agent_url=/index.do');

        // Javascript를 실행하여 UserAgent를 확인한다.
        let userAgent = await driver.executeScript("return navigator.userAgent;")

        console.log('[UserAgent]', userAgent);

        // 네이버 검색창의 id는 query이다. By.id로 #query Element를 얻어온다.
        let searchInput = await driver.findElement(By.id('query'));

        // 검색창에 '회 숙성하는 법'을 치고 엔터키를 누른다.
        let keyword = '회 숙성하는 법'
        searchInput.sendKeys(keyword, Key.ENTER);

        // css selector로 가져온 element가 위치할때까지 최대 10초간 기다린다.
        await driver.wait(until.elementLocated(By.css('#header_wrap')), 10000);

        // total_tit라는 클래스 명을 가진 element들을 받아온다.
        let resultElements = await driver.findElements(By.className('total_tit'));
        console.log('[resultElements.length]', resultElements.length)

        // 검색 결과의 text를 가져와서 콘솔에 출력한다.
        console.log('== Search results ==')
        for (var i = 0; i < resultElements.length; i++) {
            console.log('- ' + await resultElements[i].getText())
        }

        // 검색결과의 첫번째 링크를 클릭한다.
        if (resultElements.length > 0) {
            await resultElements[0].click();
        }

        // 4초를 기다린다.
        try {
            await driver.wait(() => { return false; }, 4000);
        } catch (err) {

        }   
    }
    finally{
        // 종료한다.
        driver.quit();
    }
});


function remove_http_or_https (string = "") {
    let returnvalue = "Unknown error!";
    if (string.includes("https://")) {
        returnvalue = string.replace("https://", "");
    } else if (string.includes("http://")) {
        returnvalue = string.replace("http://", "");
    } else {
        returnvalue = string;
    }
    return returnvalue;
};

function Genlicense () {
    var chars = '01234567890123456789abcdefghiklmnopqrstuvwxyz'
    var randomstring = ''
    for (var i = 0; i < 32; i++) {
      var rnum = Math.floor(Math.random() * chars.length)
      randomstring += chars.substring(rnum, rnum + 1)
    };
    var sub1 = randomstring.substr(0, 8);
    var sub2 = randomstring.substr(8, 4);
    var sub3 = randomstring.substr(12, 4);
    var sub4 = randomstring.substr(16, 4);
    var sub5 = randomstring.substr(20, 12);
    var str = sub1 + "-" + sub2 + "-" + sub3 + "-" + sub4 + "-" + sub5 + '.custoomnpc';
    return str
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}