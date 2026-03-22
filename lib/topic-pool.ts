// R3ALSON HitCraft — 가사 주제 추천 시스템
// 단어 블록 기반: 매번 다른 조합을 랜덤 생성

// ===== 타입 정의 =====
export type TopicCategory = {
  id: string;
  label: string;
  emoji: string;
  subThemes: SubTheme[];
  genreWeights: Record<string, number>;
};

export type SubTheme = {
  id: string;
  label: string;
  tags: string[];
};

export type WordBlock = {
  text: string;
  tags: string[];
};

export type HookPattern = {
  id: string;
  label: string;
  structure: string;
  tags: string[];
};

export type WritingTechnique = {
  id: string;
  label: string;
  desc: string;
  tags: string[];
};

export type TopicRecommendation = {
  subTheme: SubTheme;
  technique: WritingTechnique;
  objects: string[];
  places: string[];
  times: string[];
  body: string[];
  senses: string[];
  actions: string[];
  sounds: string[];
  hookPattern: HookPattern;
};

// ===== 대분류 + 중분류 (8 × 5 = 40) =====
export var TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: "love", label: "사랑/설렘", emoji: "\uD83D\uDC97",
    genreWeights: { "pop": 1, "r&b": 1, "indie pop": 0.9, "dream pop": 0.8, "bedroom pop": 0.8, "k-pop": 0.9, "acoustic": 0.7, "folk": 0.6, "jazz": 0.5, "hip hop": 0.3 },
    subThemes: [
      { id: "first-flutter", label: "첫 떨림", tags: ["설렘", "긴장", "시작", "순수"] },
      { id: "push-pull", label: "밀당/줄다리기", tags: ["긴장", "게임", "심리", "관계"] },
      { id: "deep-confession", label: "깊은 고백", tags: ["고백", "용기", "진심", "결심"] },
      { id: "secret-love", label: "비밀 연애", tags: ["숨김", "비밀", "이중", "긴장"] },
      { id: "different-temp", label: "서로 다른 온도", tags: ["차이", "갈등", "온도", "거리"] }
    ]
  },
  {
    id: "breakup", label: "이별/상실", emoji: "\uD83C\uDF19",
    genreWeights: { "r&b": 1, "pop": 0.9, "indie pop": 0.9, "hip hop": 0.7, "rock": 0.7, "acoustic": 0.8, "ambient": 0.6, "folk": 0.7, "jazz": 0.5, "dream pop": 0.8 },
    subThemes: [
      { id: "just-after", label: "이별 직후", tags: ["충격", "멍", "공허", "정지"] },
      { id: "cant-forget", label: "잊으려 해도", tags: ["반복", "기억", "잔상", "중독"] },
      { id: "regret", label: "미련과 후회", tags: ["후회", "미련", "되감기", "만약"] },
      { id: "growth-after", label: "이별 후 성장", tags: ["성장", "수용", "전환", "새벽"] },
      { id: "eternal-absence", label: "영원한 부재", tags: ["부재", "사별", "빈자리", "영원"] }
    ]
  },
  {
    id: "self", label: "자아/성장", emoji: "\uD83D\uDD25",
    genreWeights: { "hip hop": 1, "rock": 0.9, "trap": 0.9, "indie rock": 0.7, "pop": 0.6, "r&b": 0.5, "alternative rock": 0.8, "punk rock": 0.8, "drill": 0.7, "phonk": 0.6 },
    subThemes: [
      { id: "prove-myself", label: "자기증명", tags: ["증명", "인정", "실력", "독립"] },
      { id: "from-bottom", label: "바닥에서 올라서기", tags: ["바닥", "회복", "역전", "생존"] },
      { id: "identity", label: "정체성 찾기", tags: ["정체성", "진짜", "가면", "내면"] },
      { id: "inner-fight", label: "내면의 싸움", tags: ["갈등", "불안", "두려움", "싸움"] },
      { id: "quiet-confidence", label: "겸손한 자신감", tags: ["겸손", "확신", "조용", "단단"] }
    ]
  },
  {
    id: "night-city", label: "밤/도시", emoji: "\uD83C\uDF03",
    genreWeights: { "hip hop": 1, "trap": 0.9, "lo-fi hip hop": 1, "r&b": 0.8, "edm": 0.7, "house": 0.7, "deep house": 0.9, "synthwave": 0.9, "dark ambient": 0.8, "dream pop": 0.7 },
    subThemes: [
      { id: "3am-alone", label: "새벽 3시 혼자", tags: ["새벽", "고독", "불면", "정적"] },
      { id: "city-lights", label: "도시 불빛 아래", tags: ["도시", "불빛", "거리", "익명"] },
      { id: "club-party", label: "클럽/파티", tags: ["파티", "에너지", "군중", "음악"] },
      { id: "night-drive", label: "야간 드라이브", tags: ["운전", "도로", "탈출", "속도"] },
      { id: "rooftop", label: "옥상 위", tags: ["높이", "도시위", "바람", "고요"] }
    ]
  },
  {
    id: "freedom", label: "자유/탈출", emoji: "\uD83D\uDE80",
    genreWeights: { "rock": 1, "indie rock": 0.9, "alternative rock": 0.9, "punk rock": 1, "pop": 0.7, "edm": 0.7, "hip hop": 0.6, "folk": 0.8, "acoustic": 0.6, "trance": 0.7 },
    subThemes: [
      { id: "escape-routine", label: "일상 탈출", tags: ["탈출", "반복", "권태", "출발"] },
      { id: "wandering", label: "여행/방랑", tags: ["여행", "길", "낯선", "발견"] },
      { id: "escape-past", label: "과거에서 벗어나기", tags: ["과거", "해방", "전환", "끊기"] },
      { id: "break-chains", label: "속박 깨기", tags: ["속박", "규칙", "파괴", "해방"] },
      { id: "unknown-world", label: "미지의 세계로", tags: ["미지", "모험", "가능성", "시작"] }
    ]
  },
  {
    id: "anger", label: "분노/저항", emoji: "\u26A1",
    genreWeights: { "hip hop": 1, "rock": 1, "heavy metal": 1, "punk rock": 1, "trap": 0.9, "drill": 0.9, "alternative rock": 0.8, "phonk": 0.8, "industrial": 0.7, "edm": 0.4 },
    subThemes: [
      { id: "injustice", label: "부당함에 맞서기", tags: ["부당", "정의", "싸움", "목소리"] },
      { id: "betrayal", label: "배신", tags: ["배신", "신뢰", "분노", "칼"] },
      { id: "system-resist", label: "시스템 저항", tags: ["시스템", "권력", "저항", "반항"] },
      { id: "quiet-revenge", label: "조용한 복수", tags: ["복수", "인내", "계획", "냉정"] },
      { id: "burning", label: "불꽃/폭발", tags: ["불꽃", "폭발", "해방", "파괴"] }
    ]
  },
  {
    id: "dream", label: "꿈/환상", emoji: "\uD83C\uDF0C",
    genreWeights: { "ambient": 1, "dream pop": 1, "dark ambient": 0.9, "ethereal pop": 1, "shoegaze": 0.9, "trance": 0.8, "chillwave": 0.8, "post rock": 0.7, "synth pop": 0.6, "new age": 0.9 },
    subThemes: [
      { id: "dreamworld", label: "몽환 세계", tags: ["몽환", "비현실", "부유", "안개"] },
      { id: "time-travel", label: "시간 여행", tags: ["시간", "과거", "미래", "반복"] },
      { id: "surreal-love", label: "비현실 사랑", tags: ["비현실", "사랑", "불가능", "환상"] },
      { id: "parallel", label: "평행 세계", tags: ["평행", "다른삶", "만약", "분기"] },
      { id: "between-sleep", label: "잠과 꿈 사이", tags: ["잠", "꿈", "경계", "반의식"] }
    ]
  },
  {
    id: "daily", label: "일상/회상", emoji: "\uD83C\uDF3F",
    genreWeights: { "folk": 1, "indie folk": 1, "lo-fi hip hop": 0.9, "acoustic": 1, "bedroom pop": 0.9, "indie pop": 0.8, "singer-songwriter": 1, "bossa nova": 0.7, "jazz": 0.6, "country": 0.7 },
    subThemes: [
      { id: "childhood", label: "어린 시절", tags: ["어린", "순수", "놀이", "기억"] },
      { id: "hometown", label: "고향", tags: ["고향", "돌아감", "변한", "뿌리"] },
      { id: "small-daily", label: "소소한 일상", tags: ["일상", "반복", "소소", "감사"] },
      { id: "seasons", label: "계절의 변화", tags: ["계절", "변화", "흐름", "순환"] },
      { id: "old-things", label: "오래된 물건의 기억", tags: ["물건", "기억", "낡은", "시간"] }
    ]
  }
];

// ===== 작법 (Writing Techniques) — 10가지 =====
export var WRITING_TECHNIQUES: WritingTechnique[] = [
  { id: "anaphora", label: "반복 쌓기", desc: "같은 구조를 반복하며 감정을 쌓아 하나의 결론으로 수렴", tags: ["그리움", "반복", "고백", "부재", "기억"] },
  { id: "onomatopoeia", label: "의성어/의태어 구조", desc: "소리 단어(툭, 쿵, 슬렁)가 곡 전체 뼈대를 잡음", tags: ["도시", "거리", "리듬", "감각", "밤"] },
  { id: "wordplay", label: "동음이의 말장난", desc: "한 글자/단어의 의미를 계속 전환하며 서사 전개", tags: ["증명", "싸움", "역전", "저항", "실력"] },
  { id: "extended-metaphor", label: "확장 비유", desc: "하나의 세계관(게임/기계/영화 등)으로 인생 전체를 비유", tags: ["정체성", "시스템", "게임", "비유", "세계관"] },
  { id: "minimalism", label: "극도의 절제", desc: "안 쓴 것으로 감정을 만듦. 짧은 문장, 여백의 힘", tags: ["순수", "이별", "부재", "고요", "회상"] },
  { id: "time-contrast", label: "시간 대비", desc: "과거/현재를 거울처럼 대비시켜 변화를 드러냄", tags: ["기억", "변화", "후회", "성장", "회상"] },
  { id: "sensory", label: "감각 묘사", desc: "시각/청각/촉각/후각으로 장면을 그려서 감정 전달", tags: ["계절", "장소", "기억", "설렘", "일상"] },
  { id: "scene-lock", label: "장면 고정", desc: "하나의 장소/행동에 카메라를 고정하고 관찰자 시점으로 서술", tags: ["도시", "밤", "거리", "고독", "산책"] },
  { id: "flip", label: "반전/뒤집기", desc: "같은 전제를 반대 결론으로 전환. 1곡으로 두 시각 제시", tags: ["역전", "전환", "자신감", "싸움", "성장"] },
  { id: "code-switch", label: "코드 스위칭", desc: "한국어/영어를 자연스럽게 전환하며 리듬 생성", tags: ["리듬", "도시", "현대", "에너지", "자유"] }
];

// ===== 단어 블록 풀 =====

// 사물 (200+)
export var OBJECTS: WordBlock[] = [
  // 음료/음식
  { text: "커피", tags: ["일상", "새벽", "고독"] },
  { text: "종이컵", tags: ["일상", "바닥", "허전"] },
  { text: "빈 병", tags: ["파티", "고독", "끝"] },
  { text: "캔맥주", tags: ["밤", "자유", "위로"] },
  { text: "라면 국물", tags: ["바닥", "일상", "고독"] },
  { text: "녹은 얼음", tags: ["시간", "변화", "끝"] },
  { text: "찬 물잔", tags: ["정적", "새벽", "깨어남"] },
  { text: "마른 빵", tags: ["바닥", "생존", "일상"] },
  // 전자기기
  { text: "깨진 화면", tags: ["이별", "분노", "파괴"] },
  { text: "꺼진 폰", tags: ["단절", "고독", "정적"] },
  { text: "읽씹 알림", tags: ["기다림", "긴장", "관계"] },
  { text: "이어폰 한쪽", tags: ["고독", "기억", "불완전"] },
  { text: "충전기 없는 폰", tags: ["불안", "시간", "바닥"] },
  { text: "삭제한 사진", tags: ["이별", "후회", "기억"] },
  { text: "새벽 알람", tags: ["반복", "일상", "피로"] },
  { text: "오래된 플레이리스트", tags: ["기억", "회상", "그리움"] },
  // 의류/소지품
  { text: "낡은 스니커즈", tags: ["여정", "바닥", "거리"] },
  { text: "후드 안 얼굴", tags: ["숨김", "고독", "도시"] },
  { text: "주머니 속 손", tags: ["긴장", "추위", "고독"] },
  { text: "풀린 신발끈", tags: ["방심", "일상", "무기력"] },
  { text: "빈 지갑", tags: ["바닥", "생존", "현실"] },
  { text: "구겨진 영수증", tags: ["기억", "흔적", "일상"] },
  { text: "떨어진 단추", tags: ["이별", "해체", "디테일"] },
  { text: "안 입는 재킷", tags: ["기억", "부재", "이별"] },
  { text: "접힌 우산", tags: ["대비", "고독", "비"] },
  { text: "벗어둔 모자", tags: ["쉼", "도착", "일상"] },
  // 문서/기록
  { text: "접힌 편지", tags: ["고백", "과거", "비밀"] },
  { text: "찢긴 메모", tags: ["분노", "후회", "결심"] },
  { text: "빈 노트", tags: ["시작", "가능성", "공허"] },
  { text: "연필 자국", tags: ["흔적", "기억", "지움"] },
  { text: "지운 문자", tags: ["후회", "말못함", "이별"] },
  { text: "미완성 가사", tags: ["창작", "과정", "불완전"] },
  { text: "오래된 티켓", tags: ["기억", "회상", "여행"] },
  { text: "여권 도장", tags: ["여행", "자유", "경험"] },
  // 빛/불
  { text: "가로등", tags: ["밤", "도시", "고독"] },
  { text: "간판 불빛", tags: ["도시", "밤", "익명"] },
  { text: "꺼진 촛불", tags: ["끝", "어둠", "관계"] },
  { text: "라이터 불꽃", tags: ["순간", "파괴", "시작"] },
  { text: "새벽빛", tags: ["시작", "희망", "전환"] },
  { text: "형광등 깜빡임", tags: ["불안", "반복", "일상"] },
  { text: "폰 화면 빛", tags: ["새벽", "고독", "연결"] },
  { text: "비상등", tags: ["위기", "경고", "긴장"] },
  { text: "달빛", tags: ["밤", "설렘", "고요"] },
  { text: "그림자", tags: ["자아", "숨김", "동반"] },
  // 가구/공간
  { text: "빈 의자", tags: ["부재", "기다림", "이별"] },
  { text: "닫힌 문", tags: ["거절", "끝", "경계"] },
  { text: "열린 창문", tags: ["자유", "바람", "전환"] },
  { text: "깨진 거울", tags: ["자아", "파괴", "직면"] },
  { text: "먼지 쌓인 선반", tags: ["시간", "방치", "기억"] },
  { text: "접힌 이불", tags: ["일상", "고독", "위로"] },
  { text: "빈 옷걸이", tags: ["부재", "이별", "공허"] },
  { text: "녹슨 자물쇠", tags: ["닫힘", "시간", "비밀"] },
  { text: "벽 시계", tags: ["시간", "반복", "정지"] },
  { text: "금 간 벽", tags: ["균열", "관계", "시간"] },
  // 자연/날씨
  { text: "빗방울", tags: ["감성", "이별", "정화"] },
  { text: "마른 잎", tags: ["끝", "계절", "변화"] },
  { text: "젖은 아스팔트", tags: ["도시", "비", "반사"] },
  { text: "안개", tags: ["몽환", "불확실", "경계"] },
  { text: "바람", tags: ["자유", "변화", "지나감"] },
  { text: "먼지", tags: ["시간", "방치", "바닥"] },
  { text: "눈 녹은 물", tags: ["변화", "끝", "시작"] },
  { text: "이슬", tags: ["새벽", "순수", "짧은"] },
  // 교통/이동
  { text: "새벽 택시", tags: ["이별", "도시", "탈출"] },
  { text: "막차", tags: ["마지막", "선택", "밤"] },
  { text: "빈 좌석", tags: ["고독", "부재", "이동"] },
  { text: "택시미터기", tags: ["시간", "돈", "거리"] },
  { text: "지하철 손잡이", tags: ["일상", "피로", "군중"] },
  { text: "버스 창문 김", tags: ["고독", "겨울", "내면"] },
  { text: "핸들", tags: ["방향", "선택", "운전"] },
  { text: "사이드미러", tags: ["과거", "되돌아봄", "반사"] },
  // 소비/상업
  { text: "편의점 불빛", tags: ["새벽", "도시", "고독"] },
  { text: "자판기 커피", tags: ["일상", "바닥", "위로"] },
  { text: "빈 장바구니", tags: ["공허", "일상", "혼자"] },
  { text: "가격표", tags: ["가치", "비교", "현실"] },
  { text: "포장 안 뜯은 선물", tags: ["미련", "기다림", "이별"] },
  // 음악/창작
  { text: "마이크", tags: ["표현", "무대", "목소리"] },
  { text: "헤드폰", tags: ["고립", "음악", "자기세계"] },
  { text: "찢긴 기타줄", tags: ["한계", "파괴", "열정"] },
  { text: "턴테이블", tags: ["리듬", "반복", "힙합"] },
  { text: "뮤트된 앰프", tags: ["침묵", "억제", "준비"] },
  // 도구/기계
  { text: "녹슨 볼트", tags: ["고장", "시간", "버텨냄"] },
  { text: "깨진 기어", tags: ["멈춤", "고장", "반복"] },
  { text: "닳은 열쇠", tags: ["시간", "출입", "반복"] },
  { text: "비어있는 프레임", tags: ["부재", "형식", "기억"] },
  { text: "풀린 태엽", tags: ["멈춤", "에너지", "끝"] },
  // 신체 관련 사물
  { text: "반창고", tags: ["상처", "위로", "일상"] },
  { text: "빈 약통", tags: ["고통", "바닥", "끝"] },
  { text: "안경 흠집", tags: ["시선", "시간", "흔적"] },
  { text: "지문 자국", tags: ["흔적", "존재", "증거"] },
  // 기타
  { text: "꺼진 TV", tags: ["고독", "정적", "일상"] },
  { text: "보관함 번호표", tags: ["보관", "기억", "임시"] },
  { text: "유통기한 지난 것", tags: ["시간", "끝", "놓침"] },
  { text: "빈 액자", tags: ["부재", "기억", "공허"] },
  { text: "풍선 바람 빠진", tags: ["끝", "허무", "파티후"] },
  { text: "깨진 유리", tags: ["파괴", "위험", "전환"] },
  { text: "줄 끊긴 연", tags: ["자유", "상실", "놓침"] },
  { text: "접힌 지도", tags: ["방향", "여행", "선택"] },
  { text: "마른 꽃", tags: ["기억", "시간", "아름다움끝"] },
  { text: "동전 하나", tags: ["바닥", "선택", "가치"] },
  { text: "비닐봉지", tags: ["바닥", "일상", "바람"] },
  { text: "스티커 떼낸 자리", tags: ["흔적", "이별", "남은것"] },
  { text: "먹다 만 음식", tags: ["중단", "방치", "일상"] },
  { text: "빈 통조림", tags: ["바닥", "생존", "비어있음"] }
];

// 장소 (80+)
export var PLACES: WordBlock[] = [
  { text: "옥상", tags: ["높이", "도시", "고독", "자유"] },
  { text: "골목", tags: ["도시", "숨김", "거리", "밤"] },
  { text: "주차장", tags: ["새벽", "고독", "정지", "도시"] },
  { text: "계단통", tags: ["중간", "에코", "이동", "건물"] },
  { text: "편의점 앞", tags: ["새벽", "도시", "고독", "일상"] },
  { text: "버스 정류장", tags: ["기다림", "이동", "일상", "비"] },
  { text: "지하철 안", tags: ["군중", "이동", "일상", "고독"] },
  { text: "고시원", tags: ["바닥", "고독", "생존", "좁음"] },
  { text: "세탁소", tags: ["일상", "반복", "기다림"] },
  { text: "빈 교실", tags: ["기억", "어린", "부재"] },
  { text: "놀이터", tags: ["어린", "기억", "텅빔"] },
  { text: "고가도로 밑", tags: ["도시", "소음", "숨김"] },
  { text: "빈 주유소", tags: ["도로", "밤", "정지"] },
  { text: "택시 뒷자석", tags: ["이동", "이별", "밤"] },
  { text: "공원 벤치", tags: ["고독", "쉼", "관찰"] },
  { text: "강변", tags: ["자유", "흐름", "감성"] },
  { text: "지하도", tags: ["지하", "에코", "도시", "숨김"] },
  { text: "빈 카페", tags: ["고독", "기다림", "도시"] },
  { text: "화장실 거울 앞", tags: ["자아", "직면", "숨김"] },
  { text: "엘리베이터", tags: ["밀폐", "침묵", "이동"] },
  { text: "옥탑방", tags: ["바닥", "고독", "시작"] },
  { text: "빈 무대", tags: ["꿈", "시작", "고독"] },
  { text: "녹음실", tags: ["창작", "밀폐", "진심"] },
  { text: "열린 도로", tags: ["자유", "속도", "탈출"] },
  { text: "공항 로비", tags: ["이별", "출발", "기다림"] },
  { text: "빈 체육관", tags: ["에코", "과거", "고독"] },
  { text: "아파트 복도", tags: ["일상", "반복", "익명"] },
  { text: "구름 위", tags: ["비행", "비현실", "자유"] },
  { text: "바닷가", tags: ["끝", "시작", "넓음", "자유"] },
  { text: "폐공장", tags: ["버려짐", "과거", "폐허"] },
  { text: "옛날 방", tags: ["기억", "어린", "변함"] },
  { text: "비 오는 거리", tags: ["이별", "감성", "도시"] },
  { text: "새벽 공원", tags: ["고독", "새벽", "고요"] },
  { text: "병원 복도", tags: ["불안", "기다림", "생존"] },
  { text: "슈퍼 앞 벤치", tags: ["동네", "일상", "관찰"] },
  { text: "지붕 위", tags: ["높이", "자유", "위험"] },
  { text: "빈 극장", tags: ["끝", "혼자", "어둠"] },
  { text: "창고", tags: ["숨김", "보관", "과거"] },
  { text: "터널", tags: ["통과", "어둠", "전환"] },
  { text: "신호등 앞", tags: ["기다림", "선택", "도시"] },
  { text: "철교", tags: ["이동", "경계", "높이"] },
  { text: "빈 수영장", tags: ["비어있음", "과거", "계절끝"] },
  { text: "건물 옥상 난간", tags: ["경계", "높이", "결심"] },
  { text: "길 끝", tags: ["끝", "선택", "전환"] }
];

// 시간 (40+)
export var TIMES: WordBlock[] = [
  { text: "새벽 4시", tags: ["새벽", "불면", "고독"] },
  { text: "퇴근길", tags: ["일상", "피로", "반복"] },
  { text: "비 오는 수요일", tags: ["일상", "감성", "무기력"] },
  { text: "여름 끝", tags: ["계절", "이별", "변화"] },
  { text: "생일 다음 날", tags: ["허전", "시간", "나이"] },
  { text: "일요일 오후", tags: ["여유", "고독", "일상"] },
  { text: "월요일 아침", tags: ["시작", "피로", "반복"] },
  { text: "해 지기 직전", tags: ["전환", "아름다움", "끝"] },
  { text: "자정 지난 후", tags: ["밤", "경계", "전환"] },
  { text: "첫눈 오는 날", tags: ["계절", "설렘", "기억"] },
  { text: "장마철", tags: ["비", "갇힘", "습함"] },
  { text: "이사하는 날", tags: ["변화", "이별", "시작"] },
  { text: "졸업 후 한 달", tags: ["전환", "불안", "자유"] },
  { text: "연락 끊긴 지 100일", tags: ["이별", "시간", "계산"] },
  { text: "새해 첫날", tags: ["시작", "결심", "비어있음"] },
  { text: "추석에 혼자", tags: ["고독", "가족", "거리"] },
  { text: "시험 끝난 밤", tags: ["해방", "공허", "전환"] },
  { text: "비행기 이륙 직전", tags: ["출발", "긴장", "변화"] },
  { text: "버스 놓친 아침", tags: ["일상", "실패", "기다림"] },
  { text: "오래된 사진 발견한 오후", tags: ["기억", "회상", "감성"] },
  { text: "정전된 밤", tags: ["어둠", "불안", "고요"] },
  { text: "벚꽃 지는 주", tags: ["계절", "짧음", "아름다움"] },
  { text: "33도 한낮", tags: ["여름", "답답", "에너지"] },
  { text: "아무도 없는 크리스마스", tags: ["고독", "기대", "기억"] },
  { text: "답장 기다리는 10분", tags: ["긴장", "기다림", "관계"] },
  { text: "면접 끝나고", tags: ["불안", "판단", "기다림"] },
  { text: "꿈에서 깬 직후", tags: ["경계", "비현실", "새벽"] },
  { text: "마지막 수업", tags: ["끝", "기억", "전환"] },
  { text: "가을 첫 바람", tags: ["계절", "변화", "감성"] },
  { text: "알바 끝난 새벽", tags: ["피로", "바닥", "일상"] }
];

// 신체/감각 (60+)
export var BODY_SENSES: WordBlock[] = [
  { text: "손끝", tags: ["촉각", "긴장", "디테일"] },
  { text: "발걸음", tags: ["이동", "리듬", "방향"] },
  { text: "숨결", tags: ["생존", "긴장", "가까움"] },
  { text: "눈빛", tags: ["감정", "소통", "진심"] },
  { text: "입꼬리", tags: ["미소", "숨김", "설렘"] },
  { text: "어깨", tags: ["무게", "책임", "기댐"] },
  { text: "목소리", tags: ["표현", "진심", "변화"] },
  { text: "심장 박동", tags: ["긴장", "생존", "떨림"] },
  { text: "발바닥", tags: ["현실", "닿음", "걸음"] },
  { text: "주먹", tags: ["분노", "결심", "참음"] },
  { text: "목젖", tags: ["삼킴", "참음", "울음"] },
  { text: "등", tags: ["떠남", "외면", "보호"] },
  { text: "무릎", tags: ["굴복", "피로", "기도"] },
  { text: "손톱 자국", tags: ["참음", "긴장", "흔적"] },
  { text: "멍든 팔", tags: ["상처", "숨김", "고통"] },
  { text: "갈라진 입술", tags: ["건조", "추위", "방치"] },
  { text: "감긴 눈", tags: ["쉼", "회피", "몽환"] },
  { text: "떨리는 턱", tags: ["추위", "두려움", "참음"] },
  { text: "꽉 쥔 이빨", tags: ["분노", "참음", "결심"] },
  { text: "축 처진 고개", tags: ["피로", "패배", "무기력"] },
  { text: "땀", tags: ["긴장", "노력", "에너지"] },
  { text: "눈물 자국", tags: ["슬픔", "흔적", "숨김"] },
  { text: "코끝", tags: ["추위", "감각", "감성"] },
  { text: "손목 맥박", tags: ["생존", "시간", "리듬"] },
  { text: "허리", tags: ["노동", "피로", "지탱"] },
  { text: "엄지 끝", tags: ["터치", "연결", "디테일"] }
];

// 감각 형용사 (60+)
export var SENSE_ADJECTIVES: WordBlock[] = [
  { text: "차가운", tags: ["이별", "겨울", "거리"] },
  { text: "바래진", tags: ["시간", "기억", "퇴색"] },
  { text: "녹슨", tags: ["시간", "방치", "오래됨"] },
  { text: "텁텁한", tags: ["답답", "갇힘", "감정"] },
  { text: "서늘한", tags: ["새벽", "긴장", "거리"] },
  { text: "눅눅한", tags: ["습함", "갇힘", "비"] },
  { text: "까끌한", tags: ["촉각", "불편", "현실"] },
  { text: "미지근한", tags: ["애매", "관계", "권태"] },
  { text: "뜨거운", tags: ["열정", "분노", "사랑"] },
  { text: "매캐한", tags: ["연기", "파괴", "기억"] },
  { text: "시린", tags: ["추위", "고통", "예민"] },
  { text: "희미한", tags: ["불확실", "기억", "거리"] },
  { text: "선명한", tags: ["기억", "감각", "확실"] },
  { text: "축축한", tags: ["비", "눈물", "습함"] },
  { text: "뻣뻣한", tags: ["긴장", "어색", "새로움"] },
  { text: "묵직한", tags: ["무게", "책임", "감정"] },
  { text: "쨍한", tags: ["밝음", "충격", "깨어남"] },
  { text: "흐릿한", tags: ["몽환", "기억", "불확실"] },
  { text: "거친", tags: ["분노", "날것", "표면"] },
  { text: "부드러운", tags: ["위로", "사랑", "부드러움"] },
  { text: "탁한", tags: ["혼탁", "피로", "갇힘"] },
  { text: "비릿한", tags: ["피", "상처", "현실"] },
  { text: "달콤쌉쌀한", tags: ["기억", "복합", "이별"] },
  { text: "싸늘한", tags: ["이별", "거절", "냉정"] },
  { text: "포근한", tags: ["위로", "기억", "따뜻"] },
  { text: "건조한", tags: ["메마름", "감정없음", "겨울"] },
  { text: "쓸쓸한", tags: ["고독", "가을", "이별"] },
  { text: "아련한", tags: ["기억", "몽환", "그리움"] },
  { text: "날카로운", tags: ["분노", "각성", "위험"] },
  { text: "느슨한", tags: ["여유", "풀림", "무방비"] },
  { text: "단단한", tags: ["결심", "자신감", "성장"] },
  { text: "얇은", tags: ["경계", "취약", "예민"] },
  { text: "무거운", tags: ["책임", "감정", "공기"] },
  { text: "가벼운", tags: ["해방", "자유", "시작"] }
];

// 동작 (80+)
export var ACTIONS: WordBlock[] = [
  { text: "스치다", tags: ["지나감", "순간", "미묘"] },
  { text: "멈추다", tags: ["정지", "결심", "충격"] },
  { text: "돌아보다", tags: ["미련", "과거", "확인"] },
  { text: "놓다", tags: ["이별", "포기", "해방"] },
  { text: "잡다", tags: ["집착", "연결", "시도"] },
  { text: "걷다", tags: ["이동", "일상", "사고"] },
  { text: "숨다", tags: ["숨김", "두려움", "보호"] },
  { text: "삼키다", tags: ["참음", "억제", "감정"] },
  { text: "접다", tags: ["포기", "정리", "보관"] },
  { text: "긁다", tags: ["초조", "표면", "드러냄"] },
  { text: "비우다", tags: ["정리", "해방", "시작"] },
  { text: "채우다", tags: ["보상", "시도", "가득"] },
  { text: "기울다", tags: ["불균형", "쏠림", "변화"] },
  { text: "스며들다", tags: ["서서히", "침투", "감정"] },
  { text: "흘리다", tags: ["놓침", "눈물", "흐름"] },
  { text: "깨다", tags: ["파괴", "각성", "시작"] },
  { text: "태우다", tags: ["파괴", "열정", "끝"] },
  { text: "묻다", tags: ["숨김", "질문", "땅"] },
  { text: "지우다", tags: ["삭제", "이별", "시도"] },
  { text: "새기다", tags: ["기록", "영원", "흔적"] },
  { text: "끌다", tags: ["지속", "인력", "무게"] },
  { text: "밀다", tags: ["거절", "거리두기", "힘"] },
  { text: "던지다", tags: ["포기", "분노", "결심"] },
  { text: "줍다", tags: ["발견", "겸손", "디테일"] },
  { text: "쌓다", tags: ["축적", "노력", "반복"] },
  { text: "허물다", tags: ["파괴", "해방", "변화"] },
  { text: "뒤집다", tags: ["반전", "분노", "전환"] },
  { text: "감다", tags: ["눈감기", "감싸기", "보호"] },
  { text: "풀다", tags: ["해제", "해방", "시작"] },
  { text: "꺼내다", tags: ["드러냄", "용기", "시작"] },
  { text: "닫다", tags: ["끝", "거절", "보호"] },
  { text: "열다", tags: ["시작", "용기", "가능성"] },
  { text: "기다리다", tags: ["인내", "기대", "고독"] },
  { text: "도망치다", tags: ["탈출", "두려움", "회피"] },
  { text: "부딪히다", tags: ["충돌", "직면", "현실"] },
  { text: "미끄러지다", tags: ["실수", "통제불가", "불안"] },
  { text: "매달리다", tags: ["집착", "생존", "한계"] },
  { text: "내려놓다", tags: ["포기", "수용", "성장"] },
  { text: "올라서다", tags: ["성장", "극복", "시작"] },
  { text: "무너지다", tags: ["파괴", "한계", "이별"] },
  { text: "일어서다", tags: ["회복", "결심", "시작"] },
  { text: "흔들리다", tags: ["불안", "갈등", "바람"] },
  { text: "버티다", tags: ["인내", "생존", "강인"] },
  { text: "되감다", tags: ["회상", "후회", "시간"] },
  { text: "베다", tags: ["상처", "날카로움", "순간"] }
];

// 소리 (40+)
export var SOUNDS: WordBlock[] = [
  { text: "툭", tags: ["떨어짐", "디테일", "순간"] },
  { text: "쿵", tags: ["심장", "무게", "충격"] },
  { text: "스르륵", tags: ["미끄러짐", "사라짐", "부드러움"] },
  { text: "파삭", tags: ["깨짐", "건조", "끝"] },
  { text: "텅", tags: ["비어있음", "에코", "공허"] },
  { text: "삐걱", tags: ["낡음", "마찰", "불편"] },
  { text: "탁", tags: ["놓음", "충격", "순간"] },
  { text: "퐁당", tags: ["물", "빠짐", "시작"] },
  { text: "쓱", tags: ["지나감", "빠름", "눈치"] },
  { text: "둥", tags: ["울림", "북소리", "무게"] },
  { text: "딸깍", tags: ["잠금", "스위치", "순간"] },
  { text: "드르륵", tags: ["열림", "커튼", "시작"] },
  { text: "사각", tags: ["글씨", "연필", "기록"] },
  { text: "휘이익", tags: ["바람", "지나감", "속도"] },
  { text: "뚝", tags: ["멈춤", "끊김", "결심"] },
  { text: "째깍", tags: ["시계", "시간", "반복"] },
  { text: "슥", tags: ["스침", "빠름", "미묘"] },
  { text: "우르르", tags: ["천둥", "무너짐", "힘"] },
  { text: "쏴아", tags: ["물", "비", "쏟아짐"] },
  { text: "바스락", tags: ["움직임", "디테일", "조용"] },
  { text: "끼이익", tags: ["브레이크", "마찰", "멈춤"] },
  { text: "톡", tags: ["가벼움", "노크", "시작"] },
  { text: "철컥", tags: ["잠금", "체포", "무거움"] },
  { text: "흐으윽", tags: ["한숨", "피로", "감정"] },
  { text: "뚝뚝", tags: ["물방울", "눈물", "반복"] },
  { text: "와장창", tags: ["파괴", "분노", "해방"] },
  { text: "살랑", tags: ["바람", "부드러움", "봄"] },
  { text: "쨍", tags: ["깨짐", "충격", "유리"] },
  { text: "부웅", tags: ["엔진", "시작", "에너지"] },
  { text: "치이익", tags: ["마찰", "브레이크", "긴장"] }
];

// ===== 훅 구조 패턴 (20+) — 문장이 아닌 뼈대만 =====
export var HOOK_PATTERNS: HookPattern[] = [
  { id: "hp1", label: "반복 축적형", structure: "[동작] + 해도 + [같은 감정 착지]", tags: ["그리움", "반복", "이별"] },
  { id: "hp2", label: "역설 선언형", structure: "[부정] + 인데 + [긍정 반전]", tags: ["성장", "자신감", "역전"] },
  { id: "hp3", label: "정체성 선언형", structure: "난 [명사] — [한 줄 정의]", tags: ["증명", "정체성", "자아"] },
  { id: "hp4", label: "시간 다리형", structure: "[과거 동작] + 처럼 + [현재 동작]", tags: ["기억", "대비", "변화"] },
  { id: "hp5", label: "소리 착지형", structure: "[소리] — [소리] — [감정 한 마디]", tags: ["리듬", "감각", "도시"] },
  { id: "hp6", label: "장소 고정형", structure: "[장소] + 에서 + [발견/깨달음]", tags: ["장소", "관찰", "고독"] },
  { id: "hp7", label: "부정 반복형", structure: "[안 했다/못 했다] 반복 + [진짜 이유]", tags: ["숨김", "고백", "참음"] },
  { id: "hp8", label: "명령/호소형", structure: "[동사 명령] — [이유 한 줄]", tags: ["절박", "호소", "진심"] },
  { id: "hp9", label: "질문형", structure: "[질문] + [대답 안 함 or 침묵]", tags: ["불확실", "갈등", "내면"] },
  { id: "hp10", label: "감각 대비형", structure: "[감각A] + 한데 + [감각B]", tags: ["복합", "대비", "혼란"] },
  { id: "hp11", label: "숫자/리스트형", structure: "[1,2,3...] 나열 + [결론 한 방]", tags: ["축적", "증거", "반복"] },
  { id: "hp12", label: "주어 전환형", structure: "[너는 ~했고] + [나는 ~했다]", tags: ["관계", "대비", "이별"] },
  { id: "hp13", label: "조건부형", structure: "[~하면] + [~할 텐데] + [현실]", tags: ["만약", "후회", "바람"] },
  { id: "hp14", label: "최소 존재형", structure: "[최소한의 행위] — 그게 [큰 의미]", tags: ["절제", "생존", "겸손"] },
  { id: "hp15", label: "비유 등치형", structure: "[A]가 [B]인 것처럼 + [C]도 [D]", tags: ["비유", "확장", "연결"] },
  { id: "hp16", label: "시제 충돌형", structure: "[과거형] + [현재형] + [미래형] 한 줄씩", tags: ["시간", "변화", "흐름"] },
  { id: "hp17", label: "삭제/남김형", structure: "[지운 것들] 나열 + [남은 것 하나]", tags: ["이별", "정리", "본질"] },
  { id: "hp18", label: "독백 폭발형", structure: "[조용한 문장들] + [갑자기 터지는 한 줄]", tags: ["폭발", "참다", "전환"] },
  { id: "hp19", label: "루프형", structure: "첫 줄 = 마지막 줄 (의미 변화)", tags: ["반복", "구조", "변화"] },
  { id: "hp20", label: "대화체형", structure: "[상대 말] + [내 속마음] 교차", tags: ["관계", "괴리", "숨김"] }
];

// ===== 연관 추천 함수 =====

// 태그 기반 매칭 점수 계산
function tagMatchScore(tagsA: string[], tagsB: string[]): number {
  var score = 0;
  for (var i = 0; i < tagsA.length; i++) {
    if (tagsB.indexOf(tagsA[i]) !== -1) score++;
  }
  return score;
}

// 배열에서 랜덤 N개 뽑기 (중복 없이)
function pickRandom<T>(arr: T[], count: number): T[] {
  var shuffled = arr.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 태그로 필터링 + 점수 정렬 후 상위 N개
function filterByTags<T extends { tags: string[] }>(pool: T[], targetTags: string[], count: number): T[] {
  var scored = pool.map(function(item) {
    return { item: item, score: tagMatchScore(item.tags, targetTags) };
  });
  scored.sort(function(a, b) { return b.score - a.score; });

  // 상위 매칭 중에서 랜덤으로 뽑기 (매번 다른 결과)
  var topItems = scored.filter(function(s) { return s.score > 0; }).map(function(s) { return s.item; });
  if (topItems.length === 0) topItems = pool.slice();
  return pickRandom(topItems, count);
}

// ===== 메인 추천 함수 =====
export function generateRecommendation(
  subTheme: SubTheme,
  technique: WritingTechnique,
  genre: string
): TopicRecommendation {
  var combinedTags = subTheme.tags.concat(technique.tags);

  return {
    subTheme: subTheme,
    technique: technique,
    objects: filterByTags(OBJECTS, combinedTags, 8).map(function(w) { return w.text; }),
    places: filterByTags(PLACES, combinedTags, 4).map(function(w) { return w.text; }),
    times: filterByTags(TIMES, combinedTags, 3).map(function(w) { return w.text; }),
    body: filterByTags(BODY_SENSES, combinedTags, 4).map(function(w) { return w.text; }),
    senses: filterByTags(SENSE_ADJECTIVES, combinedTags, 4).map(function(w) { return w.text; }),
    actions: filterByTags(ACTIONS, combinedTags, 5).map(function(w) { return w.text; }),
    sounds: filterByTags(SOUNDS, combinedTags, 3).map(function(w) { return w.text; }),
    hookPattern: pickRandom(filterByTags(HOOK_PATTERNS, combinedTags, 4), 1)[0]
  };
}

// 장르별 연관 중분류 추천
export function getRelatedSubThemes(current: SubTheme, genre: string): SubTheme[] {
  var allSubThemes: SubTheme[] = [];
  TOPIC_CATEGORIES.forEach(function(cat) {
    cat.subThemes.forEach(function(st) {
      if (st.id !== current.id) {
        allSubThemes.push(st);
      }
    });
  });
  return filterByTags(allSubThemes, current.tags, 3);
}

// 장르 가중치 기반 대분류 정렬
export function sortCategoriesByGenre(genre: string): TopicCategory[] {
  var genreLower = genre.toLowerCase();
  var sorted = TOPIC_CATEGORIES.slice();
  sorted.sort(function(a, b) {
    var scoreA = 0;
    var scoreB = 0;
    Object.keys(a.genreWeights).forEach(function(key) {
      if (genreLower.indexOf(key) !== -1) scoreA = Math.max(scoreA, a.genreWeights[key]);
    });
    Object.keys(b.genreWeights).forEach(function(key) {
      if (genreLower.indexOf(key) !== -1) scoreB = Math.max(scoreB, b.genreWeights[key]);
    });
    return scoreB - scoreA;
  });
  return sorted;
}

// 선택한 조합을 가사 생성 프롬프트 텍스트로 변환
export function buildTopicPromptText(
  subTheme: SubTheme,
  technique: WritingTechnique,
  selectedObjects: string[],
  selectedPlaces: string[],
  selectedTimes: string[],
  selectedBody: string[],
  selectedSenses: string[],
  selectedActions: string[],
  selectedSounds: string[],
  hookPattern: HookPattern
): string {
  var parts: string[] = [];
  parts.push("Theme: " + subTheme.label);
  parts.push("Writing technique: " + technique.label + " (" + technique.desc + ")");

  if (selectedObjects.length > 0) parts.push("Key objects/imagery: " + selectedObjects.join(", "));
  if (selectedPlaces.length > 0) parts.push("Setting: " + selectedPlaces.join(", "));
  if (selectedTimes.length > 0) parts.push("Time: " + selectedTimes.join(", "));
  if (selectedBody.length > 0) parts.push("Body/sensory details: " + selectedBody.join(", "));
  if (selectedSenses.length > 0) parts.push("Mood adjectives: " + selectedSenses.join(", "));
  if (selectedActions.length > 0) parts.push("Key actions: " + selectedActions.join(", "));
  if (selectedSounds.length > 0) parts.push("Sound words: " + selectedSounds.join(", "));
  parts.push("Hook structure: " + hookPattern.label + " — " + hookPattern.structure);

  return parts.join("\n");
}
