module.exports = {
    dbUrl:'mongodb+srv://nusratchy002:IFz8ohwtc7Z5uFSC@cluster0.pcz5eav.mongodb.net/',
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
        secret: "b6QBvxXz4LRQ3PXXDQuYlICO1dswewee",
        issuer: "test",
        accessTokenExpiresIn: "10 days",
        refreshTokenExpiresIn: "30 days"
    },

    db_select: 'graphql',
    auth0: {
        audience: 'http://localhost:4000',
        issuerBaseURL: 'https://dev-fd8smidgyw8nxsu6.us.auth0.com/',
        tokenSigningAlg: 'RS256'
    },
    databaseType:'aws'
}