var isMobile = navigator.userAgent.indexOf('iPhone') > 0
  || navigator.userAgent.indexOf('iPod') > 0
  || navigator.userAgent.indexOf('iPad') > 0
  || navigator.userAgent.indexOf('Android') > 0;
var isAndroid = navigator.userAgent.indexOf('Android') > 0;

/*
* A8用
*/
var AdsInfo = function(category, rankParam, trackingParam){
    this.category = category;
    this.rankParam = rankParam;
    this.trackingParam = trackingParam;
};
var adsInfos = [];
// ゲーム PS3
adsInfos.push(new AdsInfo('ゲーム', 'mC7dP.SHVRol5F9TP.7qMAo1bApZSj0TwU7iPMSl3A9P3FMeniDWJiM31TPTwC7qY.Sl7.cvECcqPLojlith7E2.J', 'zns-_OEHdDGn-1Ci_SRi_1G1dtI.ZP6bFPyhg3Qxx'));
// 本 ゲーム攻略、ゲームブック
adsInfos.push(new AdsInfo('本', '_9OBrvsG4MFc0ZiYrvOghLFyPLjdsTWYuoOKrhscULirUZhTJH.dwKCL69wc4TWYuoOKrhscULirUZhTwKhqyH_xx', '56n7FK3CpT967f1tFkOtFf9fp_dJr8-YP8mXWBExx'));
// ゲーム PSP
adsInfos.push(new AdsInfo('ゲーム', 'iueEJaDLd0tg8.-oJaerWStG_S3vDUVokyeRJWDg1S-J1.WqmAmiYAjAGoJokuerFaDgea2XCu2rJstUgROAeCjaN', 'q5zRJafGBb75Ry9KJsMKJy7yB.3vdrePZrtH2U1xx'));
// ゲーム PSVita
adsInfos.push(new AdsInfo('ゲーム', 'bft4qZL1WKYaR8mnqZtlNHYUzH2VLkMnCTt_qNLajHmqj8NVrBwb.Qwe._NOLmLaCTOnrftTsHmPCHJdnHwWXQsZ3_sVx', 'MOR.VITmk5_O.boZV-vZVb_bkrSp2WK0gWPfHsDxx'));
// ゲーム 3DS
adsInfos.push(new AdsInfo('ゲーム', '-kzXKlfSv87rFOnyKlzJVB7LiBQaf1ZyjGz5KVfrHBnKHOVaM4enow3dq5VPfnfrjGPyMkzG9BnRjB0cyB3vp49lA59ax', 'DjBk96aW.EAjkhcu9dnu9hAh.GK7tmSfymH0PNMxx'));
// DVD アニメ
adsInfos.push(new AdsInfo('DVD', 'VFInAjR_uEg1X2ZlAjIHfigPWi6kReCltqIdAfR1ziZAz2fZympVSmciKFy1ueCltqIdAfR1ziZAz2fZympV3m9xx', 'Oi7_qZSUA6oi_TDPqGJPqToTA82VWlte0lY3Xkjxx'));
// ホビー フィギュア
adsInfos.push(new AdsInfo('ホビー', 'r_vs2BetLQVCh4J02Bvw17VFg7nSe5H0i8vI21eCY7J2Y41SFb-YqI1cEI1XeJeCi8X0j_v8q7Jpi73D07-LjydBvIqSjy-JF', 'j4pA1uKl_Ic4AaMH1rLH1aca_Ct9mU23fUXeY.Oxx'));
    
var a8='a12121454449_2061NX_UYK8I_249K_BUB81';
var rankParam='';
var trackingParam='';
var bannerType='1';
var bannerKind='item.variable.kind1';
var vertical='3';
var horizontal='1';
var alignment='0';
var frame='1';
var ranking='1';
var category='';

function randomiseAds(){
    var random = new MersenneTwister();
    var index = random.nextInt(0, adsInfos.length);
    rankParam = adsInfos[index].rankParam;
    trackingParam = adsInfos[index].trackingParam;
    category = adsInfos[index].category;
};
randomiseAds();

/*
* footer用
*/
var footerAdsInfo = null;
(function(){
  var footerAdsInfos = [
    {href : 'http://linkage-m.net/system/link.php?i=5135b0fa364c6&m=52c0bed1e5285&guid=ON',
     imgsrc : 'http://linkage-m.net/system/data.php?i=5135b0fa364c6&m=52c0bed1e5285'},
    {href : 'http://linkage-m.net/system/link.php?i=515a37c328444&m=52c0bed1e5285&guid=ON',
     imgsrc : 'http://linkage-m.net/system/data.php?i=515a37c328444&m=52c0bed1e5285'}
  ];
  if (isAndroid) {
    footerAdsInfos.push(
      {href : 'https://play.google.com/store/apps/details?id=com.foxtail.followercollectionz',
       imgsrc : 'http://serizawa.web5.jp/forokore_z.png'}
    );
  }
  function randomiseFooterAds(){
    var random = new MersenneTwister();
    var index = random.nextInt(0, footerAdsInfos.length);
    footerAdsInfo = footerAdsInfos[index];
  };
  randomiseFooterAds();
})();
