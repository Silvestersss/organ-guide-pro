import respiratoryImg from "@/assets/respiratory.jpg";
import circulatoryImg from "@/assets/circulatory.jpg";
import digestiveImg from "@/assets/digestive.jpg";
import nervousImg from "@/assets/nervous.jpg";
import urinaryImg from "@/assets/urinary.jpg";

export interface OrganSystem {
  id: string;
  name: string;
  nameEn: string;
  password: string;
  image: string;
  color: string;
  colorClass: string;
  icon: string;
  organs: string[];
  description: string;
  facts: { label: string; value: string }[];
  details: {
    function: string;
    commonDiseases: { name: string; description: string }[];
    healthTips: string[];
    funFacts: string[];
  };
}

export const organSystems: OrganSystem[] = [
  {
    id: "respiratory",
    name: "呼吸系統",
    nameEn: "Respiratory System",
    password: "IU1",
    image: respiratoryImg,
    color: "hsl(174 72% 46%)",
    colorClass: "text-medical-teal",
    icon: "Wind",
    organs: ["鼻腔", "咽喉", "氣管", "肺臟"],
    description: "呼吸系統負責氣體交換，將氧氣送入血液並排出二氧化碳。每天我們大約呼吸 20,000 次。",
    facts: [
      { label: "每日呼吸次數", value: "20,000+" },
      { label: "肺泡數量", value: "~4.8億" },
      { label: "氣體交換面積", value: "70 m²" },
      { label: "每分鐘空氣量", value: "6-8 L" },
    ],
    details: {
      function: "呼吸系統的主要功能是進行氣體交換。空氣通過鼻腔進入，經過咽喉和氣管，最終到達肺部的肺泡。在肺泡中，氧氣透過薄膜進入血液，同時二氧化碳從血液中釋出，通過呼氣排出體外。",
      commonDiseases: [
        { name: "哮喘", description: "氣道慢性發炎導致氣管收窄，引起呼吸困難、喘鳴和咳嗽。" },
        { name: "肺炎", description: "肺部感染導致肺泡充滿液體或膿液，引起發燒、咳嗽和呼吸困難。" },
        { name: "慢性阻塞性肺病 (COPD)", description: "長期氣道阻塞導致呼吸困難，多與吸煙有關。" },
        { name: "肺結核", description: "由結核桿菌引起的傳染病，主要影響肺部。" },
      ],
      healthTips: [
        "避免吸煙和二手煙",
        "定期進行有氧運動，增強肺活量",
        "保持室內空氣流通",
        "空氣質素差時佩戴口罩",
        "練習深呼吸運動",
      ],
      funFacts: [
        "左肺比右肺小，因為要為心臟留出空間",
        "如果將所有肺泡攤平，面積相當於一個網球場",
        "打噴嚏時空氣速度可達 160 km/h",
        "人每天呼出約 500 毫升的水蒸氣",
      ],
    },
  },
  {
    id: "circulatory",
    name: "循環系統",
    nameEn: "Circulatory System",
    password: "IU2",
    image: circulatoryImg,
    color: "hsl(0 70% 55%)",
    colorClass: "text-medical-red",
    icon: "Heart",
    organs: ["心臟", "動脈", "靜脈", "微血管", "血液"],
    description: "循環系統是人體的運輸網絡，負責將氧氣、營養和荷爾蒙輸送到全身各處。",
    facts: [
      { label: "每日心跳次數", value: "100,000+" },
      { label: "血管總長度", value: "~96,000 km" },
      { label: "血液總量", value: "~5 L" },
      { label: "紅血球壽命", value: "~120 天" },
    ],
    details: {
      function: "循環系統由心臟作為中央泵，通過動脈將含氧血液輸送到全身組織，再通過靜脈將缺氧血液帶回心臟。肺循環負責在肺部進行氣體交換，體循環則將營養和氧氣送到身體各部位。",
      commonDiseases: [
        { name: "冠心病", description: "冠狀動脈狹窄或阻塞，減少心肌供血，可能導致心絞痛或心肌梗塞。" },
        { name: "高血壓", description: "血壓持續偏高，增加心臟負擔，長期可損害血管和器官。" },
        { name: "心律不整", description: "心跳節律異常，可能過快、過慢或不規則。" },
        { name: "貧血", description: "紅血球或血紅蛋白不足，導致組織缺氧。" },
      ],
      healthTips: [
        "保持均衡飲食，減少鈉和飽和脂肪攝取",
        "每週進行至少 150 分鐘中等強度運動",
        "定期監測血壓和膽固醇",
        "管理壓力，保持情緒穩定",
        "避免長時間久坐不動",
      ],
      funFacts: [
        "心臟一生中大約跳動 25-35 億次",
        "血液完成一次全身循環只需約 20 秒",
        "人體血管可以環繞地球兩圈半",
        "心臟每天泵出約 7,500 升血液",
      ],
    },
  },
  {
    id: "digestive",
    name: "消化系統",
    nameEn: "Digestive System",
    password: "IU3",
    image: digestiveImg,
    color: "hsl(145 60% 45%)",
    colorClass: "text-medical-green",
    icon: "Apple",
    organs: ["口腔", "食道", "胃", "肝臟", "小腸", "大腸", "胰臟"],
    description: "消化系統將食物分解為營養素，供身體吸收和利用，是維持生命的重要系統。",
    facts: [
      { label: "消化道總長度", value: "~9 m" },
      { label: "每日唾液分泌", value: "~1.5 L" },
      { label: "小腸表面積", value: "~32 m²" },
      { label: "肝臟功能數", value: "500+" },
    ],
    details: {
      function: "消化系統從口腔開始，食物經過機械和化學消化過程，在胃和小腸中被分解為可吸收的營養素。小腸負責大部分營養吸收，大腸則吸收水分並形成糞便。肝臟和胰臟分泌消化液協助消化。",
      commonDiseases: [
        { name: "胃食道逆流", description: "胃酸倒流至食道，引起灼熱感和不適。" },
        { name: "腸易激綜合症", description: "功能性腸道疾病，伴有腹痛、腹脹和排便習慣改變。" },
        { name: "肝炎", description: "肝臟發炎，可由病毒、酒精或藥物引起。" },
        { name: "胃潰瘍", description: "胃黏膜受損形成潰瘍，常與幽門螺旋桿菌感染有關。" },
      ],
      healthTips: [
        "細嚼慢嚥，每餐至少 20 分鐘",
        "多攝取高纖維食物",
        "保持規律的飲食時間",
        "適量飲水，每日至少 8 杯",
        "減少油炸和辛辣食物攝取",
      ],
      funFacts: [
        "胃酸的酸度足以溶解金屬",
        "小腸內壁有數百萬個絨毛，增加吸收面積",
        "肝臟是人體最大的內臟器官",
        "食物完全消化需要 24-72 小時",
      ],
    },
  },
  {
    id: "nervous",
    name: "神經系統",
    nameEn: "Nervous System",
    password: "IU4",
    image: nervousImg,
    color: "hsl(270 60% 55%)",
    colorClass: "text-medical-purple",
    icon: "Brain",
    organs: ["大腦", "脊髓", "神經網絡"],
    description: "神經系統是人體的指揮中心，控制所有身體功能，從思考到心跳。",
    facts: [
      { label: "神經元數量", value: "~860 億" },
      { label: "神經傳導速度", value: "~430 km/h" },
      { label: "突觸連接數", value: "~100 兆" },
      { label: "大腦耗能佔比", value: "~20%" },
    ],
    details: {
      function: "神經系統分為中樞神經系統（大腦和脊髓）和周圍神經系統。它接收感覺信息，進行處理和整合，然後發出指令控制肌肉運動、腺體分泌等活動。自主神經系統控制心跳、呼吸等不自主功能。",
      commonDiseases: [
        { name: "中風", description: "腦血管阻塞或破裂導致腦組織損傷，可能引起癱瘓和語言障礙。" },
        { name: "阿茲海默症", description: "進行性的神經退化疾病，導致記憶力衰退和認知功能下降。" },
        { name: "帕金森症", description: "多巴胺神經元退化導致震顫、僵硬和運動緩慢。" },
        { name: "偏頭痛", description: "反覆發作的嚴重頭痛，常伴有噁心和光敏感。" },
      ],
      healthTips: [
        "保持充足睡眠（7-9 小時）",
        "進行認知訓練，如閱讀和解謎",
        "學習新技能以促進大腦可塑性",
        "管理壓力，練習冥想",
        "保持社交活躍",
      ],
      funFacts: [
        "大腦產生的電力足以點亮一個小燈泡",
        "大腦在 30 歲後每年縮小約 0.25%",
        "神經信號的傳導速度最快可達 430 km/h",
        "大腦中 73% 是水分",
      ],
    },
  },
  {
    id: "urinary",
    name: "排泄與泌尿系統",
    nameEn: "Excretory & Urinary System",
    password: "IU5",
    image: urinaryImg,
    color: "hsl(36 90% 55%)",
    colorClass: "text-medical-amber",
    icon: "Droplets",
    organs: ["腎臟", "輸尿管", "膀胱", "尿道"],
    description: "泌尿系統負責過濾血液中的廢物，維持體內水分和電解質平衡。",
    facts: [
      { label: "每日過濾血量", value: "~180 L" },
      { label: "腎元數量", value: "~200 萬" },
      { label: "每日產尿量", value: "1-2 L" },
      { label: "膀胱容量", value: "~500 mL" },
    ],
    details: {
      function: "腎臟是泌尿系統的核心器官，每天過濾約 180 升血液，去除代謝廢物和多餘的水分，形成尿液。腎臟還負責調節血壓、酸鹼平衡和紅血球生成。尿液經輸尿管流入膀胱儲存，最後通過尿道排出體外。",
      commonDiseases: [
        { name: "腎結石", description: "礦物質在腎臟中結晶形成結石，可能引起劇烈疼痛。" },
        { name: "尿道感染", description: "細菌感染泌尿道，引起頻尿、灼熱感和疼痛。" },
        { name: "慢性腎病", description: "腎功能逐漸衰退，可能最終需要透析治療。" },
        { name: "腎盂腎炎", description: "腎臟的細菌感染，通常由下泌尿道感染上行引起。" },
      ],
      healthTips: [
        "每天飲用充足的水分",
        "減少鈉攝取量",
        "避免過度使用止痛藥",
        "定期檢查腎功能",
        "控制血糖和血壓",
      ],
      funFacts: [
        "腎臟每分鐘過濾約 1.2 升血液",
        "人只需要一個腎臟就可以正常生活",
        "膀胱的尿液可以儲存 2-5 小時",
        "腎臟每天產生約 1-2 升尿液，但過濾量達 180 升",
      ],
    },
  },
];
