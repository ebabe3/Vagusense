/* eslint-disable prettier/prettier */
var curLang = 'tr';

const strings = {
  name: {
    en: 'Name',
    tr: 'İsim',
  },
  lastname: {
    en: 'Last Name',
    tr: 'Soyad',
  },
  email: {
    en: 'Email',
    tr: 'Email',
  },
  password: {
    en: 'Password',
    tr: 'Şifre',
  },
  forgotPassword: {
    en: 'Forgot Password',
    tr: 'Şifremi Unuttum',
  },
  login: {
    en: 'Log in',
    tr: 'Giriş Yap',
  },
  incorrectCredExp: {
    en: 'Please check your email and password.',
    tr: 'Lütfen email ve şifrenizi kontrol edin.',
  },
  confirmEmail: {
    en: 'Please confirm your email.',
    tr: 'Lütfen emailinizi doğrulayın.',
  },
  incorrectCredTitle: {
    en: 'Incorrect username or password',
    tr: 'Yanlış kullanıcı adı yada şifre',
  },
  unknownErrorOccured: {
    en: 'An unknown error occured. Please try again later.',
    tr: 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.',
  },
  checkNetwork: {
    en: 'Please check your internet connection.',
    tr: 'Lütfen internet bağlantınızı kontrol edin.',
  },
  dontHaveAcc: {
    en: "Don't have an account?",
    tr: 'Hesabınız yok mu?',
  },
  signup: {
    en: 'Sign up',
    tr: 'Hesap oluştur',
  },
  rememberPassword: {
    en: 'Remember your password?',
    tr: 'Şifreni hatırlıyor musun?',
  },
  emailNotValid: {
    en: 'Please enter a valid email.',
    tr: 'Lütfen geçerli bir email adresi girin.',
  },
  emailNotFound: {
    en: 'Email not found.',
    tr: 'Email bulunamadı.',
  },
  checkYourEmail: {
    en: 'Check Your Email',
    tr: 'Emailinizi kontrol edin.',
  },
  emailExpReset: {
    en: 'We have sent an email to this address for resetting your password.',
    tr: 'Şifrenizi yenileme işlemi için adresinize mail gönderildi.',
  },
  emailExpConfirm: {
    en: 'We have sent an email to this address to confirm your email.',
    tr: 'Doğrulama işlemi için adresinize mail gönderildi.',
  },
  emailVerificationSuccess: {
    en: 'Email verification success!',
    tr: 'Doğrulama işlemi başarılı!'
  },
  emailVerificationFailed: {
    en: 'Email verification failed!',
    tr: 'Doğrulama işlemi başarısız!'
  },
  alreadyHaveAcc: {
    en: 'Already have an account?',
    tr: 'Zaten hesabınız var mı?',
  },
  passwordTooShort: {
    en: 'Password should be at least 8 characters long',
    tr: 'Şifre minimum 8 karakter uzunluğunda olmalı',
  },
  passwordNotValid: {
    en: 'Password should contain an uppercase letter, a lowercase letter and a number.',
    tr: 'Şifre büyük harf, küçük harf ve numara içermeli.',
  },
  userAlreadyRegistered: {
    en: 'User already registered.',
    tr: 'Kullanıcı kaydı mevcut.',
  },
  resetMyPassword: {
    en: 'Reset my password',
    tr: 'Şifremi yenile',
  },
  agreeToVagustim: {
    en: "I agree to Vagustim's",
    tr: '',
  },
  agreeToVagustimTR: {
    en: '',
    tr: ' onaylıyorum.',
  },
  terms: {
    en: 'Terms',
    tr: 'Şartları',
  },
  and: {
    en: 'and',
    tr: 've',
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    tr: 'Gizlilik Sözleşmesini',
  },
  acceptTerms: {
    en: 'Please accept terms.',
    tr: 'Lütfen kabul ediniz.',
  },
  listOfUsers: {
    en: 'List of Users',
    tr: 'Kullanıcı Listesi',
  },
  settings: {
    en: 'Settings',
    tr: 'Ayarlar',
  },
  profile: {
    en: 'Profile',
    tr: 'Profil',
  },
  logout: {
    en: 'Log out',
    tr: 'Çıkış yap',
  },
  edit: {
    en: 'Edit',
    tr: 'Düzenle',
  },
  account: {
    en: 'Account',
    tr: 'Hesap',
  },
  support: {
    en: 'Support',
    tr: 'Destek',
  },
  changePassword: {
    en: 'Change Password',
    tr: 'Şifremi değiştir',
  },
  userMan: {
    en: 'User Manual & Quick Start Guide',
    tr: 'Kullanım ve Hızlı Başlangıç Kılavuzu',
  },
  contactUs: {
    en: 'Contact Us',
    tr: 'İletişim',
  },
  language: {
    en: 'Language',
    tr: 'Dil',
  },
  english: {
    en: 'English',
    tr: 'English',
  },
  turkish: {
    en: 'Türkçe',
    tr: 'Türkçe',
  },
  updateAccount: {
    en: 'Update Account',
    tr: 'Hesabımı güncelle',
  },
  updatePassword: {
    en: 'Update Password',
    tr: 'Şifremi güncelle',
  },
  confirm: {
    en: 'Confirm',
    tr: 'Doğrula',
  },
  letsUpdateAcc: {
    en: "Let's update your account",
    tr: 'Hesabınızı güncelleyelim',
  },
  letsUpdatePass: {
    en: "Let's update your password",
    tr: 'Şifrenizi güncelleyelim',
  },
  oldPasswordWrong: {
    en: 'Your password is wrong.',
    tr: 'Şifreniz yanlış',
  },
  oldPassword: {
    en: 'Existing Password',
    tr: 'Mevcut Şifre',
  },
  newPassword: {
    en: 'New Password',
    tr: 'Yeni Şifre',
  },
  retypeNewPassword: {
    en: 'Retype New Password',
    tr: 'Yeni şifre tekrar',
  },
  search: {
    en: 'Search',
    tr: 'Arama',
  },
  createUser: {
    en: 'Create New User',
    tr: 'Yeni Kullanıcı',
  },
  editUser: {
    en: 'Edit User',
    tr: 'Kullanıcıyı Düzenle',
  },
  toStartSim: {
    en: 'To start stimulation, please tap on the user.',
    tr: 'Stimülasyonu başlatmak için lütfen kullanıcı seçin.',
  },
  pleaseFill: {
    en: 'Please fill all fields.',
    tr: 'Lütfen tüm alanları doldurun.',
  },
  create: {
    en: 'Create',
    tr: 'Oluştur',
  },
  age: {
    en: 'Age',
    tr: 'Yaş',
  },
  gender: {
    en: 'Gender',
    tr: 'Cinsiyet',
  },
  height: {
    en: 'Height (cm)',
    tr: 'Boy (cm)',
  },
  weight: {
    en: 'Weight (kg)',
    tr: 'Kilo (kg)',
  },
  deleteUser: {
    en: 'Delete User',
    tr: 'Kullanıcıyı sil',
  },
  userDeleted: {
    en: 'User deleted',
    tr: 'Kullanıcı silindi'
  },
  addDescription: {
    en: 'Add description about the user',
    tr: 'Kullanıcı hakkında açıklama ekleyin',
  },
  pleaseTake: {
    en: 'Please take the survey before the stimulation!',
    tr: 'Lütfen stimülasyondan önce ankete katılın!',
  },
  surveyExp: {
    en: 'By answering questions, you help us to provide you customized stimulation parameters.',
    tr: 'Soruları yanıtlayarak size özel stimülasyon parametrelerini belirlememize yardımcı olursunuz.',
  },
  takeSurvey: {
    en: 'Take the Survey',
    tr: 'Ankete katıl',
  },
  startStim: {
    en: 'Start Stimulation',
    tr: 'Stimülasyonu Başlat',
  },
  surveyThanks: {
    en: 'Thank you for taking the survey!',
    tr: 'Ankete katıldığınız için teşekkürler!',
  },
  bleConnection: {
    en: 'Bluetooth Connection',
    tr: 'Bluetooth Bağlantısı',
  },
  searching: {
    en: 'Searching for your device',
    tr: 'Cihazınız aranıyor',
  },
  back: {
    en: 'Back',
    tr: 'Geri',
  },
  buyDevice: {
    en: 'Buy a Device',
    tr: 'Cihaz Satın Alın',
  },
  checkBluetooth: {
    en: 'Please enable Bluetooth.',
    tr: "Lütfen Bluetooth'u etkinleştirin.",
  },
  congrats: {
    en: 'Congratulations!',
    tr: 'Tebrikler!',
  },
  readyStart: {
    en: 'You are now ready to start your Vagustim.',
    tr: "Artık Vagustim'inizi başlatmaya hazırsınız.",
  },
  start: {
    en: 'Start',
    tr: 'Başlat',
  },
  bleDc: {
    en: 'Bluetooth disconnected.',
    tr: 'Bluetooth bağlantısı kesildi',
  },
  startError: {
    en: 'An error occured. Please check bluetooth connection.',
    tr: 'Bir hata oluştu. Lütfen bluetooth bağlantısını kontrol edin.',
  },
  deviceControl: {
    en: 'Device Control',
    tr: 'Cihaz Kontrolü',
  },
  startBLE: {
    en: 'Start',
    tr: 'Başlat',
  },
  stopBLE: {
    en: 'Stop',
    tr: 'Dur',
  },
  L: {
    en: 'L',
    tr: 'L',
  },
  R: {
    en: 'R',
    tr: 'R',
  },
  pressPlay: {
    en: 'Press the play button to start the stimulation...',
    tr: 'Stimülasyonu başlatmak için başlat tuşuna basın...',
  },
  ifHeadphone: {
    en: 'If the earset icon is ',
    tr: 'Eger kulak elektrodu simgesi ',
  },
  checkHeadphone: {
    en: ', check the earset connection.',
    tr: ' ise, lütfen bağlantınızı kontrol edin.',
  },
  bleTextPress: {
    en: "Press '",
    tr: "Stimulasyonu sonlandırmak için önce '",
  },
  bleTextPause: {
    en: 'pause',
    tr: 'duraklat',
  },
  bleTextAndThen: {
    en: "' and then '",
    tr: "' ve sonra '",
  },
  bleTextStop: {
    en: 'stop',
    tr: 'durdur',
  },
  bleTextToFinish: {
    en: "' to finish the stimulation.",
    tr: "' tuşuna basın.",
  },
  bleTextYouCan: {
    en: 'You can increase or decrease the intensity using the buttons below.',
    tr: 'Aşağıdaki düğmeleri kullanarak yoğunluğu arttırabilir veya azaltabilirsiniz.',
  },
  remainingTime: {
    en: 'Remaining Time: ',
    tr: 'Kalan süre: ',
  },
  controlStop: {
    en: 'Stop',
    tr: 'Durdur',
  },
  controlPause: {
    en: 'Pause',
    tr: 'Duraklat',
  },
  controlStart: {
    en: 'Start',
    tr: 'Başlat',
  },
  controlContinue: {
    en: 'Continue',
    tr: 'Devam et',
  },
  leftElectrode: {
    en: 'Left Ear Electrode',
    tr: 'Sol Kulak Elektrodu',
  },
  rightElectrode: {
    en: 'Right Ear Electrode',
    tr: 'Sağ Kulak Elektrodu',
  },
  intensity: {
    en: 'Intensity',
    tr: 'Yoğunluk',
  },
  fwUpdate: {
    en: 'Firmware Update',
    tr: 'Yazılım Güncellemesi',
  },
  fwAvail: {
    en: 'Firmware update is available. Please enter your wifi credentials to perform the update.',
    tr: 'Yazılım güncellenmesi mevcut. Lütfen güncellemek için wifi bilgilerinizi girin.',
  },
  plsDoNot: {
    en: 'Please do not turn off your device.',
    tr: 'Lütfen cihazı kapatmayın.',
  },
  wifiName: {
    en: 'Wifi',
    tr: 'Wifi',
  },
  skip: {
    en: 'Skip',
    tr: 'Atla',
  },
  connectAndUpdate: {
    en: 'Connect & Update',
    tr: 'Bağlan ve Güncelle',
  },
  checkCred: {
    en: 'Please check Wifi credentials.',
    tr: 'Lütfen wifi bilgilerini kontrol edin.',
  },
  recCred: {
    en: 'Received credentials. Searching Wifi...',
    tr: 'Bilgiler alındı. Wifi aranıyor...',
  },
  updateInProg: {
    en: 'Update is in progress.',
    tr: 'Güncelleniyor...',
  },
  updateComplete: {
    en: 'Update is complete. This screen will close shortly.',
    tr: 'Güncelleme tamamlandı. Bu ekran birazdan kapanacak.',
  },
  waitingText: {
    en: 'Waiting',
    tr: 'Bekleniyor',
  },
  updatingText: {
    en: 'Updating',
    tr: 'Güncelleniyor',
  },
  updatedText: {
    en: 'Updated',
    tr: 'Güncellendi',
  },
  updateFailed: {
    en: 'Update failed. Please try again later.',
    tr: 'Güncelleme başarısız. Lütfen daha sonra tekrar deneyin.',
  },
  appVersion: {
    en: 'App Version: ',
    tr: 'Uygulama Versiyonu:',
  },
  about: {
    en: 'Version',
    tr: 'Versiyon',
  },
  firmwareVersion: {
    en: 'Firmware Version',
    tr: 'Cihaz Versiyonu',
  },
  macAddress: {
    en: 'MAC Address',
    tr: 'MAC Adresi',
  },
  adminPanel: {
    en: 'Control Panel',
    tr: 'Kontrol Paneli',
  },
  stimFinished: {
    en: 'Stimulation Finished',
    tr: 'Stimulation Finished',
  },
  mainMenu: {
    en: 'Back to Main Menu',
    tr: 'Anasayfaya Dön',
  },
  stimComplete: {
    en: 'Stimulation is complete.',
    tr: 'Stimülasyon tamamlandı.',
  },
  sendConfError: {
    en: 'Configurations could not be sent.',
    tr: 'Ayarlar gönderilemedi.',
  },
  confSent: {
    en: 'Configurations successfully updated.',
    tr: 'Ayarlar başarıyla güncellendi.',
  },
  voltage: {
    en: 'Voltage',
    tr: 'Voltaj',
  },
  v: {
    en: 'V',
    tr: 'V',
  },
  pulseWidth: {
    en: 'Pulse Width',
    tr: 'Sinyal Uzunluğu',
  },
  us: {
    en: 'uS',
    tr: 'uS',
  },
  frequency: {
    en: 'Frequency',
    tr: 'Frekans',
  },
  hz: {
    en: 'Hz',
    tr: 'Hz',
  },
  onDur: {
    en: 'On Duration',
    tr: 'Aktif Süre',
  },
  sec: {
    en: 'sec',
    tr: 's',
  },
  stimDur: {
    en: 'Stim Dur.',
    tr: 'Stim. Süresi',
  },
  minsLong: {
    en: 'mins',
    tr: 'dk',
  },
  sendConfig: {
    en: 'Update Configurations',
    tr: 'Ayarları Güncelle',
  },
  readConf: {
    en: 'Succesfully read device configurations.',
    tr: 'Cihaz ayarları başarı ile alındı.',
  },
  offTime: {
    en: 'Off Period',
    tr: 'Kulaklık Kapalı',
  },
  leftCurText: {
    en: 'Left: ',
    tr: 'Sol: ',
  },
  rightCurText: {
    en: 'Right: ',
    tr: 'Sağ: ',
  },
  mA: {
    en: ' mA',
    tr: ' mA',
  },
  passwordNoMatch: {
    en: 'Passwords do not match.',
    tr: 'Girilen şifreler eşleşmiyor.',
  },
  verifyPassword: {
    en: 'Confirm Password',
    tr: 'Şifreyi Doğrula',
  },
  continue: {
    en: 'Continue',
    tr: 'Devam et',
  },
  continueToStim: {
    en: 'You are now ready to continue your Vagustim.',
    tr: "Artık Vagustim'inize kaldığınız yerden devam edebilirsiniz.",
  },
  selectUserType: {
    en: 'Please select a user type.',
    tr: 'Lütfen bir kullanıcı türü seçiniz.',
  },
  healthProfessional: {
    en: 'Health Professional',
    tr: 'Sağlık Uzmanı',
  },
  endUser: {
    en: 'End User',
    tr: 'Son Kullanıcı',
  },
  okay: {
    en: 'Okay',
    tr: 'Tamam',
  },
  passwordExp: {
    en: 'Use 8 or more characters with a mix of uppercase, lowercase letters & numbers',
    tr: 'Büyük harf, küçük harf ve rakam karışımı ile 8 veya daha fazla karakter kullanın'
  },
  update: {
    en: 'Update',
    tr: 'Güncelle'
  },
  updateInfo: {
    en: 'Update Info',
    tr: 'Bilgilerini Güncelle'
  },
  passwordUppercaseError: {
    en: 'At least one UPPERCASE',
    tr: 'En az bir BÜYÜK HARF'
  },
  passwordLowercaseError: {
    en: 'At least one lowercase',
    tr: 'En az bir küçük harf'
  },
  passwordNumberError: {
    en: 'At least one number',
    tr: 'En az bir sayı'
  },
  passwordLenghtError: {
    en: 'At least 8 characters',
    tr: 'En az 8 karakter'
  }


};

export function setLanguage(lang) {
  curLang = lang;
}

export function getLanguage() {
  return curLang;
}

export function getString(text) {
  return strings[text][curLang];
}
