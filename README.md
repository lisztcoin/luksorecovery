# Angel - The Social Recovery Tool for Lukso UP

built by lisztcoin@, specifically for Lukso BUILD IT hackathon.

[View One Shot Demo on Youtube](https://www.youtube.com/watch?v=QO6JIqxG8SU)

[Try It Live on Vercel](https://luksorecovery.vercel.app/)

I highly encourage you to try it out to have your profile protected! You need to have UP extension installed and three profiles: main profile (that will be lost), guardian profile, and new owner profile. Please raise issues if you see any bug.

-----------

Angel is a robust and user friendly social recovery tool built for the Lukso ecosystem based on LSP 11 standards. It helps user create and manage an LSP 11 contract all through the Lukso extension.

Its functionalities include:

* Deploy LSP 11 contract and configure it for the user with just one click.
* Easy guardian, threshold and secret setup.
* Vote for new owner as a guardian. Multiple recovery process can co-exist so a guardian can vote multiple people if necessary.
* Reclaim ownership
* Robust error check and clear error messages for all possible error scenarios. (e.g. No LSP 11 contract deployed, wrong secret, wrong threshold, etc.)

------------

Important Code Pointers:

* [Pages folder](https://github.com/lisztcoin/luksorecovery/tree/main/src/pages): contains files that handle most of the logics. 
* [Global state](https://github.com/lisztcoin/luksorecovery/blob/main/src/store/store.ts): using jotai to manage global states
* [Web3 Context](https://github.com/lisztcoin/luksorecovery/blob/main/src/lib/hooks/use-connect.tsx): easy-to-use web3 Context
* [LSP 11 Contract](https://github.com/lukso-network/lsp-smart-contracts/tree/feat/SocialRecovery/contracts/LSP11BasicSocialRecovery): Using Lukso's implementation. My plan for extension is listed in the "Next Step" section. The contract is deployed on demand (see [demo](https://www.youtube.com/watch?v=QO6JIqxG8SU)).

------------

I believe the social recovery tool will be very useful as it solves the major wallet management painpoint. Therefore I'd like to continue to work on it after hackathon, with below plans:

* Guardian management. Add guardian removal capability.
* More advanced threshold mechanism to mitigate risks posed by malicious guardians.
* 

