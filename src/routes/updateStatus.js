const express = require('express')
const router2 = express.Router()
var Airtable = require('airtable');
const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');

//WHATSAPP-WEB JS (initializing client)

const client = new Client({
    puppeteer: {
        args: [
            '--no-sandbox',
        ],
    },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 0,
});

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

Airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: 'keymp2LxMAHUNmXHT',
});

const base = Airtable.base('appOM6VcUFFOeG7rY');

router2.use(express.static(__dirname + "public"));


/////////////Router for sending status update on clients phone///////////////////
router2.get('/statusupdate',
    function (req, res) {
        try {
            console.log('script runs')
            // var recordid = request.query.recordid; // $_GET["id"]
            base('ЦЕХ заказы').find('recVe1KFErZFnZBcM', function (err, record) {
                if (err) { console.error(err); return; }
                console.log('Retrieved', record.id);

                const ordernum = record.get("order num");
                const productname = record.get("товар");
                const Status = record.get("Status");
                const ourwhatsapp = '';
                const clientwhatsapp = record.get("Client whatsapp");

                console.log("ordernum", ordernum);
                console.log("productname", productname);
                console.log("Status", Status);
                console.log("Our whatsapp", ourwhatsapp);
                console.log("Client whatsapp", clientwhatsapp);

                // Number where you want to send the message.In your case client whatsapp
                const number = "+923214920880"; //Replace this number with Client Whatsapp number
                //  const number = clientwhatsapp;
                // Your message.
                // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
                const chatId = number.substring(1) + "@c.us";

                // Sending message.
                client.sendMessage(chatId, 'Your status has been updated:' + Status);
                // res.redirect('https://localhost:8000');
            });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json("internal server error")
        }
    })


module.exports = router2;