import { Situation } from '../logic/types';

/**
 * The morning line. One a day, in his voice. Rotates by day so the same line does not show twice in a fortnight.
 * Rules for every line: no counting, no fighting, no shame, no titles. One real move or one true thing.
 */
export const MORNING: string[] = [
  'Morning. You do not have to fight anything today. Go outside once, talk to one person. That is the whole job.',
  'The thing you reach for at night is hunger for something real. Real is available. It is just slower.',
  'Burned out is not weak. It is what happens when you feed everyone and nobody feeds you. Today, get fed.',
  'You have been preparing for a life. Today you get to live one hour of it.',
  'Nothing is missing in you. Something is missing around you. That is easier to fix.',
  'The plan was never to become a monk. The plan was to become a man someone comes home to.',
  'You are allowed to want her. Wanting is not the problem. Wanting a screen instead of a woman is just a detour.',
  'Send one message today that mentions something specific about her. Then put the phone down and go live.',
  'Rest is not a reward for finishing. Nothing ever finishes. Rest is how you stay alive long enough to enjoy any of it.',
  'The business does not need you harder. It needs you alive. A man with a Saturday is more interesting than a man with a spreadsheet.',
  'Last night is over. It does not get a vote on this morning.',
  'Nobody is grading you. Nobody is counting. There is just today, and it is warm out.',
  'You have saved money. You have cooked for yourself. Now cook for someone.',
  'Ask her for coffee. A day, a time, a place. That is all bravery is.',
  'The hardest part of a date is the walk to the door. Everything after that is just two people.',
  'You cannot think your way into a warm life. You have to go get in it, cold, and let it warm you.',
  'Call a friend today. Not to talk about any of this. Just to hear a voice that is glad it is you.',
  'Every man I know who came through this came through it by adding, not by subtracting. Add one thing today.',
  'Sun on your face for ten minutes. No phone. It sounds like nothing. It is not nothing.',
  'The urge will come tonight. Fine. It is a hungry kid. Feed it real food before it gets there.',
  'She does not need you finished. She needs you present. Show up unfinished.',
  'You have been living like a man in training camp for a fight that is never scheduled. The fight is not coming. The life is.',
  'Say yes to the thing today that you would normally say "maybe later" to.',
  'The version of you that gets the girl is not a better version. It is this one, outside, talking.',
  'Take the night off. Whatever you were going to grind through can wait. You cannot.',
  'A slow morning with coffee is not laziness. It is the first fruit.',
  'If today feels heavy, the job is smaller, not bigger. One text. One block. One window open.',
  'Being seen is scary. Being unseen is worse, and you have been doing it for years. Try the other one.',
  'You do not owe anyone an explanation for wanting a woman in your life. Go get one. Kindly.',
  'What you are looking for at 1am is somebody. Somebody is at the coffee shop at 9am.',
  'The screen is a picture of a meal. Go eat.',
  'Today: one thing for you that produces nothing. A walk, a nap, a song. Not a single deliverable.',
  'She is going to like you for the parts you keep apologising for. Stop apologising, start showing up.',
  'A man who rests well is easy to love. A man who never stops is hard to find.',
  'The date does not have to go well. It has to happen. Going well is a skill; happening is a decision.',
  'You are not behind. You are early. Most men never even try.',
  'One real thing today. Then let the rest of the day be whatever it is.',
  'Your body is asking for touch, warmth, company. Those are three real things you can go get.',
  'Do not build the business tonight. Sit somewhere with people in it.',
  'Every fruit counts, even the tiny ones. Especially the tiny ones.',
  'You have carried this alone for a long time. You do not have to carry it alone today.',
  'Take her somewhere with daylight. A walk, a coffee, a market. Let the sun do half the talking.',
];

/** A shorter second line, tuned to what he told us. */
export const SITUATION_LINES: Record<Situation, string[]> = {
  years: ['Years of fighting is years of proof that fighting is not the way. We are going to add instead.', 'You are not weak. You have been trying to win a war that only ends when you leave the battlefield.'],
  cycle: ['No streak here. No counter. Nothing to break. Just a life to add to.', 'The apps counted the days you failed. We are going to count the days you lived.'],
  burnout: ['Your work has been feeding everyone but you. Today, one thing goes in your direction.', 'Relief is not the enemy. Cheap relief is. We are going to find the expensive kind: a nap, a walk, a person.'],
  lonely: ['Evenings are long alone. We will start filling them, one person at a time.', 'You are not unlovable. You are unreached. Reaching is a skill, and it starts with one message.'],
  want: ['Scared is the right feeling. It means it matters. Go anyway.', 'Being bad at dating is how everyone starts. It is not a verdict. It is a Tuesday.'],
};

export function morningLine(dayIndex: number): string {
  return MORNING[Math.abs(dayIndex) % MORNING.length];
}

export function situationLine(situation: Situation, dayIndex: number): string {
  const list = SITUATION_LINES[situation];
  return list[Math.abs(dayIndex) % list.length];
}

/** Shown on the urge screen while the timer runs. Calm, not stern. */
export const URGE_LINES: string[] = [
  'Okay. You opened this instead. That is already the move.',
  'Nothing is wrong with you. Something in you is hungry.',
  'Breathe out longer than you breathe in.',
  'This wave is about ninety seconds long. You have sat through worse.',
  'You are not fighting it. You are letting it pass through the room.',
  'Hands off the phone after this. Palms on your knees.',
  'What is it actually asking for? Touch. Company. Rest. Excitement. Escape.',
  'You can go get the real one. Tonight, or tomorrow morning.',
  'Still here. Still yours. Nothing was lost.',
];

/** What the hunger usually is, and one real move for each. */
export const HUNGERS: { id: string; label: string; move: string; kind: 'her' | 'friend' | 'sun' | 'rest' | 'brave' }[] = [
  { id: 'touch', label: 'Touch', move: 'Hot shower, then bed with a heavy blanket. Tomorrow, book the massage or plan the date. Touch is real and it is available.', kind: 'her' },
  { id: 'company', label: 'Company', move: 'Text one person right now: "you up? how was your day." Then put the phone face down and wait for the buzz.', kind: 'friend' },
  { id: 'rest', label: 'Rest', move: 'You are exhausted, not aroused. Lights off, no screen, ten deep breaths. Sleep is the thing you actually want.', kind: 'rest' },
  { id: 'excite', label: 'Excitement', move: 'Your life is too small this week. Open Hinge and send one specific message, or plan Saturday with a friend. Then close it.', kind: 'brave' },
  { id: 'escape', label: 'Escape', move: 'Something is heavy. Walk around the block, even in the dark, even in socks. Come back and write one line about what it is.', kind: 'sun' },
];
