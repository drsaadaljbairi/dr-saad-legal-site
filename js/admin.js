function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        const password = prompt('أدخل كلمة المرور للدخول إلى لوحة التحكم:');
        if (password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('loginTime', new Date().getTime());
        } else {
            alert('كلمة المرور غير صحيحة');
            window.location.href = 'index.html';
        }
    }
}

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active-tab'));
        tabContents.forEach(c => c.classList.add('hidden'));
        
        btn.classList.add('active-tab');
        const tabName = btn.getAttribute('data-tab');
        const tabContent = document.getElementById(`${tabName}-tab`);
        tabContent.classList.remove('hidden');
        
        const titles = {
            'dashboard': 'لوحة التحكم',
            'articles': 'إدارة المقالات',
            'services': 'إدارة الخدمات',
            'messages': 'الرسائل',
            'settings': 'الإعدادات'
        };
        document.getElementById('pageTitle').textContent = titles[tabName];
        
        if (tabName === 'articles') loadArticlesData();
        if (tabName === 'services') loadServicesData();
        if (tabName === 'messages') loadMessagesData();
        if (tabName === 'dashboard') loadDashboardData();
    });
});

function loadDashboardData() {
    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const visitCount = localStorage.getItem('visitCount') || '0';
    
    document.getElementById('articlesCount').textContent = articles.length;
    document.getElementById('messagesCount').textContent = messages.length;
    document.getElementById('visitorsCount').textContent = visitCount;
}

function loadArticlesData() {
    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    const tableBody = document.getElementById('articlesTableBody');
    
    if (articles.length === 0) {
        tableBody.innerHTML = '<tr><td class="p-4 text-center text-gray-500" colspan="3">لا توجد مقالات</td></tr>';
    } else {
        tableBody.innerHTML = articles.map((article, index) => `
            <tr>
                <td class="p-4">${article.title}</td>
                <td class="p-4">${article.date}</td>
                <td class="p-4 space-x-2">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="editArticle(${index})">تعديل</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick="deleteArticle(${index})">حذف</button>
                </td>
            </tr>
        `).join('');
    }
}

function loadServicesData() {
    const services = JSON.parse(localStorage.getItem('services')) || [
        { name: 'استشارات قانونية', desc: 'استشارات متخصصة في القانون الجنائي', icon: 'fa-balance-scale' },
        { name: 'دورات تدريبية', desc: 'برامج تدريبية احترافية', icon: 'fa-book' },
        { name: 'دراسات قانونية', desc: 'أبحاث ودراسات متعمقة', icon: 'fa-pen-fancy' }
    ];
    
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = services.map((service, index) => `
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-4xl text-red-700 mb-4"><i class="fas ${service.icon}"></i></div>
            <h3 class="text-xl font-bold mb-2">${service.name}</h3>
            <p class="text-gray-600 mb-4">${service.desc}</p>
            <div class="space-x-2">
                <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="editService(${index})">تعديل</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick="deleteService(${index})">حذف</button>
            </div>
        </div>
    `).join('');
}

function loadMessagesData() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const messagesList = document.getElementById('messagesList');
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p class="text-gray-500 text-center py-8">لا توجد رسائل</p>';
    } else {
        messagesList.innerHTML = messages.map((msg, index) => `
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-lg">${msg.name}</h3>
                        <p class="text-gray-500 text-sm">${msg.email}</p>
                    </div>
                    <span class="text-gray-400 text-sm">${msg.date}</span>
                </div>
                <p class="text-gray-700 mb-4">${msg.message}</p>
                <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onclick="deleteMessage(${index})">حذف</button>
            </div>
        `).join('');
    }
}

const articleModal = document.getElementById('articleModal');
const addArticleBtn = document.getElementById('addArticleBtn');
const closeArticleModal = document.getElementById('closeArticleModal');
const articleForm = document.getElementById('articleForm');

if (addArticleBtn) {
    addArticleBtn.addEventListener('click', () => {
        articleForm.reset();
        articleModal.classList.add('active');
    });
}

if (closeArticleModal) {
    closeArticleModal.addEventListener('click', () => {
        articleModal.classList.remove('active');
    });
}

if (articleForm) {
    articleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const articles = JSON.parse(localStorage.getItem('articles')) || [];
        
        articles.push({
            title: document.getElementById('articleTitle').value,
            content: document.getElementById('articleContent').value,
            author: document.getElementById('articleAuthor').value,
            date: new Date().toLocaleDateString('ar-KW')
        });
        
        localStorage.setItem('articles', JSON.stringify(articles));
        articleModal.classList.remove('active');
        loadArticlesData();
        alert('تمت إضافة المقالة بنجاح');
    });
}

const serviceModal = document.getElementById('serviceModal');
const addServiceBtn = document.getElementById('addServiceBtn');
const closeServiceModal = document.getElementById('closeServiceModal');
const serviceForm = document.getElementById('serviceForm');

if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
        serviceForm.reset();
        serviceModal.classList.add('active');
    });
}

if (closeServiceModal) {
    closeServiceModal.addEventListener('click', () => {
        serviceModal.classList.remove('active');
    });
}

if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const services = JSON.parse(localStorage.getItem('services')) || [];
        
        services.push({
            name: document.getElementById('serviceName').value,
            desc: document.getElementById('serviceDesc').value,
            icon: document.getElementById('serviceIcon').value || 'fa-star'
        });
        
        localStorage.setItem('services', JSON.stringify(services));
        serviceModal.classList.remove('active');
        loadServicesData();
        alert('تمت إضافة الخدمة بنجاح');
    });
}

function deleteArticle(index) {
    if (confirm('هل تريد حذف هذه المقالة؟')) {
        const articles = JSON.parse(localStorage.getItem('articles')) || [];
        articles.splice(index, 1);
        localStorage.setItem('articles', JSON.stringify(articles));
        loadArticlesData();
    }
}

function deleteService(index) {
    if (confirm('هل تريد حذف هذه الخدمة؟')) {
        const services = JSON.parse(localStorage.getItem('services')) || [];
        services.splice(index, 1);
        localStorage.setItem('services', JSON.stringify(services));
        loadServicesData();
    }
}

function deleteMessage(index) {
    if (confirm('هل تريد حذف هذه الرسالة؟')) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.splice(index, 1);
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessagesData();
    }
}

const saveSettingsBtn = document.getElementById('saveSettingsBtn');
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        const settings = {
            email: document.getElementById('emailSetting').value,
            phone: document.getElementById('phoneSetting').value,
            location: document.getElementById('locationSetting').value
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        alert('تم حفظ الإعدادات بنجاح');
    });
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    document.getElementById('emailSetting').value = settings.email || '';
    document.getElementById('phoneSetting').value = settings.phone || '';
    document.getElementById('locationSetting').value = settings.location || '';
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    });
}

window.addEventListener('load', () => {
    checkAuth();
    loadDashboardData();
    loadSettings();
});