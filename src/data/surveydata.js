import {getLanguage} from '../data/strings';

const SURVEY_DATA = [
  [
    {
      en: 'Very Low',
      tr: 'Çok Az',
    },
    {
      en: 'Low',
      tr: 'Az',
    },
    {
      en: 'Medium',
      tr: 'Orta',
    },
    {
      en: 'High',
      tr: 'Yüksek',
    },
    {
      en: 'Too High',
      tr: 'Çok Yüksek',
    },
  ],
  [
    {
      en: 'Very Relax',
      tr: 'Çok Rahat',
    },
    {
      en: 'Relax',
      tr: 'Rahat',
    },
    {
      en: 'Normal',
      tr: 'Normal',
    },
    {
      en: 'Nervous',
      tr: 'Gergin',
    },

    {
      en: 'Very Nervous',
      tr: 'Çok Gergin',
    },
  ],
  [
    {
      en: 'None',
      tr: 'Hayır',
    },
    {
      en: 'Low',
      tr: 'Biraz',
    },
    {
      en: 'Medium',
      tr: 'Orta',
    },
    {
      en: 'High',
      tr: 'Çok',
    },
  ],
  [
    {
      en: 'Very Bad',
      tr: 'Çok kötü',
    },
    {
      en: 'Bad',
      tr: 'Kötü',
    },
    {
      en: 'Normal',
      tr: 'Normal',
    },
    {
      en: 'Good',
      tr: 'İyi',
    },
    {
      en: 'Excellent',
      tr: 'Harika',
    },
  ],
];

const QUESTION_DATA = [
  {
    en: 'How would you rate your pain in general?',
    tr: 'Genel olarak ne kadar ağrınız var?',
  },
  {
    en: 'How would you rate your relaxation state?',
    tr: 'Rahatlık durumunuzu nasıl değerlendirirsiniz?',
  },
  {
    en: 'Do you have dizziness or vertigo?',
    tr: 'Baş dönmesi veya vertigonuz var mı?',
  },
  {
    en: 'How do you feel about yourself in general?',
    tr: 'Genel olarak nasıl hissediyorsunuz?',
  },
];

export function getSurveyQuestion(surveyNum) {
  return QUESTION_DATA[surveyNum][getLanguage()];
}

export function getSurvey(surveyNum, count) {
  return SURVEY_DATA[surveyNum][count][getLanguage()];
}

export function getSurveyLength(surveyNum) {
  return SURVEY_DATA[surveyNum].length;
}

export function getTotalQuestions() {
  return SURVEY_DATA.length;
}
