## Introduction

- An user-Friendly web interface for *ChatGPT*.

### Tech Stack

- Built with [Next.js](https://nextjs.org/)
- Bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

### Get it Running

- Apply your OpenAI API in [here](https://platform.openai.com/account/api-keys)
- Run `yarn dev`
- Open [`localhost:3000`](http://localhost:3000)

### Pages

> Stale links that needs to be revamped

- Using [index](https://chatgpt.yubolun.com/) as a tool.
- Using [chat](https://chatgpt.yubolun.com/chat) for conversation
- Using [tool](https://chatgpt.yubolun.com/tool/you%20are%20a%20translator) to share your prompts

## Features

### Planned

- [ ] Make two requests in order to get both the Chinese and the English answers
- [ ] Properly render the line feed and bullet points in the original response

### Existing Ones

> By [*discountry*](https://github.com/discountry)

- [x] /tool/[system direction] `/tool/you are a translator`
- [x] openai streaming
- [x] markdown support
- [x] code highlight & copy to clipboard
- [x] responsive design
- [x] conversation mode `/chat`
