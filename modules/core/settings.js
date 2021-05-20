
// secret key for JSON Web Token

const SECRET_KEY = "lsz1nkdDiyLV4PZluxbzsSLIOHTwaznV1kUHJqkUiMcnIr3KrLQs2-Cr_6dp5XiszMnEBH1owGaAT9qyee4bLAkJsqXQby_Ndy0AQ8hjJtfsQgeU7KJmcNI5JYpxXB--s23rMmgccU56ZSEap3reZd2jjOpXF3HMI2gnNO4uhymTAfIqM8BqAf5VEzqgZT8IOQdHFuFHoHz_TjLZevCUqmnsCB5neAfYuQMkYo7_a5wqxdILJwlX_AKiPuH1Zw9-6jWxG7N1xoAYvVrEbigqbVdyhG6Fn8eTg_qaaze9l0DjrDtpu5CiMPUOGYsDhnz9qeN4wj97Or_hWn6N8w86sQ";

const DEFAULT_TENANT_ID = 'FAA852E2-4E62-4BD8-864E-23E34447BF43';

const coreSettings = function () {
    return {
        SECRET_KEY: SECRET_KEY,
        DEFAULT_TENANT_ID: DEFAULT_TENANT_ID
    }
};

module.exports = new coreSettings();