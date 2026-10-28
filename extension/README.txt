OVERTURE HOSTED EXTENSION 1.4.0

Hosted app: https://overture-nd0q.onrender.com
Chrome extension ID: geemcgoloailklihnpghgindneohhccc

INSTALL
1. Extract this ZIP into a permanent folder.
2. Open chrome://extensions, turn Developer mode on, then choose Load unpacked.
3. Select the extracted folder containing manifest.json. If Overture is already loaded, remove its old unpacked entry first or reload it from this new folder.
4. Sign in to the hosted Overture app with Google. In Overture settings, connect your calendar and configure your own Claude key / private-call AI settings for semantic analysis.
5. Join a Google Meet call, turn on captions (CC), then click the Overture toolbar icon.
6. If prompted to sign in, choose Open connected call panel. Sign in in that tab; it returns to this call. Keep this panel tab open during the call. The first-party tab is also the fallback for browser cookie restrictions.
7. If the meeting is on your calendar, Overture matches it automatically. Otherwise choose the correct call in the panel before speaking. No caption lookup occurs until a call is matched or selected.

DURING AND AFTER THE CALL
The extension reads visible Meet captions, preserving speaker names and correction IDs. It sends them only to your Overture account. It does not capture microphone or system audio. Tell participants you are taking AI notes.
The panel shows actual caption/connection state. People, companies, terms and call points appear as the hosted app processes them; unavailable lookup and uncertain identities must remain labeled. Leaving or closing the Meet tab finalizes the transcript already received. Keep the Overture panel open until final processing completes.

DEPLOYMENT REQUIREMENT
This extension requires the matching 1.4.0 hosted panel changes from the release's backend folder to be deployed. The extension ZIP alone cannot update the Render application. The original repository has not been overwritten or pushed by this release.

LIMITS
Google Meet CC must be enabled and observable in its page. Caption recognition can be wrong; short-lived DOM changes can be missed. This release has synthetic DOM, Chrome-message and local fake-HTTP integration coverage. A live authenticated Google Meet call has not been verified. No Zoom caption capture is included.
