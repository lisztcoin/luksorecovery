# Angel - The Social Recovery Tool for Lukso UP

built by lisztcoin@, specifically for Lukso BUILD IT hackathon.

[View One Shot Demo on Youtube](https://www.youtube.com/watch?v=QO6JIqxG8SU)

[Try It Live on Vercel](https://luksorecovery.vercel.app/)

I highly encourage you to try it out to have your profile protected! You need to have UP extension installed and three profiles: main profile (that will be lost), guardian profile, and new owner profile. Please raise issues if you see any bug.

-----------

Angel is a robust and user friendly social recovery tool built for the Lukso ecosystem based on LSP 11 standards. It helps user create and manage an LSP 11 contract all through the Lukso extension.

Its functionalities include:

* Deploy LSP 11 contract and configure it for the user with just one click.
* Easy guardian, threshold and secret setup. Add or Remove guardian.
* Vote for new owner as a guardian. Multiple recovery process can co-exist so a guardian can vote multiple people if necessary.
* Reclaim ownership.
* Robust error check and clear error messages for all possible error scenarios. (e.g. detecting whether LSP 11 contract is deployed for the profile, wrong secret, wrong threshold, etc.)

------------

Important Code Pointers:

* [Pages folder](https://github.com/lisztcoin/luksorecovery/tree/main/src/pages): contains files that handle most of the logics. 
* [Global state](https://github.com/lisztcoin/luksorecovery/blob/main/src/store/store.ts): using jotai to manage global states
* [Web3 Context](https://github.com/lisztcoin/luksorecovery/blob/main/src/lib/hooks/use-connect.tsx): easy-to-use web3 Context
* [LSP 11 Contract](https://github.com/lukso-network/lsp-smart-contracts/tree/feat/SocialRecovery/contracts/LSP11BasicSocialRecovery): Using Lukso's implementation. the website utilized every functionalities currently supported. My plan for extension is listed in the "Next Step" section. The contract is deployed on demand so there's no fixed deployment address. (see [demo](https://www.youtube.com/watch?v=QO6JIqxG8SU)).

------------

I believe the social recovery tool will be very useful as it solves the major wallet management painpoint. Therefore I'd like to continue to work on it after hackathon.

Eamples include:

* More advanced threshold mechanism to mitigate risks posed by malicious guardians.
* Multiple Question-Answer like secret instead of a single secret string.
* Guardian can have ratings so their vote's pwoer can be different

------------

Local Dev Instruction

* yarn
* yarn dev

------------

Final Notes

I would like to thank Yamen for answering people's (including mine) questions in the Discord related to social recovery. Those advice have been very important for me to finish the project.

I was originally using ethers.js to handle everything, but unfortunately it doesn't work well with the extension. The error message will always be "Estimate Gas" without specific reason, and profile's setData call will always fail. I managed to switch to web3.js and it worked out.