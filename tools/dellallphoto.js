'use strict'
const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const rp = require('request-promise');
const S = require('string');
const inquirer = require('inquirer');

const User = [{
        type: 'input',
        name: 'username',
        message: '[>] Kullanıcı Adı:',
        validate: function(value) {
            if (!value) return 'Can\'t Empty';
            return true;
        }
    },
    {
        type: 'password',
        name: 'password',
        message: '[>] Şifre:',
        mask: '*',
        validate: function(value) {
            if (!value) return 'Can\'t Empty';
            return true;
        }
    },
    {
        type: 'input',
        name: 'ittyw',
        message: '[>] Silinecek Miktar (1 -9000 ):',
        validate: function(value) {
            value = value.match(/[0-9]/);
            if (value) return true;
            return 'Lütfen Sayı Girin!';
        }
    },
    {
        type: 'input',
        name: 'sleep',
        message: '[>] Saniye ( Önerilen : 3 ):',
        validate: function(value) {
            value = value.match(/[0-9]/);
            if (value) return true;
            return 'Lütfen Sayı Girin!';
        }
    }
]

const Login = async function(User) {

    const Device = new Client.Device(User.username);
    const Storage = new Client.CookieMemoryStorage();
    const session = new Client.Session(Device, Storage);

    try {
        await Client.Session.create(Device, Storage, User.username, User.password)
        const account = await session.getAccount();
        return Promise.resolve({
            session,
            account
        });
    } catch (err) {
        return Promise.reject(err);
    }

}

const Media = async function(session, id) {
    const Media = new Client.Feed.UserMedia(session, id);

    try {
        const Poto = [];
        var cursor;
        do {
            if (cursor) Media.setCursor(cursor);
            const getPoto = await Media.get();
            await Promise.all(getPoto.map(async (poto) => {
                Poto.push({
                    id: poto.id,
                    link: poto.params.webLink
                });
            }))
            cursor = await Media.getCursor()
        } while (Media.isMoreAvailable());
        return Promise.resolve(Poto);
    } catch (err) {
        return Promise.reject(err);
    }
}

const Delete = async function(session, id) {
    try {
        await Client.Media.delete(session, id);
        return true;
    } catch (err) {
        return false;
    }
}


const Excute = async function(User, sleep, ittyw) {
    try {
        console.log(chalk `{yellow \n? Giriş Yapılıyor... . .}`)
        const doLogin = await Login(User);
        console.log(chalk `{green ✓ Giriş Başarılı.\n }{yellow Gönderiler Toplanıyor . . .\n}`);
        var getMedia = await Media(doLogin.session, doLogin.account.id);
        console.log(chalk `{green ✓ Gönderiler Toplandı. Toplam Gönderi: ${getMedia.length}}\n`);
        console.log(chalk `{yellow ≡ İşlem Başarılı! Silinen ${ittyw} MEDIA/${sleep} Saniye\n}`)
        getMedia = _.chunk(getMedia, ittyw);
        var timeNow = new Date();
        timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
        for (let i = 0; i < getMedia.length; i++) {
            await Promise.all(getMedia[i].map(async (media) => {
                const doDelete = await Delete(doLogin.session, media.id);
                const PrintOut = chalk `{magenta ⌭ ${timeNow}}: ${media.link} ➾ ${doDelete ? chalk`{bold.green Silindi}` : chalk`{bold.red Silinmedi}`}`
                console.log(PrintOut);
            }))
            console.log(chalk `{yellow \nϟ Geçerli Hesap: {bold.green ${User.username}} » Gecikme: ${ittyw}/${sleep}ms\n}`);
            await delay(sleep)
        }

    } catch (err) {
        console.log(err);
    }
}
console.log(chalk `{bold.cyan
  Ξ TITLE  :  Instagram Gönderi Silici
  Ξ CODE   : Whiz
  Ξ STATUS : {bold.green [ÇALIŞIYOR]} & {bold.yellow [TEST EDİLDİ]}}
      `);
inquirer.prompt(User)
    .then(answers => {
        Excute({
            username: answers.username,
            password: answers.password
        }, answers.sleep, answers.ittyw);
    })
    .catch(e => {
        console.log(e);
    })

//by 1dcea8095a18ac73b764c19e40644b52