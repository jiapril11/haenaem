// 욕설 필터링
const BLOCKED_WORDS = [
  // 한국어
  "씨발", "씨팔", "시발", "시팔", "ㅅㅂ", "ㅆㅂ",
  "개새끼", "새끼", "ㅅㄲ",
  "병신", "ㅂㅅ",
  "좆", "보지", "자지",
  "창녀", "창년", "갈보",
  "지랄", "ㅈㄹ",
  "꺼져", "닥쳐",
  "개년", "찐따", "등신",
  "미친놈", "미친년", "미친새끼",
  "개소리", "헛소리",
  // 영어
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy", "whore",
];

export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s+/g, "");
  return BLOCKED_WORDS.some((word) => normalized.includes(word));
}
