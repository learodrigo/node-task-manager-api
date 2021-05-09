const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = ({ email, name }) => {
    const msg = {
        to: email,
        from: 'leandrorodrigobs@gmail.com',
        subject: `Thanks for joining in, ${name}!`,
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log('Confirmation email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

const sendCancelationEmail = ({ email, name }) => {
    const msg = {
        to: email,
        from: 'leandrorodrigobs@gmail.com',
        subject: `Sorry for letting you down, ${name}!`,
        text: `We're sorry to see you leave, ${name}. Join us again whenever you want!`
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log('Cancellation email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
