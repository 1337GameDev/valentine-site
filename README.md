# Summary
A basic e-valentine site based on 11ty and pack11ty (template 11ty project). Meant as an example for a basic e-valentine to send to somebody.

The project begins with a basic 4-digit passcode, styled like iOS. 

:warning: **NOTE:** The contents of pages beyond the passcode can be XOR-encrypted, but this is **NOT** cryptographically secure -- this is purely meant to hide content from casual prying eyes, and from internet bots/search engine crawlers. **DO NOT** store any high-profile information using this method -- it is not seure. You have been warned.

# How to Build
1. Install NodeJS, and ensure NPM can be access via command-line
2. Clone repo
3. Open terminal/cmd and navigate to the project directory
4. run `npm -i`
5. run `npm start`
6. Open browser and navigate to `http://localhost:8080/`

# Configuration
The project can be customized in the `package.json` file that will be used during building of the project.

| Variable | Meaning |
| -------- | ------- |
| title | The title that will be displayed in browsers/bookmarks |
| sender_name | Who is sending the e-valentine, generally as pure-text |
| sender_display | A custom way to display the name of the sender -- including any html entities for fun display |
| recipient_name | Who is getting the e-valentine, generally as pure-text |
| recipient_display | A custom way to display the name of who is getting the e-valentine -- including any html entities for fun displays |
| basic_pass | A 4-digit passcode for the first screen, used to hide the contents except for who should have access. This "encryption" is **NOT** secure, but prevents basic entry / bot indexers / crawlers |
| xor_secret | The XOR passphrase to use to hide page contents from being plaintext. :warning: **This is NOT cryptographically secure -- don't use this for high-profile information.** |
| success_page_path | The path to navigate to once the passcode is accepted. |

# Relevant Projects
[Pack11ty](https://pack11ty.dev)

[Eleventy](www.11ty.dev/) 
