# Project Rules

## Git

- **Always ask the user before committing or pushing.** Never commit or push without explicit approval.
- Commit messages must be written in **English**.

---

## Run / Environments

Three environments, selected by script name. Values live in `env/.env.<local|dev|prod>`
only; `scripts/with-env.js` loads the chosen file before starting CRA.

```bash
npm run start:local   # = npm start. dev server + local backend (localhost:8080, via proxy)
npm run start:dev     # dev server + dev API
npm run start:prod    # dev server + prod API (debugging only; blocked by prod CORS)

npm run build:local
npm run build:dev
npm run build:prod    # = npm run build. what CI deploys
```

- Read env values **only** through `src/config/env.js` — never `process.env` in components.
- Adding an environment variable: add it to all three `env/.env.*` files, then export it from `src/config/env.js`.
- `env/.env.*` files are committed. Put secrets in `env/.env.<env>.local` (gitignored) or shell env vars — both override the committed file.

---

## Tech Stack

- **React 19** (CRA / react-scripts 5), **React Router v7**
- **Styling:** Plain CSS files per component (no CSS modules). Tailwind utility classes are available but rarely used.
- **Forms:** react-hook-form + yup
- **HTTP:** axios — baseURL comes from `src/config/env.js` (local: proxy via `http://localhost:8080`, prod: `https://api.highteenday.org`)
- **Editor:** @toast-ui/react-editor
- **Animation:** framer-motion
- **Icons:** lucide-react
- **Auth:** AuthContext (`src/contexts/AuthContext.tsx`)
- **Date util:** `src/utils/dateFormat.js`

## Project Structure

```
src/
  App.js                        # All routes defined here
  config/env.js                 # Environment values (API base URL, WS URL, OAuth origin)
  contexts/AuthContext.tsx       # Global auth state
  utils/dateFormat.js
  components/
    Header/                     # MainHeader + SideBar
    MainPage/                   # Home page (Body, BoardSection, etc.)
    Board/                      # Board list page
    Post/                       # Post list, detail, write/edit
    MyPage/                     # Profile, activity (posts/comments/scraps)
    Friend/                     # Friend list
    LoginPage/
    LoginRelated/
    RegisterRelated/            # AgreeTerms, Account, School, Profile steps
    TimetableRelated/
    MealCalendarPage/
    CommentRelated/
    ReactionButtons/
    Icons/
  pages/
    NotFound.jsx
    Privacy.jsx / Terms.jsx
    WelcomePage.jsx
    UserInfoPage.jsx
```

## Routing (App.js)

| Path | Component |
|------|-----------|
| `/` | MainPage |
| `/login` | LoginPage |
| `/register` | CreateAccountPage |
| `/register/school` | SchoolRegisterPage |
| `/register/profile` | RegisterProfilePage |
| `/profile/edit` | ProfileEditPage |
| `/board/:boardId` | BoardPage |
| `/board/post/:postId` | PostSection |
| `/post/write` | WritePostPage |
| `/post/edit/:postId` | WritePostPage |
| `/mypage` | Mypage |
| `/mypage/posts` | MyPostLikeActivity (type="posts") |
| `/mypage/comments` | MyCommentsPage |
| `/mypage/scraps` | MyPostLikeActivity (type="scraps") |
| `/friend` | FriendList |
| `/timetable` | TimetablePage |
| `/meal` | MealPage |
| `/welcome` | WelcomePage |
| `/FormRegisterPage` | AgreeTermsPage |
| `/privacy` | Privacy |
| `/terms` | Terms |

## Conventions

- Each component has its own `.css` file in the same directory.
- JSX files use `.jsx` extension; context/types use `.tsx`.
- No global state library (Redux, Zustand) — use React Context or local state.
- Mobile-first responsive design; breakpoint typically at `768px`.
- Do not introduce new dependencies without asking the user.
