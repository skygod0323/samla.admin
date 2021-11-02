// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    server: 'http://127.0.0.1/samla/api/public',
    // server: 'http://185.117.72.53'
    awsConfig: {
        accessKeyId: 'AKIAIOWGM3WXJQ4IWNOA',
        secretAccessKey: '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',
        region: 'EU'
    }
};
