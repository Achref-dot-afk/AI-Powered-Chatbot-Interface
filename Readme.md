# AI-Powered Chatbot Interface Challenge

A modern AI-powered chat application built with **React**, **TailwindCSS**, **NodeJs** and  **SQLite**. Supports **multi-language (English/Arabic)**, Three Ai models to select from that are pulled from **Open Router**, conversation management, and PDF export of chats.

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack & Folders](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [Api endpoint details](#api-endpoints)
5. [Implementation of i18n](#i18n-internationalization)
6. [Usage Guide](#usage)
7. [AI tools used for development](#project-structure)

---

## Features
- User **authentication** (Sign In / Sign Up) using JWT tokens 
- Multi-language support (**English & Arabic**) for conversation translation and UI components
- Conversation management:
  - Start a new conversation
  - Continue existing conversation
  - Search previous conversations
  - Select AI model for responses
- **Messaging** and receive of AI responses
- **Conversations export** as PDF
- Responsive **sidebar** , search and main chat layout with user details and logout button

---

## Tech Stack & Folders
### Tech Stack : 
- **Frontend:** React, TailwindCSS, Lucide React (icons)
- **Backend:** REST API (Node.js / Express)
- **Database:** SQLite 3
- **State Management:** React `useState` and `useEffect`
- **Routing:** React Router 
- **i18n:** Custom translation object
- **PDF Export:** Custom HTML + `window.print()`

### Folder structure : 
- backend :
  - **controllers :** Contains functions for our routes (authentication controller, chat controller, user controller)
  - **config :** Contains our SQLite database configuration
  - **routes :** Contains routes to structure our backend requests
  - **i18n :** Contains json files (ar.json & en.json) for gracefully translating error messages and chat conversations
  - **utils :** Contains necessary functions
  - **index.js **
  - **.env**
- frontend :
  - **src/apiCalls :** Contains all api calls we used to send requests
  - **src/components :** Contains components used in our frontend
  - **src/pages :** Contains different pages used in our frontend
  - **src/main.jsx :** The entrypoint to our frontend
- scripts/run.sh : file to start the application in a linux environment

---

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/Achref-dot-afk/AI-Powered-Chatbot-Interface.git
cd AI-Powered-Chatbot-Interface
```
2. Start the app:
```bash
## On linux run
sudo chmod +x ./scripts/run.sh
./scripts/run.sh
## On windows run
cd backend && npm start
cd .. && cd frontend && npm run dev
```

## Api endpoint details 
We divided our backend into three endpoints : (**User** endpoint for user specific operations, **Auth** endpoint for authentication specific operations and **Chat** endpoint for Messages and Ai interactions)
- Auth :
  - /api/auth/signup : Endpoint for signing up users
  - /api/auth/signin : Endpoint for user login
- User :
  - /api/user/:userId : Endpoint for changing user language preference when needed
- Chat :
  - /api/chat/conversation/:conversationId : Endpoint for the chat messages between the Ai assistant and the user(communication and loading messages)
  - /api/chat/user/:userId : Endpoint used for specific user conversations
  - /api/chat : Endpoint used for starting a new conversation which dosen't need a conversation id 

## Implementation of i18n
We used i18n for switching between arabic and english languages and that included : 
- Handling error messages gracefully and Ai responses
- Handling frontend components 

Usage of "en.json" and "ar.json" stored in **backend/i18n** folder : 
```bash
## ar.json
{
  "errors": {
    "missingConversationId": "المعرف الخاص بالمحادثة مطلوب.",
    "conversationNotFound": "المحادثة غير موجودة.",
    "unauthorized": "يجب عليك تسجيل الدخول للوصول إلى هذا المورد.",
    "dbError": "حدث خطأ في قاعدة البيانات.",
    "missingMessage": "الرسالة مطلوبة.",
    "serverError": "حدث خطأ داخلي في الخادم."
  },
  "chat": {
    "welcome": "مرحبًا! كيف يمكنني مساعدتك اليوم؟",
    "fallback": "عذرًا، لم أفهم ذلك.",
    "aiError": "حدث خطأ أثناء التواصل مع خدمة الذكاء الاصطناعي.",
    "userNotFound": "المستخدم غير موجود."
  },
  "auth" : {
    "missingFields": "البريد الإلكتروني، كلمة المرور، واللغة مطلوبة.",
    "invalidLanguage": "يجب أن تكون اللغة 'en' أو 'ar'.",
    "userExists": "المستخدم موجود بالفعل.",
    "dbError": "حدث خطأ في قاعدة البيانات أثناء معالجة طلبك.",
    "invalidCredentials": "بيانات الاعتماد غير صحيحة. يرجى التحقق من بريدك الإلكتروني أو كلمة المرور.",
    "missingCredentials": "البريد الإلكتروني وكلمة المرور مطلوبة.",
    "serverError": "حدث خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى لاحقًا.",
    "logoutSuccess": "تم تسجيل الخروج بنجاح (يجب على العميل حذف الرمز)."
  }
}

```

```bash
## en.json
{
  "errors": {
    "missingConversationId": "conversationId is required.",
    "conversationNotFound": "Conversation not found.",
    "unauthorized": "You must be logged in to access this resource.",
    "dbError": "A database error occurred.",
    "missingMessage": "Message is required.",
    "serverError": "An internal server error occurred."
  },
  "chat": {
    "welcome": "Welcome! How can I help you today?",
    "fallback": "Sorry, I didn’t understand that.",
    "aiError": "There was an error communicating with the AI service.",
    "userNotFound": "User not found."
  },
  "auth": {
    "missingFields": "Email, password, and language are required.",
    "invalidLanguage": "Language must be 'en' or 'ar'.",
    "userExists": "User already exists.",
    "dbError": "A database error occurred while processing your request.",
    "invalidCredentials": "Invalid credentials. Please check your email or password.",
    "missingCredentials": "Email and password are required.",
    "serverError": "An internal server error occurred. Please try again later.",
    "logoutSuccess": "Sign out successful (client should delete token)."
  }
}

```

For the frontend we statically changed the components of UI elements(buttons, form text,...) using objects : 
```bash
# Example
  const translations = {
    en: {
      welcome: "Welcome to MyChat",
      description: "Experience intelligent conversations powered by AI. Sign in or create an account to get started.",
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "Enter your email",
      errors: {
        emailRequired: "Email is required",
        emailInvalid: "Email is invalid",
        passwordRequired: "Password is required",
        ...
      }
    },
    ar: {
      welcome: "مرحباً بك في MyChat",
      description: "جرب المحادثات الذكية المدعومة بالذكاء الاصطناعي. سجل الدخول أو أنشئ حساباً للبدء.",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      errors: {
        emailRequired: "البريد الإلكتروني مطلوب",
        emailInvalid: "البريد الإلكتروني غير صالح",
        passwordRequired: "كلمة المرور مطلوبة",
        ...
      }
    }
  };

```

Switching is done due to a button in the login page to controll UI elements and another button in the chat page to control chat language and user preference.

## Usage Guide 

- Environment : (Environment variables that need to be set before starting the project)
    - **PORT** : Backend port (If not provided it will be set to 5000)
    - **JWT_SECRET** : Secret to use for JWT
    - **OPENROUTER_API_KEY** : Api key to run openrouter's models
1. Acess the application :
- Through the link "mydomain.com"
2. Create an account : 
- You will encounter first the landing page -> Click **get started** button to go to login page
- Provide:
    - Email
    - Password
    - Preferred Language (currently supported: English en, Arabic ar).
    - Submit the form to create your account
3. Log in :
- Use your credentials to log in
- If successful, you will be redirected automatically to the **Chat page**
4. Start a new conversation :
- Click ➕ New Chat in the sidebar to start a new conversation
- Type your message in the input box and press Enter or click Send
- The assistant will reply in the same language you selected during signup (you can switch later in settings)
5. Manage Conversations :
- All your chats are listed in the sidebar
- Asummary is generated automatically based on chat messages
- Click a conversation to open it and see its chat history
- You can add new messages to it 
- You can search to filter old conversations
6. Change language : 
- Click the language switch in the sidebar to change language of AI responses, later the conversations will be translated with their summaries
- Instant update to AI new responses
7. Change AI model : 
- Three models were used and user can switch by clicking the model button which is set by default to **x-ai/grok-4-fast:free** and the response will be based on that model selected
- Models used in this demo (x-ai/grok-4-fast:free,mistralai/mistral-small-3.2-24b-instruct:free,x-ai/grok-4-turbo:free)
- They support both languages we used in this implementation
8. Download conversation : 
- User can download a conversation into **PDF** file by clicking the button **Download PDF**
9. Log out : 
- User can logout and its JWT token will be removed after he press the logout button on the bottom right and he will be redirected to the Home landing page

## AI tools used for development 
- Github copilot : AI assistant used for coding integrated in **vscode** environment
- Chatgpt : To improve productivity and simplify complex UI designs 
