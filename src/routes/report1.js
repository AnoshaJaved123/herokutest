const express = require('express')
const router = express.Router()
// const router2 = express.Router()

const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
var Airtable = require('airtable');
const { v4: uuidv4 } = require('uuid');     //for uniquie pdf name
const qrcode = require('qrcode-terminal');  //for QR generation
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

router.use(express.static(__dirname + "public"));

router.get('/blank_zakaza',
    function (req, res) {
        try {
            console.log('script runs')
            let fileExist = false;
            // var recordid = request.query.recordid; // $_GET["id"]
            const recordid = req.query.recordid; // $_GET["id"]
            //var text2=request.query.text2;
            // console.log(req.query.recordid)
            console.log("qadamloft " + recordid);
            base('ЦЕХ заказы').find(recordid, function (err, record) {
                if (err) { console.error(err); return; }
                console.log('Retrieved', record.id);
                const ordernum = record.get("order num");
                const productname = record.get("товар");
                const qty = record.get("саны");
                // const ourwhatsapp = record.get("Our whatsapp");
                // const clientwhatsapp = record.get("Client whatsapp");
                // const weldewhatsapp = record.get("Welder whatsapp");
                const ourwhatsapp = '';
                const clientwhatsapp = record.get("Client whatsapp");
                const weldewhatsapp = record.get("Welder whatsapp");
                const comment1 = record.get("коммент");
                let comment2 = "если ЛДСП, то на весь заказ" + record.get("кмн стол") || "";
                const address = record.get("адрес доставки 2");
                const postavshik = record.get("поставшик");
                let paints = record.get("бояу");
                if (paints == undefined){
                    paints = "НЕ ЗАПОЛНЕНО!?";
                } 
                const deadline1 = record.get("дата Сдачи");
                const deadline = new Date(deadline1).toLocaleDateString("uk-Uk");
                const svarshik = record.get("svarshik");
                const picture = record.get("pictures");
                const zakaz_short = record.get("заказ");
                // let photo;
                // if (pic != undefined && pic.length > 0) photo = pic[0];
                console.log("ordernum", ordernum);
                console.log("productname", productname);
                console.log("qty", qty);
                console.log("Our whatsapp", ourwhatsapp);
                console.log("Client whatsapp", clientwhatsapp);
                console.log("Welder whatsapp whatsapp", weldewhatsapp);
                console.log("comment1", comment1);
                console.log("address", address);
                console.log("postavshik", postavshik);
                console.log("paints", paints);
                console.log("deadline", deadline);
                console.log("svarshik", svarshik);
                console.log("zakaz_short", zakaz_short);
                // console.log("photo.url  " + photo.url);
                console.log("picture.url  ",picture[0].url);
                const line1 = "Заказ " + ordernum + " ";
                const line2 = productname + " - " + qty + " шт";
                const line3 = comment1;
                const line4 = "краска " + paints;
                const line5 = comment2 || "";
                const line6 = "Поставщик " + postavshik;
                const line7 = "Сроки " + deadline;
                const line8 = address;
                const line9 = "Сваршик " + svarshik;

                let airtableData = {
                    line1: line1,
                    line2: line2,
                    line3: line3,
                    line4: line4,
                    line5: line5,
                    line6: line6,
                    line7: line7,
                    line8: line8,
                    line9: line9,
                    pic: picture[0].url,
                };

                // const filename = zakaz_short + ".pdf";
                const filename = "report-" + uuidv4() + ".pdf";
                try {
                    ejs.renderFile(
                        path.join(__dirname, "../views/111.ejs"),
                        { report1data: airtableData },
                        (err, data) => {
                            if (err) {
                                console.log("error line 210" + err);
                                return res.send("Sorry, Making PDF is failure in ejs phase. Please try again.")
                            } else {
                                let options = {
                                    format: "A4",
                                    base: "file:///" + __dirname,

                                    header: {
                                        height: "2mm",
                                    },

                                    footer: {
                                        height: "20mm",
                                    },
                                      childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}
                                };
                                pdf.create(data, options).toFile(filename, function (err, data) {
                                    if (err) {
                                        // res.send(err);
                                        console.log("error create pdf " + err);
                                    } else {
                                        //res.send("File created successfully");
                                        console.log("File created successfully");
                                        res.download('././' + filename);
                                        fileExist = true;
                                        if (fileExist) {
                                            // Number where you want to send the message.In your case welder whatsapp
                                            
                                            // const number = "+77071174715"; //Replace the number with welder whatsapp number
                                            const number = "+923214920880"; //Replace the number with welder whatsapp number
                                            // Your message.
                                            const text = "PDF sent successfully"; //Set the text 
                                            const attachmentPdf = MessageMedia.fromFilePath('././' + filename);

                                            // Getting chatId from the number.
                                            // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
                                            const chatId = number.substring(1) + "@c.us";

                                            // Sending message.
                                            client.sendMessage(chatId, attachmentPdf);
                                            client.sendMessage(chatId, text);
                                            console.log("file sent successfully to whatsapp")
                                        }
                                    }
                                });  //end pdf create
                            }
                        }

                    ); //end ejs render file*/ 

                } catch (error) {
                    console.log(error.message)
                    return res.status(400).json("message not sent")
                }
            });
            // res.send(data)
        } catch (error) {
            console.log(error.message)
            return res.status(500).json("internal server error")
        }
    });


/////////////////WHATSAPP STATUS ROUTE////////////////////////
    router.get('/statusupdate',
    function (req, res) {
        try {
            console.log('script runs')
            // var recordid = request.query.recordid; // $_GET["id"]
            const recordid = req.query.recordid; // $_GET["id"]
            base('ЦЕХ заказы').find(recordid, function (err, record) {
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
            return res.status(200).json("Status has been updated and send succesfully")
        } catch (error) {
            console.log(error.message)
            return res.status(500).json("internal server error")
        }
    })


// module.exports = router2;
module.exports = router;