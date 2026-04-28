const PMP_DICTIONARY = {
    "critical path": "Đường găng: Chuỗi công việc dài nhất, quyết định thời gian ngắn nhất của dự án.",
    "float": "Thời gian dự phòng: Thời gian một việc có thể trễ mà không làm chậm dự án.",
    "baseline": "Đường cơ sở: Phiên bản được phê duyệt dùng để đo lường hiệu suất.",
    "stakeholder": "Bên liên quan: Những người ảnh hưởng hoặc bị ảnh hưởng bởi dự án.",
    "wbs": "Cấu trúc phân chia công việc: Phân rã dự án thành các phần nhỏ dễ quản lý.",
    "mvp": "Sản phẩm khả thi tối thiểu: Phiên bản sản phẩm đủ tính năng để phản hồi.",
    "sprint": "Giai đoạn nước rút: Chu kỳ làm việc cố định trong Agile (1-4 tuần)."
};

let words = JSON.parse(localStorage.getItem('myWords')) || [];
let currentIndex = 0;

const card = document.getElementById('card');
const wordFront = document.getElementById('word-front');
const meaningBack = document.getElementById('meaning-back');
const totalCountLabel = document.getElementById('total-count');

card.addEventListener('click', () => card.classList.toggle('flipped'));

async function autoTranslate() {
    const wordInput = document.getElementById('new-word');
    const meaningInput = document.getElementById('new-meaning');
    const loading = document.getElementById('loading');
    const word = wordInput.value.trim();

    if (!word) return;
    loading.style.display = 'block';

    // 1. Kiểm tra từ điển PMP
    if (PMP_DICTIONARY[word.toLowerCase()]) {
        meaningInput.value = "📘 PMP: " + PMP_DICTIONARY[word.toLowerCase()];
        loading.style.display = 'none';
        return;
    }

    // 2. Nếu không có, dùng Google Translate miễn phí
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(word)}`;
        const res = await fetch(url);
        const data = await res.json();
        meaningInput.value = data[0][0][0];
    } catch (e) {
        meaningInput.placeholder = "Lỗi kết nối, hãy tự nhập nghĩa...";
    } finally {
        loading.style.display = 'none';
    }
}

function addWord() {
    const word = document.getElementById('new-word').value.trim();
    const meaning = document.getElementById('new-meaning').value.trim();
    if (word && meaning) {
        words.push({ word, meaning });
        localStorage.setItem('myWords', JSON.stringify(words));
        document.getElementById('new-word').value = '';
        document.getElementById('new-meaning').value = '';
        updateCard();
    }
}

function clearCurrentWord() {
    if (words.length === 0) return;
    words.splice(currentIndex, 1);
    localStorage.setItem('myWords', JSON.stringify(words));
    if (currentIndex >= words.length) currentIndex = 0;
    updateCard();
}

function nextCard() {
    if (words.length === 0) return;
    currentIndex = (currentIndex + 1) % words.length;
    updateCard();
}

function updateCard() {
    totalCountLabel.innerText = words.length;
    if (words.length > 0) {
        card.classList.remove('flipped');
        setTimeout(() => {
            wordFront.innerText = words[currentIndex].word;
            meaningBack.innerText = words[currentIndex].meaning;
        }, 200);
    } else {
        wordFront.innerText = "Trống! Hãy thêm từ mới.";
        meaningBack.innerText = "Chưa có dữ liệu";
    }
}

updateCard();
