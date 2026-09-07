/**
 * Evening scenes. The Neville Goddard move, without the guru: lie down, drowsy, and live one short scene
 * in the first person as if it already happened, until it feels real. Then sleep on it.
 * Sex is clear, never explicit. Love is the point. Each scene ends in rest.
 */
export type Scene = { id: string; title: string; sub: string; free: boolean; lines: string[] };

export const SCENES: Scene[] = [
  {
    id: 'table', title: 'The table', sub: 'Dinner. Her, across from you.', free: true,
    lines: [
      'You are sitting at a small table. It is evening.',
      'There is a candle. Two glasses. The noise of a room that does not care about you, in the good way.',
      'She is across from you. She just laughed at something you said, and she is still smiling about it.',
      'You feel your shoulders drop. You did not know they were up.',
      'She reaches over and takes a piece of bread off your plate without asking.',
      'That is how you know. That is the whole thing. She is comfortable.',
      'You are not performing. You are not managing anything. You are just here.',
      'Feel the warmth of the room on your face. The weight of your arms on the table.',
      'She says, "This was good." You say, "Yeah." That is all it takes.',
      'Later, walking out, her hand finds yours like it has done it before.',
      'Stay here a moment. This is yours. Then let it go and sleep.',
    ],
  },
  {
    id: 'morning', title: 'Sunday morning', sub: 'Slow. Light through the curtain.', free: true,
    lines: [
      'You wake up and there is nowhere to be.',
      'The light is coming through the curtain the way it does at nine, soft and gold.',
      'There is someone breathing next to you. Slow. Still asleep.',
      'Her hair is on the pillow. Her hand is on your chest, not holding, just resting.',
      'You do not reach for the phone. You do not reach for anything.',
      'Your body is heavy in the good way. Rested. Used. Loved.',
      'You think about coffee, and about how you will make two.',
      'Nothing is owed this morning. Nothing is being built.',
      'Feel the sheet on your legs. The warmth of her along your side.',
      'This is the life you were meal prepping for. This is what the savings were for.',
      'Breathe it in. Let it be true. Then sleep.',
    ],
  },
  {
    id: 'walk', title: 'The walk home', sub: 'After the date. Streetlights.', free: true,
    lines: [
      'You are walking her home. It is late enough that the street is quiet.',
      'Streetlights. Leaves. Your footsteps together, not quite in time.',
      'She is telling you a story about her sister, and you are actually listening, not planning your next line.',
      'At the corner she slows down, and you slow down with her.',
      'The moment stretches. You do not rush it. You have learned not to rush it.',
      'She looks at you. You look back. Nobody has to say anything.',
      'You kiss her, and it is easy, because it was already decided somewhere back around the second coffee.',
      'She says, "Text me when you get home." You say you will, and you will.',
      'Walking back alone, your chest is warm, and the street is yours.',
      'Feel that. That is what wanting is for. Then rest.',
    ],
  },
  {
    id: 'hand', title: 'Her hand', sub: 'Just this. Nothing to prove.', free: false,
    lines: [
      'You are on the couch. A film neither of you is really watching.',
      'She is against you. Her head on your shoulder. Her hand in yours.',
      'Her thumb moves across your knuckle, slow, without thinking about it.',
      'You are not thinking about anything either. This is what it is like to be at rest with someone.',
      'Your breathing slows to match hers. You did not decide to; it just happens.',
      'Nothing here has to be earned. Nothing is being tested.',
      'She falls asleep against you. You do not move, because why would you.',
      'Feel the weight of her. The warmth. The trust in that weight.',
      'This is what your body was asking for, all those nights. It was asking for this.',
      'Let it be real. Then sleep.',
    ],
  },
  {
    id: 'chosen', title: 'Being chosen', sub: 'She picked you. On purpose.', free: false,
    lines: [
      'You are at a party, or a wedding, or someone\'s kitchen. It does not matter.',
      'The room is loud and you are talking to a friend.',
      'Across the room, she catches your eye, and she does not look away.',
      'She crosses the room. She could have talked to anyone. She comes to you.',
      '"There you are," she says, like you were the one she was looking for. Because you were.',
      'Feel it land. You were chosen. Not settled for. Chosen.',
      'She slides her arm through yours. You keep talking to your friend, but your whole body knows where she is.',
      'You did not have to be finished. You had to be here.',
      'Stay in it. Then rest.',
    ],
  },
  {
    id: 'rest', title: 'Rest earned', sub: 'A whole day off, and nobody died.', free: false,
    lines: [
      'It is Saturday. You slept until you woke up.',
      'There is no alarm. There is no list. The business is fine without you for one day, and you know it.',
      'You make coffee slowly. You drink it outside, in the sun, with your shirt open at the collar.',
      'Your phone is inside. You do not miss it.',
      'A friend texts about later. You say yes. You do not check the calendar first.',
      'Feel your body unclench, muscle by muscle. Jaw. Shoulders. Hands.',
      'This is not lazy. This is a man who knows the work will be there Monday, and so will he.',
      'You lie in the grass and the sun is on your face and there is nothing you are supposed to be doing.',
      'This is what the money was for. Let it be enough. Then sleep.',
    ],
  },
  {
    id: 'business', title: 'The business, alive', sub: 'It has life in it again, because you do.', free: false,
    lines: [
      'You open the laptop and, for once, you want to.',
      'There is an idea in you. It has been waiting since you started sleeping properly.',
      'You work for an hour and it is the good kind, the kind where the time goes.',
      'You close the laptop at six because someone is expecting you for dinner, and that matters more.',
      'The business is better for it. It has a man behind it now, not a ghost.',
      'Feel the difference: work you are choosing, not work you are hiding in.',
      'Tomorrow you will do another hour. And then you will go live the rest of the day.',
      'Rest on that.',
    ],
  },
  {
    id: 'friends', title: 'The table full', sub: 'The friends came back.', free: false,
    lines: [
      'Your kitchen. Six people. You cooked, badly, and nobody cares.',
      'Someone is telling a story too loud. Someone else is laughing before the ending.',
      'She is next to you, holding your knee under the table like it is nothing.',
      'You look around and every one of these people chose to be here, in your house, on a Friday.',
      'This is what the years of preparing were for. Not the business. This.',
      'Feel the noise. The warmth. The full room.',
      'Later, you will wash up together and she will flick water at you.',
      'Let it fill you. Then sleep.',
    ],
  },
  {
    id: 'porch', title: 'The porch', sub: 'Years from now. Still her.', free: false,
    lines: [
      'You are older. Not old. Older.',
      'A porch, or a balcony, or a step. Evening. A cold drink sweating in your hand.',
      'She comes out and sits down next to you without asking if she can.',
      'You have been together long enough that silence is comfortable.',
      'She puts her feet in your lap. You rub them without being asked.',
      'The sun goes down. Neither of you narrates it.',
      'Feel the years in it. The safety. The ordinary miracle of being known.',
      'This is the destination. It was never the screen. It was always this.',
      'Rest here.',
    ],
  },
  {
    id: 'enough', title: 'Enough', sub: 'For the night you feel behind.', free: false,
    lines: [
      'Lie still. Let the mattress hold all of you.',
      'Every man you compare yourself to is also lying in the dark somewhere, unsure.',
      'You have prepared. You have saved. You have shown up more than most.',
      'Tonight, nothing is required. Not even sleep. Sleep will come.',
      'Say it once, in your own head: I am enough to be loved as I am.',
      'You do not have to believe it yet. You have to say it until it sounds like your voice.',
      'Feel your hands open. Feel your jaw let go.',
      'Tomorrow, one real thing. Tonight, this.',
    ],
  },
  {
    id: 'date1', title: 'Before the date', sub: 'Four minutes, before you leave.', free: true,
    lines: [
      'Stand still for a second. Hands at your sides.',
      'You are not going to a test. You are going to meet a person.',
      'She said yes. Remember that. She wants to be there too.',
      'Your job tonight is not to impress her. It is to find out who she is.',
      'Ask about the thing she mentioned. Listen to the answer. Ask the next question.',
      'If there is a silence, let it be there. Silences are where people relax.',
      'You are allowed to be nervous. Nervous means you are alive and it matters.',
      'Breathe out. Long. Now go. The walk to the door is the hard part, and you are already at it.',
    ],
  },
  {
    id: 'after', title: 'After the date', sub: 'Whatever happened, this.', free: false,
    lines: [
      'It happened. That was the whole assignment.',
      'If it went well, feel it in your chest and do not overthink the text. One line tomorrow.',
      'If it did not, that is information, not a verdict. She was not your person. Good. Now you know.',
      'Either way, you sat across from a real woman and you were seen. Nothing on a screen can do that.',
      'You are further along tonight than you were this morning.',
      'Rest. Tomorrow you get to do this again if you want to.',
    ],
  },
];

export function scene(id: string): Scene {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

/** Tonight's suggested scene: rotates through what he has access to. */
export function tonightScene(dayIndex: number, pro: boolean): Scene {
  const pool = SCENES.filter((s) => (pro || s.free) && s.id !== 'date1' && s.id !== 'after');
  return pool[Math.abs(dayIndex) % pool.length];
}
