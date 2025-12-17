import { PrismaClient } from "@prisma/client";
import path from "path";
import { readFile } from "fs/promises";

const db = new PrismaClient();

type QuestionSeed = {
  type: "mcq" | "short_answer";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
};

type LessonSeed = {
  title: string;
  slug: string;
  file: string;
  order: number;
  questions: QuestionSeed[];
};

type TopicSeed = {
  title: string;
  description: string;
  order: number;
  lessons: LessonSeed[];
};

type RitualSeed = {
  title: string;
  description: string;
  cadence: "daily" | "weekly";
  order: number;
};

const rituals: RitualSeed[] = [
  {
    title: "20-second hug",
    description: "A long hug lowers stress and builds safety through oxytocin.",
    cadence: "daily",
    order: 1,
  },
  {
    title: "10-minute check-in",
    description: "Short, focused conversation to stay emotionally connected.",
    cadence: "daily",
    order: 2,
  },
  {
    title: "One appreciation",
    description: "Share one specific gratitude to build goodwill and warmth.",
    cadence: "daily",
    order: 3,
  },
  {
    title: "Prayer or grounding moment",
    description: "A brief spiritual or mindful pause to reconnect as a team.",
    cadence: "daily",
    order: 4,
  },
  {
    title: "At-home date",
    description: "Protected time together for fun and conversation.",
    cadence: "weekly",
    order: 1,
  },
  {
    title: "Sensate focus practice",
    description: "Non-demand touch session to build safety and presence.",
    cadence: "weekly",
    order: 2,
  },
  {
    title: "Weekly planning check-in",
    description: "Align schedules, needs, and a realistic intimacy plan.",
    cadence: "weekly",
    order: 3,
  },
];

const topics: TopicSeed[] = [
  {
    title: "Communication Foundations",
    description:
      "Master emotional connection through research-backed communication strategies.",
    order: 1,
    lessons: [
      {
        title: "Active Listening and Emotional Bids",
        slug: "active-listening",
        file: "communication-active-listening.md",
        order: 1,
        questions: [
          {
            type: "mcq",
            question: "What is a bid for connection in Gottman's research?",
            options: [
              "An attempt to connect emotionally",
              "A way to win an argument",
              "A form of manipulation",
              "A scripted romantic gesture",
            ],
            correctAnswer: "0",
            explanation:
              "A bid is any verbal or nonverbal attempt to connect, such as sharing a thought or seeking attention.",
            order: 1,
          },
          {
            type: "mcq",
            question: "Which response is an example of turning toward a bid?",
            options: [
              "Rolling your eyes",
              "Ignoring the comment",
              "Saying, 'Tell me more about that'",
              "Changing the subject",
            ],
            correctAnswer: "2",
            explanation:
              "Turning toward means acknowledging and engaging the bid with interest or care.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "Why is validation different from agreement?",
            correctAnswer:
              "Validation acknowledges the feeling as real without necessarily agreeing with the content or conclusion.",
            explanation:
              "Validation communicates understanding of emotion, while agreement is about sharing the same view.",
            order: 3,
          },
          {
            type: "mcq",
            question: "What is a good first step if you notice you are flooded during a conflict?",
            options: [
              "Push through to finish the argument",
              "Take a short break to self-soothe",
              "List all the problems at once",
              "Use sarcasm to lighten the mood",
            ],
            correctAnswer: "1",
            explanation:
              "A pause allows the nervous system to settle so you can return with more clarity.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "Give one example of a micro-response that turns toward a bid.",
            correctAnswer:
              "Examples include a nod, a brief touch, or saying 'That makes sense' or 'Tell me more.'",
            explanation:
              "Small responses signal care and build the emotional bank account over time.",
            order: 5,
          },
        ],
      },
      {
        title: "Repair Attempts and Gentle De-escalation",
        slug: "repair-attempts",
        file: "communication-repair-attempts.md",
        order: 2,
        questions: [
          {
            type: "mcq",
            question: "Which statement best reflects a gentle start-up?",
            options: [
              "You never listen to me.",
              "I felt dismissed when we switched topics quickly.",
              "You are always defensive.",
              "This is all your fault.",
            ],
            correctAnswer: "1",
            explanation:
              "Gentle start-ups focus on specific feelings and observations rather than blame.",
            order: 1,
          },
          {
            type: "mcq",
            question: "Which of the following is one of Gottman's Four Horsemen?",
            options: [
              "Curiosity",
              "Contempt",
              "Gratitude",
              "Playfulness",
            ],
            correctAnswer: "1",
            explanation:
              "Contempt is one of the Four Horsemen that predict relationship distress.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "What is a repair attempt?",
            correctAnswer:
              "A repair attempt is any action or phrase that de-escalates tension and signals a desire to reconnect.",
            explanation:
              "Repairs can be small, like humor or a soft tone, but they shift the conversation back to safety.",
            order: 3,
          },
          {
            type: "mcq",
            question: "Which sign suggests you might be flooded?",
            options: [
              "Calm breathing and curiosity",
              "Racing heart and narrowed thinking",
              "Clear memory of details",
              "Feeling playful",
            ],
            correctAnswer: "1",
            explanation:
              "Flooding includes physiological activation that reduces listening and empathy.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "Write one repair phrase you could use in conflict.",
            correctAnswer:
              "Examples: 'Can we start over?' or 'I care about you and want to fix this.'",
            explanation:
              "Repair phrases acknowledge tension and invite reconnection.",
            order: 5,
          },
        ],
      },
    ],
  },
  {
    title: "Understanding Desire",
    description:
      "Learn how desire works through dual control theory and responsive desire models.",
    order: 2,
    lessons: [
      {
        title: "The Dual Control Model of Arousal",
        slug: "dual-control",
        file: "desire-dual-control.md",
        order: 1,
        questions: [
          {
            type: "mcq",
            question: "The dual control model describes which two systems?",
            options: [
              "Memory and attention",
              "Excitation and inhibition",
              "Attachment and avoidance",
              "Intimacy and independence",
            ],
            correctAnswer: "1",
            explanation:
              "Bancroft and Janssen describe accelerators (excitation) and brakes (inhibition).",
            order: 1,
          },
          {
            type: "mcq",
            question: "What is true about brakes in the dual control model?",
            options: [
              "They never override accelerators",
              "They are only physical",
              "They can shut down arousal even when desire is present",
              "They only apply early in relationships",
            ],
            correctAnswer: "2",
            explanation:
              "Stress or safety concerns can activate brakes and reduce arousal.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "Name one accelerator and one brake for arousal.",
            correctAnswer:
              "Accelerator: feeling relaxed or affectionate touch. Brake: stress, fatigue, or feeling rushed.",
            explanation:
              "Accelerators and brakes can be physical, emotional, or contextual.",
            order: 3,
          },
          {
            type: "mcq",
            question: "How does clear consent affect the brakes?",
            options: [
              "It increases pressure",
              "It makes brakes stronger",
              "It releases brakes by increasing safety",
              "It has no effect",
            ],
            correctAnswer: "2",
            explanation:
              "Consent signals safety, which calms inhibition and supports arousal.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "Why does context matter for arousal?",
            correctAnswer:
              "Context can activate or quiet brakes; safe, supportive context makes arousal more likely.",
            explanation:
              "Arousal is not only about attraction; it is shaped by environment and stress levels.",
            order: 5,
          },
        ],
      },
      {
        title: "Responsive Desire and the Basson Model",
        slug: "responsive-desire",
        file: "desire-responsive.md",
        order: 2,
        questions: [
          {
            type: "mcq",
            question: "Responsive desire most often appears after which conditions?",
            options: [
              "A sudden craving",
              "Feeling safe, connected, and relaxed",
              "Winning an argument",
              "Avoiding emotional closeness",
            ],
            correctAnswer: "1",
            explanation:
              "Responsive desire emerges when context and connection are supportive.",
            order: 1,
          },
          {
            type: "mcq",
            question: "Basson's model is best described as:",
            options: [
              "A strict linear progression",
              "A circular model emphasizing intimacy and context",
              "A model that excludes emotional closeness",
              "A model that requires spontaneous desire",
            ],
            correctAnswer: "1",
            explanation:
              "Basson highlights emotional connection and responsive desire in a circular process.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "What is the difference between spontaneous and responsive desire?",
            correctAnswer:
              "Spontaneous desire appears without prompting; responsive desire grows after connection or stimulation begins.",
            explanation:
              "Both patterns are common and healthy; they simply start differently.",
            order: 3,
          },
          {
            type: "mcq",
            question: "Which statement reflects consent-based thinking?",
            options: [
              "If I am aroused, I must continue",
              "Arousal automatically means consent",
              "Consent can be given or withdrawn at any time",
              "Consent is only needed once",
            ],
            correctAnswer: "2",
            explanation:
              "Consent is ongoing and independent from arousal.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "Name one element of a supportive context for desire.",
            correctAnswer:
              "Examples include reduced distractions, time, emotional attunement, or non-demand touch.",
            explanation:
              "Supportive context reduces pressure and increases the likelihood of desire.",
            order: 5,
          },
        ],
      },
    ],
  },
  {
    title: "Mindful Intimacy",
    description: "Build presence, consent, and trust through mindfulness practices.",
    order: 3,
    lessons: [
      {
        title: "Mindfulness and Sensate Focus",
        slug: "sensate-focus",
        file: "mindful-sensate-focus.md",
        order: 1,
        questions: [
          {
            type: "mcq",
            question: "What is the primary goal of sensate focus?",
            options: [
              "Achieving a specific outcome",
              "Exploring sensation without performance goals",
              "Testing compatibility",
              "Avoiding communication",
            ],
            correctAnswer: "1",
            explanation:
              "Sensate focus centers on awareness and connection, not performance.",
            order: 1,
          },
          {
            type: "mcq",
            question: "The non-demand frame means:",
            options: [
              "There is no consent required",
              "One partner decides the pace",
              "There is no goal to go further than agreed",
              "The session must be long",
            ],
            correctAnswer: "2",
            explanation:
              "Non-demand means no pressure for outcomes beyond the agreement.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "Write one mindful check-in question you could use during touch.",
            correctAnswer:
              "Examples: 'How is this pressure?' or 'Would you like more of that?'",
            explanation:
              "Check-ins reinforce consent and help partners stay attuned.",
            order: 3,
          },
          {
            type: "mcq",
            question: "If performance anxiety shows up, what is a helpful response?",
            options: [
              "Push for an outcome",
              "Return attention to breath or sensation",
              "Ignore it and keep going",
              "Critique yourself",
            ],
            correctAnswer: "1",
            explanation:
              "Mindful attention reduces pressure and supports regulation.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "What happens in early sensate focus stages?",
            correctAnswer:
              "Partners focus on non-demand, non-genital touch and simply notice sensations.",
            explanation:
              "Early stages build safety before progressing to more intimate touch.",
            order: 5,
          },
        ],
      },
      {
        title: "Attunement, Trust, and Rituals of Connection",
        slug: "attunement",
        file: "mindful-attunement.md",
        order: 2,
        questions: [
          {
            type: "mcq",
            question: "Attunement is best defined as:",
            options: [
              "Perfect agreement",
              "Feeling seen and emotionally understood",
              "Avoiding conflict",
              "Always being available",
            ],
            correctAnswer: "1",
            explanation:
              "Attunement means responding to emotional signals with care and presence.",
            order: 1,
          },
          {
            type: "mcq",
            question: "Rituals of connection are:",
            options: [
              "Large, occasional celebrations",
              "Repeated small practices that signal closeness",
              "Rules that control behavior",
              "A replacement for consent",
            ],
            correctAnswer: "1",
            explanation:
              "Rituals are small, repeatable behaviors that build predictability and safety.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "Give an example of a bid for connection.",
            correctAnswer:
              "Examples include sharing a story, asking for a hug, or showing a photo.",
            explanation:
              "Bids are small invitations to connect emotionally.",
            order: 3,
          },
          {
            type: "mcq",
            question: "What is a helpful way to repair a moment of disconnection?",
            options: [
              "Pretend it did not happen",
              "Name it and invite reconnection",
              "Use sarcasm",
              "Wait indefinitely",
            ],
            correctAnswer: "1",
            explanation:
              "Naming the disconnection and inviting repair restores safety.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "Describe a simple daily ritual of connection.",
            correctAnswer:
              "A brief check-in at dinner or a short walk together each evening.",
            explanation:
              "Rituals are short, consistent moments that reinforce closeness.",
            order: 5,
          },
        ],
      },
    ],
  },
  {
    title: "Connected Intimacy Plan",
    description:
      "Turn a comprehensive plan into daily, weekly, and monthly habits that build safety and spark.",
    order: 4,
    lessons: [
      {
        title: "Desire Differences and Context Reset",
        slug: "desire-context-reset",
        file: "connected-desire-context.md",
        order: 1,
        questions: [
          {
            type: "mcq",
            question: "Responsive desire usually appears after:",
            options: [
              "An immediate urge or fantasy",
              "Connection, safety, and gentle stimulation",
              "A strict schedule only",
              "Conflict or stress",
            ],
            correctAnswer: "1",
            explanation:
              "Responsive desire tends to grow after connection and relaxed arousal begin.",
            order: 1,
          },
          {
            type: "mcq",
            question: "In the dual control model, brakes are best described as:",
            options: [
              "Signals that increase arousal",
              "Irrelevant to desire",
              "Signals that reduce openness to intimacy",
              "Only physical factors",
            ],
            correctAnswer: "2",
            explanation:
              "Brakes are cues like stress, fear, or pressure that reduce arousal and desire.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "Name one practical way to reduce a desire brake.",
            correctAnswer:
              "Examples: reduce stress with rest, lock the door for privacy, or start with non-demand touch.",
            explanation:
              "Reducing a brake often opens the path for desire to grow naturally.",
            order: 3,
          },
          {
            type: "mcq",
            question: "Why is consent considered a brake-release mechanism?",
            options: [
              "It increases pressure",
              "It signals safety and reduces anxiety",
              "It removes emotional connection",
              "It makes desire automatic",
            ],
            correctAnswer: "1",
            explanation:
              "Consent communicates safety, which calms the nervous system and reduces inhibition.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "What does a team mindset change during desire mismatch?",
            correctAnswer:
              "It reframes the mismatch as a shared challenge rather than a personal flaw or blame.",
            explanation:
              "A team mindset invites collaboration and reduces shame or resentment.",
            order: 5,
          },
        ],
      },
      {
        title: "Connection Plan and Intimacy Rituals",
        slug: "connection-plan",
        file: "connected-intimacy-plan.md",
        order: 2,
        questions: [
          {
            type: "mcq",
            question: "The weekly layer of the plan is best described as:",
            options: [
              "A strict daily rule",
              "One protected intimacy window with flexible options",
              "Only novelty exercises",
              "Avoiding scheduling",
            ],
            correctAnswer: "1",
            explanation:
              "A protected weekly window builds trust while staying flexible about intensity.",
            order: 1,
          },
          {
            type: "mcq",
            question: "What is a key benefit of a shared intimacy menu?",
            options: [
              "It removes consent",
              "It creates a rigid checklist",
              "It supports flexible options across energy levels",
              "It eliminates communication",
            ],
            correctAnswer: "2",
            explanation:
              "A menu offers low-, medium-, and high-energy options without pressure.",
            order: 2,
          },
          {
            type: "short_answer",
            question: "Give one example of a daily micro-connection ritual.",
            correctAnswer:
              "Examples: a 10-minute check-in, a 20-second hug, or a brief appreciation.",
            explanation:
              "Small daily rituals create safety and make intimacy more likely over time.",
            order: 3,
          },
          {
            type: "mcq",
            question: "Sensate focus emphasizes:",
            options: [
              "Performance outcomes",
              "Sensation awareness without demand",
              "Competition",
              "Speed and intensity",
            ],
            correctAnswer: "1",
            explanation:
              "Sensate focus reduces pressure by focusing on touch and sensation.",
            order: 4,
          },
          {
            type: "short_answer",
            question: "What is one example of a monthly novelty practice?",
            correctAnswer:
              "Examples: a new setting, a new sensory element, or trying a new intimacy exercise.",
            explanation:
              "Small novelty keeps the spark alive without overwhelming either partner.",
            order: 5,
          },
        ],
      },
    ],
  },
];

async function loadLessonContent(fileName: string) {
  const filePath = path.join(process.cwd(), "content", "lessons", fileName);
  return readFile(filePath, "utf-8");
}

async function main() {
  const topicCount = await db.topic.count();
  const ritualCount = await db.ritual.count();

  if (topicCount === 0) {
    for (const topic of topics) {
      await db.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          order: topic.order,
          lessons: {
            create: await Promise.all(
              topic.lessons.map(async (lesson) => ({
                title: lesson.title,
                slug: lesson.slug,
                content: await loadLessonContent(lesson.file),
                order: lesson.order,
                questions: {
                  create: lesson.questions.map((question) => ({
                    type: question.type,
                    question: question.question,
                    options: question.options
                      ? JSON.stringify(question.options)
                      : null,
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation,
                    order: question.order,
                  })),
                },
              }))
            ),
          },
        },
      });
    }
  }

  if (ritualCount === 0) {
    await db.ritual.createMany({
      data: rituals,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
