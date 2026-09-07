# Eastwind — finish the App Store submission

Everything below the first step is scripted. The first step needs a signed-in App Store Connect session (Ray's password + 2FA).

1. **Create the app record** (ASC web, signed in): Apps → "+" → New App.
   Platform iOS · Name `Eastwind: Out of Lust, Into Life` · Primary language English (U.S.) · Bundle ID `com.formaz.eastwind` (698NTG94CF) · SKU `eastwind-out-of-lust-2026` · Full Access.
   Then: App Privacy → Data collected: User ID (App Functionality, not linked), Purchase History (not linked), Other User Content (chat messages; App Functionality, not linked, not used for tracking), Photos or Videos (Pro photo notes; App Functionality, not linked) → Publish.
   Note the app id (10 digits) = `APP`.

2. Subscriptions (group + monthly $9.99 / yearly $49.99 + 175 territories + 7-day trials):
   `cd ~/workspace/landed/.credentials && PYTHONPATH=. python3 ~/workspace/eastwind_subs.py APP` → prints `GROUP` and the two sub ids.

3. Metadata, categories, 18+ age rating, review notes, 6 screenshots, sub review screenshots:
   `PYTHONPATH=. python3 ~/workspace/eastwind/store/asc_metadata.py APP SUB_MONTHLY SUB_YEARLY`

4. RevenueCat: project "Eastwind", App Store app with bundle com.formaz.eastwind (ASC keys XDCWGD6622 + B6AH39GJ57), import products com.formaz.eastwind.pro.monthly / .yearly, entitlement `pro`, offering `default` ($rc_monthly / $rc_annual). Put the iOS SDK key into eas.json `EXPO_PUBLIC_REVENUECAT_IOS_KEY` and the RC **public** key into the Vercel env `EASTWIND_RC_PUBLIC_KEY` (forma project) so the backend can verify Pro.

5. eas.json: set `submit.production.ios.ascAppId` to APP, commit, push.

6. Build + upload: `gh workflow run eastwind-ios-build.yml -R tryforma/forma -f ref=main -f submit=true` (or build then `eastwind-ios-upload.yml -f run_id=<id>`). Wait for the build to show `VALID` in ASC (`asc_submit.py --dry-run` prints builds).

7. Submit: `PYTHONPATH=. python3 ~/workspace/eastwind/store/asc_submit.py APP GROUP SUB_MONTHLY SUB_YEARLY`
   If the subs are not in the submission: in ASC, each subscription page → "Add for Review" → the Draft iOS Submission, then re-run.

8. Add Eastwind to the review-watch cron, and flip tryforma.app/eastwind/ + the umbrella card from "Coming soon" to the App Store link on approval.

Screenshots: `node store/shots.js` (expo web on :8088; ?demo=today|talk|urge|dates|scene|fruits&snap=1) → `python3 store/compose.py` → store/screenshots/01–06.png.
