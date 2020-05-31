# OAuth 2.0 Server

Nodejs Server with OAuth 2.0 &amp; OpenID Connect

**Playground**: https://oauth2-node-server.herokuapp.com/docs

### Development

**Requirements**

- [Node JS](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)

**Enivronment variables**

Create `.env` file from the `.env.example` present and add configurations from aws cognito dashboard. Current `.env.example` looks like this:

```bash
MONGO_URI=
```

**Available Scripts**

| Npm Script | Description                                        |
| ---------- | -------------------------------------------------- |
| `start`    | Runs app in development mode                       |
| `dev`      | Runs app in develement mode and watch file changes |

**Reference**: [Identity and Data Security for Web Development](http://shop.oreilly.com/product/0636920044376.do)

### Testing

For Production

```bash
client_id: 6656a7d2-5f10-4832-bef4-4d858f95645f
```
