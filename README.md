# Mantine Next

The easiest way to initialize a new project with [Mantine](https://mantine.dev/) and [Next.js](https://nextjs.org/).

## Features

This is an **opinionated** template that includes:

- [Mantine](https://mantine.dev/), the best React UI library
- [Next.js](https://nextjs.org/), the de-facto metaframework for building React web applications
- [tRPC](https://trpc.io/) paired with [TanStack Query](https://tanstack.com/query), exclusively for client-side RPCs
- Styling with [CSS Modules](https://mantine.dev/styles/css-modules/), the recommended way to style Mantine applications; no TailwindCSS
- TypeScript, of course
- [IronSession](https://github.com/vvo/iron-session) for authentication
- [Drizzle](https://orm.drizzle.team/) for database access (should be easy to replace with [Prisma](https://www.prisma.io/) or [Kysely](https://kysely.dev/))
- [SQLite](https://www.sqlite.org/)-file database

## Getting Started

1. Clone the repository (i.e. `git clone https://github.com/icflorescu/mantine-next.git`)
2. Install dependencies with `pnpm i`
3. Make a copy of `.env.example`, name it `.env` and make sure to set a strong password for the session cookie
4. Generate the database file with `pnpm db:init`
5. Seed the database with `pnpm db:seed`
6. Start the development server with `pnpm dev`.

## Why this exists

I've been using Mantine and Next.js for a while to build most of my projects for the past few years.  
Next.js is a great framework, but, to put it bluntly, it has its fair share of issues and quirks, and deciding upon how to best structure a project can be a bit of a challenge.   

## Q & A

1. **Why Drizzle**  
   I've been using Prisma for most of my work, but Drizzle is leaner, faster, and allows you to dynamically build complex queries when needed.

2. **Why SQLite**  
   Because it's easy to set up, a great choice for prototyping, local development, and - believe it or not - even production (see [Turso](https://turso.tech/)).  
   I'm using PostgreSQL for large projects, though, but I didn't want to add a Dockerfile to this project.

3. **Why not TailwindCSS && ShadcnUI**  
   To cut short a potentially long debate: Mantine already provides enough properly-styled components.  
   If you're here, you're problably looking for a way to quickly build an application that features truly user-frienly input components out-of-the-box.

## Support the project

If you find this package useful, please consider ❤️ [sponsoring my work](https://github.com/sponsors/icflorescu).  
Your sponsorship will help me dedicate more time to maintaining the project and will encourage me to add new features and fix existing bugs.  
If you're a company using Mantine, [Mantine DataTable](https://icflorescu.github.io/mantine-datatable/), [Mantine ContextMenu](https://icflorescu.github.io/mantine-contextmenu/) or other open-source projects I built, I'd love to hear from you.  
If you need help in a commercial project, you can also hire my services (see [hiring the author](#hiring-the-author) below).  
Starring the repo on GitHub is also greatly appreciated.

## Hiring the author

If you want to hire my services, don’t hesitate to drop me a line at the email address listed in my [GitHub profile](https://github.com/icflorescu).
Mentioning *Mantine and Next.js or TanStack* will result in a faster response.

## Acknowledgements

Special thanks to [Vitaly Rtishchev](https://github.com/rtivital) and the awesome contributors of [Mantine](https://mantine.dev/) for putting countless hours of work into building and maintaining the best React UI library I've ever used.

## License

The [MIT License](https://github.com/icflorescu/mantine-datatable/blob/master/LICENSE).
