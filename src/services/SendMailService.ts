import { Transporter, createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";
import handleBars from "handlebars";
import { resolve } from "path";
import fs from 'fs';

class SendMailService {
    private client: Transporter;

    constructor() {
        createTestAccount()
            .then(account => {
                const transporter = createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: { user: account.user, pass: account.pass }
                });

                this.client = transporter;
            })
    }

    async execute(to: string, subject: string, variables: object, path: string) {
        // Read and Understand the File
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        // Compile the file to HandleBars
        const mailTemplateParse = handleBars.compile(templateFileContent);

        const html = mailTemplateParse(variables);
        // const html = mailTemplateParse({
        //     name: to, title: subject,
        //     description: body,
        // });

        const message = await this.client.sendMail({
            to,
            subject,
            html: html,
            from: "NPS <noreplay@nps.com.br>"
        });

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", getTestMessageUrl(message));
    }
}

export default new SendMailService();