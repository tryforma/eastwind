"""Set Eastwind App Store metadata + screenshots via ASC API. Idempotent.
Run: cd ~/workspace/landed/.credentials && PYTHONPATH=. python3 ~/workspace/eastwind/store/asc_metadata.py <APP_ID> [SUB_ID ...]"""
import asc, json, os, glob, time, sys
APP=sys.argv[1]; SUBS=tuple(sys.argv[2:])
SHOTS=sorted(glob.glob('/Users/raymondzhao/workspace/eastwind/store/screenshots/0*.png'))
DESC="""For men who have fought lust and porn for years, quit and gone back, and are tired of apps that count their failures.

Eastwind does not count. It does not block. It does not lecture. There is no streak to break, no day counter, no guru and no program. The thing you reach for at night is hunger for something real: a woman, a friend, sun on your face, a night off. Nothing is missing in you. Something is missing around you, and that is easier to fix.

ONE REAL THING
Not a discipline, a life act. Send the message. Ask her for coffee with a day and a time. Call the friend you went quiet on. Eat lunch outside. Take the night off. Pick one; any size counts.

WHEN IT IS LOUD
Ninety seconds of company and a breath, then the question that matters: what is this actually hungry for? Touch, company, rest, excitement, escape. Each one has a real move you can make tonight or tomorrow morning.

SCENES
Lie down and live a short scene as if it already happened: the table, Sunday morning, the walk home, her hand, being chosen, rest earned, the porch. First person, present tense, one line at a time. Then sleep on it. Four minutes of calm before a date, and an after for whatever happened.

TALK
An older brother who went through this and came out into a real life. No name, no title. Ask him what to text her, whether to ask, what last night was really about, when to rest. He never asks what day you are on. He is an AI, not a therapist or a crisis line.

GO ON THE DATE
Permission first, then the practical part: an eight-point profile checklist, prompts written in your voice, the first message, asking, the date itself, and after. Plan a date and your phone reminds you two hours before. Pro adds photo notes: three honest fixes on any photo, no filters.

THE HARVEST
The only thing this app counts: warmth that actually happened. A laugh, a text back, a date, a friend, sun, rest. A sun that rises with three weeks of real life and never goes back to zero.

FREE FOREVER
The urge screen, one real thing a day, the harvest, the date guide, three scenes and fifteen messages a day. Everything that gets you through tonight.

EASTWIND PRO
Unlimited talk, every scene, photo notes and the morning line: monthly or yearly, each with a 7-day free trial. Payment is charged to your Apple ID account at confirmation of purchase after the trial. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel in your Apple ID settings.

Eastwind is for adults. It is a self-care tool, not therapy, medical advice or a crisis service. If it is dark tonight: 988 in the US, findahelpline.com elsewhere.

Terms of Use (EULA): https://tryforma.app/eastwind/terms.html
Privacy Policy: https://tryforma.app/eastwind/privacy.html"""
KEYWORDS="quit porn,porn addiction,nofap,lust,urge,dating,hinge,confidence,burnout,men,brother,self care"
PROMO="No streaks, no blockers, no guru. One real thing a day, a scene to live before sleep, someone to talk to who came through it, and permission to go on the date."
def ok(r,what):
    if 'data' in r: return r['data']
    print('FAIL',what,json.dumps(r)[:600]); return None
v=asc.api('GET',f'/v1/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=1&fields[appStoreVersions]=versionString,appStoreState')['data'][0]
VID=v['id']; print('version', v['attributes'])
locs=asc.api('GET',f'/v1/appStoreVersions/{VID}/appStoreVersionLocalizations')['data']
en=next((l for l in locs if l['attributes']['locale']=='en-US'),None)
attrs={'description':DESC,'keywords':KEYWORDS[:100],'promotionalText':PROMO[:170],'supportUrl':'https://tryforma.app/eastwind/','marketingUrl':'https://tryforma.app/eastwind/'}
if en: r=asc.api('PATCH',f"/v1/appStoreVersionLocalizations/{en['id']}",{'data':{'type':'appStoreVersionLocalizations','id':en['id'],'attributes':attrs}})
else: r=asc.api('POST','/v1/appStoreVersionLocalizations',{'data':{'type':'appStoreVersionLocalizations','attributes':dict(attrs,locale='en-US'),'relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':VID}}}}})
en=ok(r,'version loc'); print('version localization ok', en['id'] if en else '')
infos=asc.api('GET',f'/v1/apps/{APP}/appInfos')['data']
for info in infos:
    il=asc.api('GET',f"/v1/appInfos/{info['id']}/appInfoLocalizations")['data']
    l=next((x for x in il if x['attributes']['locale']=='en-US'),None)
    a={'subtitle':'Out of Lust, Into Life','privacyPolicyUrl':'https://tryforma.app/eastwind/privacy.html'}
    if l: r=asc.api('PATCH',f"/v1/appInfoLocalizations/{l['id']}",{'data':{'type':'appInfoLocalizations','id':l['id'],'attributes':a}})
    else: r=asc.api('POST','/v1/appInfoLocalizations',{'data':{'type':'appInfoLocalizations','attributes':dict(a,locale='en-US'),'relationships':{'appInfo':{'data':{'type':'appInfos','id':info['id']}}}}})
    print('appInfo loc', 'ok' if 'data' in r else json.dumps(r)[:300])
    r=asc.api('PATCH',f"/v1/appInfos/{info['id']}",{'data':{'type':'appInfos','id':info['id'],'relationships':{'primaryCategory':{'data':{'type':'appCategories','id':'LIFESTYLE'}},'secondaryCategory':{'data':{'type':'appCategories','id':'HEALTH_AND_FITNESS'}}}}})
    print('categories', 'ok' if 'data' in r else json.dumps(r)[:300])
    # Mature themes (lust/porn recovery), infrequent; sexual content NONE (the app produces none); 18+ override.
    ar=asc.api('GET',f"/v1/appInfos/{info['id']}/ageRatingDeclaration")
    if ar.get('data'):
        r=asc.api('PATCH',f"/v1/ageRatingDeclarations/{ar['data']['id']}",{'data':{'type':'ageRatingDeclarations','id':ar['data']['id'],'attributes':{'medicalOrTreatmentInformation':'NONE','healthOrWellnessTopics':True,'alcoholTobaccoOrDrugUseOrReferences':'NONE','violenceCartoonOrFantasy':'NONE','violenceRealistic':'NONE','violenceRealisticProlongedGraphicOrSadistic':'NONE','profanityOrCrudeHumor':'INFREQUENT_OR_MILD','matureOrSuggestiveThemes':'INFREQUENT_OR_MILD','horrorOrFearThemes':'NONE','sexualContentOrNudity':'NONE','sexualContentGraphicAndNudity':'NONE','gamblingSimulated':'NONE','contests':'NONE','gambling':False,'unrestrictedWebAccess':False,'kidsAgeBand':None,'lootBox':False,'advertising':False,'messagingAndChat':True,'userGeneratedContent':False,'parentalControls':False,'ageAssurance':False,'ageRatingOverrideV2':'EIGHTEEN_PLUS'}}})
        print('age rating', 'ok' if 'data' in r else json.dumps(r)[:300])
r=asc.api('PATCH',f'/v1/apps/{APP}',{'data':{'type':'apps','id':APP,'attributes':{'contentRightsDeclaration':'DOES_NOT_USE_THIRD_PARTY_CONTENT'}}}); print('content rights', 'ok' if 'data' in r else json.dumps(r)[:200])
r=asc.api('PATCH',f'/v1/appStoreVersions/{VID}',{'data':{'type':'appStoreVersions','id':VID,'attributes':{'copyright':'2026 RZ International LLC','releaseType':'AFTER_APPROVAL'}}}); print('version attrs', 'ok' if 'data' in r else json.dumps(r)[:200])
rd=asc.api('GET',f'/v1/appStoreVersions/{VID}/appStoreReviewDetail')
ra={'contactFirstName':'Ruihao','contactLastName':'Zhao','contactPhone':'+14155550100','contactEmail':'ray@thezenithlabs.com','demoAccountRequired':False,'notes':"Eastwind is a self-care app for adult men recovering from compulsive porn use and lust. No account, no sign-in. Onboarding asks where the user is, what he has been preparing with, a first name and an optional warm memory, shows a permission page, then the paywall (monthly or yearly, 7-day free trial); tap 'Continue free' for the free tier, which includes the whole daily loop: one real thing, the urge screen, three evening scenes, the date guide, the harvest, and 15 chat messages a day. Pro adds unlimited chat, every scene, photo notes and a daily reminder.\n\nThe chat ('Talk') is an AI assistant (Google Gemini via our server at tryforma.app/api/eastwind) in the voice of an older brother. It produces no sexual or explicit content and declines requests for it (tested); it never counts days or shames; it shows crisis resources (988 / findahelpline.com) on risk language; if told the user is under 18 it ends the conversation and points to a trusted adult. Messages are sent to our server and Google to generate the reply and are not stored. Photo notes (Pro) sends one user-chosen photo to the same backend for three composition/lighting notes and does not store it.\n\nThe imagery in the app is AI-generated, non-explicit, fully clothed, and depicts adults. The app contains no nudity or sexual content. Age rating is set to 18+ because the subject matter (porn addiction recovery, dating) is mature. Guideline 1.4.1: the app is not medical advice and says so in onboarding, Settings and the paywall.\n\nAll data is stored on the device; there is no server-side user record beyond a random per-install identifier used to count free-tier messages, purged after 30 days."}
if rd.get('data'): r=asc.api('PATCH',f"/v1/appStoreReviewDetails/{rd['data']['id']}",{'data':{'type':'appStoreReviewDetails','id':rd['data']['id'],'attributes':ra}})
else: r=asc.api('POST','/v1/appStoreReviewDetails',{'data':{'type':'appStoreReviewDetails','attributes':ra,'relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':VID}}}}})
print('review detail', 'ok' if 'data' in r else json.dumps(r)[:300])
if en and SHOTS:
    sets=asc.api('GET',f"/v1/appStoreVersionLocalizations/{en['id']}/appScreenshotSets?fields[appScreenshotSets]=screenshotDisplayType")['data']
    st=next((s for s in sets if s['attributes']['screenshotDisplayType']=='APP_IPHONE_67'),None)
    if not st: st=ok(asc.api('POST','/v1/appScreenshotSets',{'data':{'type':'appScreenshotSets','attributes':{'screenshotDisplayType':'APP_IPHONE_67'},'relationships':{'appStoreVersionLocalization':{'data':{'type':'appStoreVersionLocalizations','id':en['id']}}}}}),'set')
    have=[x['attributes']['fileName'] for x in asc.api('GET',f"/v1/appScreenshotSets/{st['id']}/appScreenshots?fields[appScreenshots]=fileName")['data']]
    for f in SHOTS:
        if os.path.basename(f) in have: continue
        r=asc.upload_asset('/v1/appScreenshots',{'data':{'type':'appScreenshots','attributes':{'fileName':os.path.basename(f)},'relationships':{'appScreenshotSet':{'data':{'type':'appScreenshotSets','id':st['id']}}}}},f,'appScreenshots')
        print('  shot', os.path.basename(f), 'ok' if 'data' in r else json.dumps(r)[:200])
for sid in SUBS:
    cur=asc.api('GET',f'/v1/subscriptions/{sid}/appStoreReviewScreenshot')
    if cur.get('data'): print('sub', sid, 'review shot exists'); continue
    if not SHOTS: continue
    r=asc.upload_asset('/v1/subscriptionAppStoreReviewScreenshots',{'data':{'type':'subscriptionAppStoreReviewScreenshots','attributes':{'fileName':'02.png'},'relationships':{'subscription':{'data':{'type':'subscriptions','id':sid}}}}},SHOTS[1],'subscriptionAppStoreReviewScreenshots')
    print('sub', sid, 'review shot', 'ok' if 'data' in r else json.dumps(r)[:300])
time.sleep(3)
for sid in SUBS:
    print('sub state', asc.api('GET',f'/v1/subscriptions/{sid}?fields[subscriptions]=name,state')['data']['attributes'])
print('DONE')
