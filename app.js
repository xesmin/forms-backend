import express from 'express';
import bodyParser from 'body-parser';
import mailing from '@sendgrid/mail';

mailing.setApiKey(process.env.STRIPE_API_KEY);

const App = express();
const port = process.env.PORT || 801;
App.use(bodyParser.urlencoded({
    extended: true
}));

App.get('/', (req, res) => {
    res.send('Forms Backend');
});

App.post('/', (req, res) => {
    let textMsg = ''
    let htmlMsg = ''
    for (let x in req.body) {
        textMsg += (x + ': ' + req.body[x] + ', ');
        if (x != 'target')
            htmlMsg += `<tr style="border: 1px solid #000000;"><td>${x}</td><td>${req.body[x]}</td><tr>`
    }
    let msg = {
        to: req.body.target,
        name: 'DreamForms',
        from: {
            name: 'DreamForms',
            email: 'no-reply@dcgr.pl'
        },
        subject: 'Message from Website',
        text: textMsg,
        html: `<table>${htmlMsg}</table>`
    };
    mailing.send(msg);
    res.redirect(req.body.redirectPage);
});

App.listen(port, (err) => {
    if (err)
        console.error(err);
    else
        console.log('Forms backend listening on port 80...');
});