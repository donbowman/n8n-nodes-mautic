"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MauticRestApi = void 0;
class MauticRestApi {
    constructor() {
        this.name = 'mauticRestApi';
        this.displayName = 'Mautic Rest API';
        this.documentationUrl = 'mautic';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://name.mautic.net',
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                auth: {
                    username: '={{$credentials.username}}',
                    password: '={{$credentials.password}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.url.replace(new RegExp("/$"), "")}}',
                url: '/api/users/self',
            },
        };
    }
}
exports.MauticRestApi = MauticRestApi;
//# sourceMappingURL=MauticRestApi.credentials.js.map