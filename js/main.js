const SERVICE_ID = 'service_abvpc3t';
const TEMPLATE_ID = 'template_hbk5z3k';
const PUBLIC_KEY = 'kn4nwo1KARYnuyKIp';

emailjs.init(PUBLIC_KEY);

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

function loadArticles() {
    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    const articlesList = document.getElementById('articlesList');
    
    if (articles.length === 0) {
        articlesList.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-md">
                <span class="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-3">جديد</span>
                <h3 class="text-xl font-bold mb-3">الجرائم الاقتصادية في القانون الكويتي</h3>
                <p class="text-gray-600 mb-4">دراسة شاملة عن أنواع الجرائم الاقتصادية والعقوبات المقررة لها...</p>
                <p class="text-sm text-gray-400">د. سعد الجبيري • 10 يونيو 2026</p>
            </div>
        `;
    } else {
        articlesList.innerHTML = articles.map(article => `
            <div class="bg-white p-6 rounded-xl shadow-md card-hover">
                <span class="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-3">مقالة</span>
                <h3 class="text-xl font-bold mb-3">${article.title}</h3>
                <p class="text-gray-600 mb-4">${article.content.substring(0, 150)}...</p>
                <p class="text-sm text-gray-400">${article.author} • ${article.date}</p>
            </div>
        `).join('');
    }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const status = document.getElementById('status');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري الإرسال...';
        btn.disabled = true;

        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            message: document.getElementById('message').value
        }).then(() => {
            status.innerHTML = '<span class="text-green-300 text-lg">✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً</span>';
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            messages.push({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleDateString('ar-KW')
            });
            localStorage.setItem('messages', JSON.stringify(messages));
            contactForm.reset();
            setTimeout(() => {
                status.innerHTML = '';
            }, 5000);
        }).catch(err => {
            status.innerHTML = '<span class="text-red-300 text-lg">❌ حدث خطأ في الإرسال. يرجى المحاولة لاحقاً</span>';
            console.error('Error:', err);
        }).finally(() => {
            btn.innerHTML = 'إرسال الرسالة';
            btn.disabled = false;
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
            if (mobileMenu) mobileMenu.classList.add('hidden');
        }
    });
});

window.addEventListener('load', () => {
    loadArticles();
});

if (typeof localStorage !== 'undefined') {
    let visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    visitCount++;
    localStorage.setItem('visitCount', visitCount.toString());
}