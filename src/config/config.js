module.exports = {
    // dbUrl: 'mongodb+srv://nusratchy002:IFz8ohwtc7Z5uFSC@cluster0.pcz5eav.mongodb.net/',
    dbUrl: 'mongodb://localhost:27017',
    hashConfig: {
        SIGNERKEY: "jxspr8Ki0RYycVU8zykbdLGjFQ3McFsasaUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==",
        SALTSEPARATOR: "Bw==",
        ALGORITHM: "aes-256-cbc",
        IV_LENGTH: 16,
        IV_VALUE: "mfN5PaAnRvNRfLUJ0yfzJg==",
        KEYLEN: 32,
        PARAMS: {
            "N": 16384,
            "r": 8,
            "p": 1,
            "maxmem": 33554432
        }
    },
    jwt: {
        user: { secret: "b6QBvxXz4LRQ3PXXDQuYlICO1dswewee" },
        issuer: "test",
        accessTokenExpiresIn: "10 days",
        refreshTokenExpiresIn: "30 days",
        authority: { secret: "b6QBvxXz4LRQ3PXXDQuYlICO1FSesgsgs" }
    },

    auth0: {
        audience: 'http://localhost:4000',
        issuerBaseURL: 'https://dev-fd8smidgyw8nxsu6.us.auth0.com/',
        tokenSigningAlg: 'RS256'
    },
    databaseType: 'aws',
    mailConfig: {
        SENDGRID_API_KEY: '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',
        from: 'santoshjamre4@gmail.com',
    },

    staffContacts: {
        medical_director: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        nursing_head: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        operations_manager: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        housekeeping_manager: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        catering_manager: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        pharmacy_head: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        front_desk_manager: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        facilities_manager: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        finance_manager: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        },
        hospital_administrator: {
            email: 'nusratchy.002@gmail.com',
            mobile: ''
        }
    }
}