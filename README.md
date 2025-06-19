# YEARLOG
1.	PROJENİN AMACI
Bu projenin temel amacı, geleneksel kâğıt temelli okul yıllıklarının dijital ortama taşınarak modern bir web platformu aracılığıyla daha erişilebilir, sürdürülebilir ve interaktif hale getirilmesidir. Özellikle öğrencilerin kendi anılarını, düşüncelerini ve arkadaşlarıyla ilgili hatıralarını dijital olarak kaydedip paylaşabilecekleri kullanıcı dostu bir sistem oluşturmak hedeflenmiştir.
Geliştirilen bu web uygulaması, kullanıcıların (özellikle öğrencilerin) kolayca hesap oluşturabileceği, sisteme giriş yapabileceği, kendi kişisel dijital yıllığını oluşturabileceği ve görüntüleyebileceği bir ortam sunar. Böylelikle bireysel kullanıcı deneyimi ön plana çıkarılırken aynı zamanda topluluk hissi ve sosyal etkileşim desteklenmektedir.
Projenin geliştirilme sürecinde özellikle sade, sezgisel ve mobil uyumlu bir arayüz tasarlanması amaçlanmış; teknik altyapı olarak ise Firebase gibi modern ve güvenli bir platform tercih edilerek, kullanıcı verilerinin güvenli şekilde saklanması ve yönetilmesi sağlanmıştır. Ayrıca sistemin tamamen bulut tabanlı olması sayesinde, kullanıcılar dünyanın herhangi bir yerinden yıllıklarına erişebilir, onları güncelleyebilir ya da paylaşabilir hale gelir.
Bu dijital dönüşüm süreci aynı zamanda kâğıt israfının önüne geçilmesini desteklerken, öğrencilerin teknolojiyle olan etkileşimlerini artırmakta ve onlara çağın gerektirdiği dijital yetkinlikleri kazandırmayı da hedeflemektedir. Uygulamanın sade yapısı, düşük teknik bilgiye sahip kullanıcılar için bile kolay kullanım imkânı sunar.
Sonuç olarak bu projenin amacı, sadece bir yazılım geliştirmek değil; aynı zamanda dijital kültürü benimseyen, paylaşım odaklı ve sürdürülebilir bir öğrenci topluluğuna katkı sağlayacak kalıcı bir platform oluşturmaktır.
2.	KULLANILAN TEKNOLOJİ VE DİLLER 
Uygulama, MERN (MongoDB, Express.js, React/Angular/Vue yerine Vanilla JS, Node.js) yığınına benzer bir yapılandırmayla geliştirilmiştir. Frontend için saf JavaScript, HTML ve CSS kullanılmıştır, bu da hızlı yükleme süreleri ve doğrudan DOM manipülasyonu sağlar.                                                                                                                
3. PROJE SAYFALARI VE İŞLEVLERİ
1. index.html — Ana Giriş Sayfası
Kullanıcıyı karşılayan ilk sayfadır. Giriş yapmamış kullanıcıların kayıt olmasını veya giriş yapmasını teşvik eder. Navigasyon çubuğu sayesinde içeriklere yönlendirme yapılır.
 2. register.html — Kayıt Sayfası
Yeni kullanıcıların e-posta ve şifre ile kaydolmasını sağlayan form yapısı içerir. Form gönderimi, main.js üzerinden Firebase Authentication ile gerçekleştirilir.
 3. login.html — Giriş Sayfası
Sisteme daha önce kaydolmuş kullanıcıların oturum açtığı sayfadır. Kullanıcı bilgileri doğrulandıktan sonra yönlendirme yapılır. Giriş işlemleri yine main.js ile gerçekleştirilir.
 4. create.html — Yıllık Oluşturma Sayfası
Kullanıcıların ad, soyad, fotoğraf, mesaj gibi bilgileri girerek kendi dijital yıllıklarını oluşturabildiği sayfadır. Girilen veriler main.js aracılığıyla Firestore veritabanına kaydedilir.
 5. yearbookList.html — Yıllık Listeleme Sayfası
Tüm kullanıcı yıllıklarının listelendiği sayfadır. Firestore'dan dinamik olarak veri çekilerek kullanıcıların oluşturduğu içerikler görsel olarak burada listelenir.


 
6. favorites.html — Favori Yıllıklar Sayfası
Kullanıcının beğendiği yıllıkları favorilere ekleyerek daha sonra tekrar görüntülemesini sağlayan sayfadır. Sayfa, kullanıcıya ait favori yıllık kayıtlarını Firestore’dan çeker ve görsel kartlar hâlinde listeler.
•	favorites.js: Bu sayfaya özel JavaScript dosyasıdır. Favori verilerini Firebase üzerinden çeker, DOM üzerine yerleştirir ve kullanıcıya özel liste sunar. Ayrıca kullanıcıya başarı/bilgi mesajları (toast) göstermek için etkileşimli görseller içerir.
 7. profil.html — Profil Sayfası
Kullanıcının kendi profil bilgilerini görüntüleyebileceği, gerektiğinde düzenleyebileceği bir sayfadır. Oturum açan kullanıcıya özel veriler gösterilir.
•	profil.js: Kullanıcının Firebase’de saklanan profil verilerini çeken ve bu verileri arayüzde görüntüleyen JavaScript dosyasıdır. Ayrıca oturum doğrulama kontrolü ve kullanıcıya özel içerik filtreleme işlemleri içerir.
main.js — Ana JavaScript Dosyası
Tüm HTML sayfalarının dinamik işlevlerini yöneten ana betik dosyasıdır. Başlıca işlevleri şunlardır:
•	Firebase Authentication ile kullanıcı kayıt/giriş/çıkış işlemleri
•	Firestore veritabanına veri ekleme ve çekme işlemleri
•	Sayfa yönlendirmeleri
•	Form doğrulama ve hata yönetimi
•	Oturum kontrolü ve güvenlik (örneğin: login olmadan create.html'e erişimi engelleme)
Bu dosya sayesinde projenin tamamı tek bir merkezden kontrol edilmekte, bu da kod tekrarını azaltmakta ve bakım kolaylığı sağlamaktadır.
 style.css — Stil Dosyası
Tüm sayfalarda ortak olarak kullanılan CSS stil dosyasıdır. Görsel bütünlük ve kullanıcı deneyimi açısından kritik rol oynar. Başlıca özellikleri:
•	Sayfa düzeni ve hizalama (flexbox ve grid kullanımı)
•	Renk temaları ve yazı tipi ayarları
•	Responsive (mobil uyumlu) yapı
•	Buton, form ve başlık tasarımları




4. PROJENİN BACKEND ÖZELLİĞİ
•	Node.js: Sunucu tarafı uygulamaların çalıştırılması için kullanılan çalışma zamanı ortamı.
•	Express.js: Node.js üzerinde RESTful API'ler oluşturmak için kullanılan hafif ve esnek bir web çatısı. Routing, middleware yönetimi ve sunucuya gelen isteklerin işlenmesi Express.js ile sağlanmıştır.
•	MongoDB: Veritabanı olarak NoSQL tabanlı, doküman odaklı MongoDB kullanılmıştır. Esnek şema yapısı sayesinde farklı türdeki yıllık giriş verileri kolayca depolanabilmektedir.
•	Mongoose: MongoDB ile Node.js arasında ORM (Object Data Modeling) katmanı olarak görev yapar. Veritabanı işlemleri (oluşturma, okuma, güncelleme, silme - CRUD) Mongoose şemaları ve modelleri aracılığıyla yönetilir.
•	dotenv: Ortam değişkenlerinin (.env dosyasından) yüklenerek hassas bilgilerin (veritabanı URI'leri, JWT sırları) koddan ayrı tutulmasını sağlar.
•	bcryptjs: Kullanıcı şifrelerinin güvenli bir şekilde hash'lenmesi ve doğrulanması için kullanılan kütüphane.
•	jsonwebtoken (JWT): Kullanıcı oturumlarının yönetimi ve API yetkilendirmesi için JSON Web Tokens kullanılmıştır. Kullanıcı giriş yaptığında bir token oluşturulur ve sonraki yetkilendirme gerektiren isteklerde bu token kullanılır.
•	cors: Frontend ve backend'in farklı portlarda çalışabilmesi için Çapraz Köken Kaynak Paylaşımı (Cross-Origin Resource Sharing) middleware'i kullanılmıştır.
•	multer: Yıllık girişlerine fotoğraf ve video gibi dosya yüklemelerini işlemek için kullanılan middleware. Yüklenen dosyalar sunucu üzerinde public/uploads klasöründe depolanır.
•	Dosya Sistemi (fs modülü): Yükleme klasörünün dinamik olarak oluşturulması gibi dosya sistemi işlemleri için kullanılmıştır.
•	Path Modülü (path): Dosya yollarının işletim sisteminden bağımsız olarak doğru bir şekilde oluşturulması için kullanılmıştır.
Backend Katmanları ve Modeller:
•	Modeller (backend/models): 
o	User.js: Kullanıcıların adı, soyadı, e-posta adresi, şifresi ve favori yıllık girişlerini içeren Mongoose şeması ve modeli. Favoriler, YearbookEntry modeline referans veren bir dizi olarak tutulur.
o	YearbookEntry.js: Yıllık girişlerinin (ad, soyad, lakap, sınıf, ders, not, fotoğraf, video ve oluşturulma tarihi) Mongoose şeması ve modeli. Yıllık girişi oluşturan kullanıcıya referans verir (createdBy).
o	Class.js: Sınıf adlarını depolamak için basit bir Mongoose şeması ve modeli.
•	Middleware (backend/middleware): 
o	authMiddleware.js: JWT token'ını doğrulayarak yetkilendirme kontrolünü sağlar. Her korumalı API endpoint'inden önce çalışır.
•	Route'lar (backend/routes): 
o	auth.js: Kullanıcı kaydı (/api/register), kullanıcı girişi (/api/login), kullanıcının profil bilgilerini getirme (/api/profile), profil bilgilerini güncelleme (/api/profile) ve hesabı silme (/api/profile) endpoint'lerini içerir.
o	yearbook.js: Yeni yıllık girişi oluşturma (/api/yearbook/create), tüm yıllık girişlerini listeleme (/api/yearbook/all), tek bir yıllık girişini silme (/api/yearbook/:id) endpoint'lerini içerir.
o	favoritesRoutes.js: Yıllık girişlerini favorilere ekleme (/api/favorites), kullanıcının favori listesini getirme (/api/favorites), favorilerden kaldırma (/api/favorites/:id) endpoint'lerini içerir.
o	class.js: Yeni sınıf oluşturma (/api/classes) ve mevcut sınıfları listeleme (/api/classes) endpoint'lerini içerir.
•	server.js: Uygulamanın ana giriş noktasıdır. Express uygulamasını başlatır, veritabanı bağlantısını kurar, middleware'leri yapılandırır, statik dosyaları sunar ve tüm API route'larını doğru ön eklerle uygulamaya dahil eder.


5. PROJENİN ÖZGÜNLÜKLERİ
Proje, klasik okul yıllıklarının dijital versiyonunu modern kullanıcı deneyimi ile buluşturmaktadır. Web üzerinde bu fikre benzer çok az sayıda proje bulunmakta, olanlar da genellikle statik yapıdadır. Bu proje ise kullanıcıya aktif olarak içerik oluşturma, paylaşma ve diğer kullanıcıları görüntüleme imkanı tanır.
•	Geleneksel yıllık kavramı, bireysel dijital kimliğe dönüştürülmüştür.
•	Anılar, mesajlar ve görseller dijital ortamda uzun süreli ve erişilebilir hale getirilmiştir.
Projenin görsel kimliği olan logo, tamamen geliştirici tarafından sıfırdan tasarlanmıştır. Bu özgün tasarım, platformun marka değerini artırmakta ve görsel olarak dikkat çekici bir ilk izlenim oluşturmaktadır.
•	Logo tasarımı, projenin temasına uygun olarak sade ve anlam yüklü biçimde tasarlanmıştır.
•	Tüm arayüz tasarımı, kullanıcıyı yormayan ve sezgisel bir deneyim sunacak şekilde kişisel olarak düzenlenmiştir (örneğin: renk paleti, yazı tipi tercihleri, ikonlar).
•	Geleneksel backend teknolojileri yerine Firebase gibi sunucusuz, ölçeklenebilir ve çağdaş bir yapı tercih edilmiştir. Bu, projeye sadelik, güvenlik ve sürdürülebilirlik kazandırmakta, aynı zamanda teknik altyapı olarak birçok benzer uygulamadan ayrılmasını sağlamaktadır.
Bu projenin tüm kodlama, tasarım, yapılandırma ve test süreçleri tek bir geliştirici (yani proje sahibi) tarafından yürütülmüştür. Hazır tema, şablon ya da kütüphane kullanılmadan; tüm HTML, CSS, JavaScript ve Firebase entegrasyonları sıfırdan yazılmıştır. Bu da projeyi hem teknik hem de yaratıcı olarak özgün kılmaktadır.

6. NASIL YAPILDI 
Projede kodlama işlemleri için Visual Studio Code (VS Code) entegre geliştirme ortamı (IDE) tercih edilmiştir. Bu ortam sayesinde HTML, CSS ve JavaScript dosyaları organize bir şekilde yazılmış; eklentiler yardımıyla hata kontrolü, canlı sunum ve hızlı geliştirme imkanı sağlanmıştır. Ayrıca Pycharm yerel sunucu özelliğinden dolayı tercih edilmiştir. Son dokunuşlar VSC ve Pycharm üzerinden eş zamanlı gerçekleşmiştir.
Projenin backend tarafı için Node.js ve MangoDB kullanılmıştır
